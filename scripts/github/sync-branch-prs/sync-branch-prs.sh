#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "${script_dir}/../../lib/repo-root.sh"
cd_repo_root

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

read -r -a target_branch_list <<<"${target_branches}"
if [[ "${#target_branch_list[@]}" -eq 0 ]]; then
  echo "TARGET_BRANCHES did not contain any valid branch names." >&2
  exit 1
fi

echo "Sync source branch: ${source_branch}"
echo "Target branches: ${target_branches}"

if ! git ls-remote --exit-code --heads origin "${source_branch}" >/dev/null 2>&1; then
  echo "SOURCE_BRANCH '${source_branch}' does not exist on origin." >&2
  exit 1
fi

git fetch origin "${source_branch}" --depth=200

for target_branch in "${target_branch_list[@]}"; do
  if [[ "${target_branch}" == "${source_branch}" ]]; then
    echo "Skipping ${target_branch}: same as source."
    continue
  fi

  if ! git ls-remote --exit-code --heads origin "${target_branch}" >/dev/null 2>&1; then
    echo "Skipping ${target_branch}: branch does not exist on origin."
    continue
  fi

  git fetch origin "${target_branch}" --depth=200

  existing_pr_number="$(
    gh pr list \
      --repo "${repository}" \
      --state open \
      --base "${target_branch}" \
      --head "${owner}:${source_branch}" \
      --json number \
      --jq '.[0].number // ""'
  )"
  existing_pr_url="$(
    gh pr list \
      --repo "${repository}" \
      --state open \
      --base "${target_branch}" \
      --head "${owner}:${source_branch}" \
      --json url \
      --jq '.[0].url // ""'
  )"

  behind_count="$(git rev-list --count "origin/${target_branch}..origin/${source_branch}")"
  if [[ "${behind_count}" -eq 0 ]]; then
    if [[ -n "${existing_pr_number}" ]]; then
      echo "Closing sync PR for ${source_branch} -> ${target_branch}: ${existing_pr_url}"
      gh pr close \
        "${existing_pr_number}" \
        --repo "${repository}" \
        --comment "Closing automatically because \`${target_branch}\` already contains all commits from \`${source_branch}\`."
    fi
    echo "Skipping ${target_branch}: already up to date."
    continue
  fi

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

  set +e
  created_url="$(
    gh pr create \
      --repo "${repository}" \
      --base "${target_branch}" \
      --head "${owner}:${source_branch}" \
      --title "${title}" \
      --body "${body}" 2>&1
  )"
  create_status=$?
  set -e

  if [[ "${create_status}" -ne 0 ]]; then
    printf "%s\n" "${created_url}" >&2
    if grep -Fq "GitHub Actions is not permitted to create or approve pull requests" <<<"${created_url}"; then
      echo "Branch sync requires a token that can create pull requests." >&2
      echo "Set GITHUB_TOKEN with 'repo' scope in your workflow to enable this." >&2
    fi
    exit "${create_status}"
  fi

  echo "Created sync PR for ${source_branch} -> ${target_branch}: ${created_url}"
done
