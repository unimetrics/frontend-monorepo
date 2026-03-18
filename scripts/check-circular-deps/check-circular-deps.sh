#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "${script_dir}/../lib/repo-root.sh"
cd_repo_root

run_madge() {
  local workspace="$1"
  shift

  echo "==> Checking circular dependencies in ${workspace}"
  pnpm exec madge \
    --circular \
    --exclude "(^|/)dist/|\\.d\\.ts$" \
    --extensions ts,tsx,js,mjs,cjs \
    "$@"
}

has_supported_files() {
  local path="$1"

  if [[ -d "${path}" ]]; then
    local found_file
    found_file="$(find "${path}" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.mjs" -o -name "*.cjs" \) -print -quit)"
    [[ -n "${found_file}" ]]
    return
  fi

  case "${path}" in
    *.ts | *.tsx | *.js | *.mjs | *.cjs) return 0 ;;
    *) return 1 ;;
  esac
}

list_workspace_entries() {
  pnpm list -r --depth=-1 --json |
    node -e '
      const fs = require("node:fs");
      const repoRoot = process.cwd();
      const workspaces = JSON.parse(fs.readFileSync(0, "utf8"));
      for (const workspace of workspaces) {
        if (!workspace.path || workspace.path === repoRoot) {
          continue;
        }

        const relPath = workspace.path.startsWith(`${repoRoot}/`)
          ? workspace.path.slice(repoRoot.length + 1)
          : workspace.path;
        const label = workspace.name ?? relPath;
        process.stdout.write(`${label}\t${relPath}\n`);
      }
    '
}

workspace_entries="$(list_workspace_entries)"
if [[ -z "${workspace_entries}" ]]; then
  echo "No workspaces discovered from pnpm list -r --depth=-1 --json."
  exit 1
fi

while IFS=$'\t' read -r workspace_name workspace_rel_path; do
  [[ -z "${workspace_rel_path}" ]] && continue

  if [[ ! -d "${workspace_rel_path}" ]]; then
    echo "==> Skipping ${workspace_name} (missing path: ${workspace_rel_path})"
    continue
  fi

  tsconfig_path=""
  if [[ -f "${workspace_rel_path}/tsconfig.app.json" ]]; then
    tsconfig_path="${workspace_rel_path}/tsconfig.app.json"
  elif [[ -f "${workspace_rel_path}/tsconfig.json" ]]; then
    tsconfig_path="${workspace_rel_path}/tsconfig.json"
  fi

  candidate_targets=()
  for target in src bin scripts adapters vendor; do
    if [[ -e "${workspace_rel_path}/${target}" ]]; then
      candidate_targets+=("${workspace_rel_path}/${target}")
    fi
  done
  for target in index.ts docusaurus.config.ts sidebars.ts; do
    if [[ -e "${workspace_rel_path}/${target}" ]]; then
      candidate_targets+=("${workspace_rel_path}/${target}")
    fi
  done

  madge_targets=()
  for target in "${candidate_targets[@]}"; do
    if has_supported_files "${target}"; then
      madge_targets+=("${target}")
    fi
  done

  if [[ "${#madge_targets[@]}" -eq 0 ]]; then
    echo "==> Skipping ${workspace_name} (no TypeScript/JavaScript targets found)"
    continue
  fi

  madge_args=()
  if [[ -n "${tsconfig_path}" ]]; then
    madge_args+=(--ts-config "${tsconfig_path}")
  fi
  madge_args+=("${madge_targets[@]}")

  run_madge "${workspace_name}" "${madge_args[@]}"
done <<<"${workspace_entries}"
