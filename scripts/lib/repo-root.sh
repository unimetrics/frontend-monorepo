#!/usr/bin/env bash

resolve_repo_root() {
  local git_root
  if git_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
    printf "%s\n" "${git_root}"
    return 0
  fi

  local source_file="${BASH_SOURCE[1]:-${BASH_SOURCE[0]}}"
  local probe_dir
  probe_dir="$(cd -- "$(dirname -- "${source_file}")" && pwd -P)"

  while [[ "${probe_dir}" != "/" ]]; do
    if [[ -d "${probe_dir}/.git" || -f "${probe_dir}/pnpm-workspace.yaml" ]]; then
      printf "%s\n" "${probe_dir}"
      return 0
    fi
    probe_dir="$(dirname "${probe_dir}")"
  done

  echo "Unable to determine repository root." >&2
  return 1
}

init_repo_root() {
  if [[ -z "${REPO_ROOT:-}" ]]; then
    REPO_ROOT="$(resolve_repo_root)"
    export REPO_ROOT
  fi
}

cd_repo_root() {
  init_repo_root
  cd "${REPO_ROOT}"
}
