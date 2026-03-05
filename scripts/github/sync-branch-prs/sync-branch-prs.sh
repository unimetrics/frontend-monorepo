#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../../.."

if ! command -v gh >/dev/null 2>&1; then
  echo "gh CLI is required." >&2
  exit 1
fi

repository="${GITHUB_REPOSITORY:-}"
if [[ -z "${repository}" || "${repository}" != */* ]]; then
  echo "GITHUB_REPOSITORY=<owner/repo> is required." >&2
  exit 1
fi
owner="${repository%/*}"

source_branch="${SOURCE_BRANCH:-main}"
target_branches="${TARGET_BRANCHES:-test dev}"

if [[ -z "${target_branches}" ]]; then
  echo "TARGET_BRANCHES cannot be empty." >&2
  exit 1
fi

echo "Sync source branch: ${source_branch}"
echo "Target branches: ${target_branches}"

for target_branch in ${target_branches}; do
  if [[ "${target_branch}" == "${source_branch}" ]]; then
    echo "Skipping ${target_branch}: same as source."
    continue
  fi

  if ! git ls-remote --exit-code --heads origin "${target_branch}" >/dev/null 2>&1; then
    echo "Skipping ${target_branch}: branch does not exist on origin."
    continue
  fi

  git fetch origin "${source_branch}" "${target_branch}" --depth=200

  behind_count="$(git rev-list --count "origin/${target_branch}..origin/${source_branch}")"
  if [[ "${behind_count}" -eq 0 ]]; then
    echo "Skipping ${target_branch}: already up to date."
    continue
  fi

  existing_pr_url="$(
    gh pr list \
      --repo "${repository}" \
      --state open \
      --base "${target_branch}" \
      --head "${owner}:${source_branch}" \
      --json url \
      --jq '.[0].url // ""'
  )"

  if [[ -n "${existing_pr_url}" ]]; then
    echo "Open sync PR already exists for ${source_branch} -> ${target_branch}: ${existing_pr_url}"
    continue
  fi

  title="chore(sync): merge ${source_branch} into ${target_branch}"
  body=$(
    cat <<EOF
Automated sync PR to keep \`${target_branch}\` aligned with \`${source_branch}\`.

- Source branch: \`${source_branch}\`
- Target branch: \`${target_branch}\`
- Trigger: push to \`${source_branch}\`

This PR was created automatically by the branch sync workflow.
EOF
  )

  created_url="$(
    gh pr create \
      --repo "${repository}" \
      --base "${target_branch}" \
      --head "${owner}:${source_branch}" \
      --title "${title}" \
      --body "${body}"
  )"

  echo "Created sync PR for ${source_branch} -> ${target_branch}: ${created_url}"
done
