#!/usr/bin/env bash

set -euo pipefail
cd "$(dirname "$0")/../../.."

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required"
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required"
  exit 1
fi

repository="${1:-${GITHUB_REPOSITORY:-}}"
if [[ -z "${repository}" || "${repository}" != */* ]]; then
  echo "Usage: GITHUB_REPOSITORY=<owner/repo> $0"
  echo "   or: $0 <owner/repo>"
  exit 1
fi

owner="${repository%/*}"
repo="${repository#*/}"
ruleset_dir="${RULESET_DIR:-.github/rulesets}"

if [[ ! -d "${ruleset_dir}" ]]; then
  echo "Ruleset directory not found: ${ruleset_dir}"
  exit 1
fi

mapfile -t ruleset_files < <(find "${ruleset_dir}" -maxdepth 1 -type f -name "*.json" | sort)
if [[ "${#ruleset_files[@]}" -eq 0 ]]; then
  echo "No ruleset files found in ${ruleset_dir}"
  exit 1
fi

api_base="repos/${owner}/${repo}/rulesets"
api_headers=(
  -H "Accept: application/vnd.github+json"
  -H "X-GitHub-Api-Version: 2022-11-28"
)

existing_rulesets="$(
  gh api "${api_headers[@]}" "${api_base}?includes_parents=false&targets=branch"
)"

for ruleset_file in "${ruleset_files[@]}"; do
  ruleset_name="$(jq -r '.name' "${ruleset_file}")"
  if [[ -z "${ruleset_name}" || "${ruleset_name}" == "null" ]]; then
    echo "Ruleset file has no valid .name: ${ruleset_file}"
    exit 1
  fi

  existing_id="$(
    jq -r \
      --arg ruleset_name "${ruleset_name}" \
      '.[] | select(.source_type == "Repository" and .name == $ruleset_name) | .id' \
      <<<"${existing_rulesets}" | head -n1
  )"

  if [[ -n "${existing_id}" ]]; then
    echo "Updating ruleset '${ruleset_name}' (id: ${existing_id})"
    gh api "${api_headers[@]}" -X PUT "${api_base}/${existing_id}" --input "${ruleset_file}" >/dev/null
  else
    echo "Creating ruleset '${ruleset_name}'"
    gh api "${api_headers[@]}" -X POST "${api_base}" --input "${ruleset_file}" >/dev/null
  fi
done

echo "Rulesets are synced."
