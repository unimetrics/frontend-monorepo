#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
ruleset_dir="${RULESET_DIR:-${repo_root}/.github/rulesets}"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required to validate ruleset JSON files." >&2
  exit 1
fi

if [[ ! -d "${ruleset_dir}" ]]; then
  echo "Ruleset directory not found: ${ruleset_dir}" >&2
  exit 1
fi

ruleset_files=()
while IFS= read -r ruleset_file; do
  ruleset_files+=("${ruleset_file}")
done < <(find "${ruleset_dir}" -maxdepth 1 -type f -name "*.json" | sort)
if [[ "${#ruleset_files[@]}" -eq 0 ]]; then
  echo "No ruleset files found in ${ruleset_dir}" >&2
  exit 1
fi

for ruleset_file in "${ruleset_files[@]}"; do
  jq empty "${ruleset_file}"
done

echo "Validated ${#ruleset_files[@]} ruleset JSON file(s): ${ruleset_dir}"
