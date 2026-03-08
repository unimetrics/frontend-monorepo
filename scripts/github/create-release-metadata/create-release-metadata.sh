#!/usr/bin/env bash

set -euo pipefail

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
source "${script_dir}/../../lib/repo-root.sh"
cd_repo_root

merge_sha="${MERGE_SHA:-}"
pr_number="${PR_NUMBER:-}"
pr_title="${PR_TITLE:-}"
pr_body="${PR_BODY:-}"
pr_url="${PR_URL:-}"
version_file="${VERSION_FILE:-package.json}"
body_file="${BODY_FILE:-${RUNNER_TEMP:-/tmp}/release-notes.md}"

if [[ -z "${merge_sha}" ]]; then
  echo "MERGE_SHA is required" >&2
  exit 1
fi

if [[ -z "${pr_number}" ]]; then
  echo "PR_NUMBER is required" >&2
  exit 1
fi

if [[ -z "${pr_title}" ]]; then
  echo "PR_TITLE is required" >&2
  exit 1
fi

if [[ -z "${pr_url}" ]]; then
  echo "PR_URL is required" >&2
  exit 1
fi

if [[ ! -f "${version_file}" ]]; then
  echo "Version file not found: ${version_file}" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required" >&2
  exit 1
fi

monorepo_version="$(jq -r '.version // empty' "${version_file}")"

if [[ -z "${monorepo_version}" || "${monorepo_version}" == "null" ]]; then
  echo "version is missing in ${version_file}" >&2
  exit 1
fi

rev_count="$(git rev-list --count "${merge_sha}")"

release_version="${monorepo_version}-${rev_count}"
tag_name="${release_version}"
release_name="${release_version}"

{
  echo "# ${release_name}"
  echo
  echo "Source PR: [#${pr_number}](${pr_url})"
  echo "Merge commit: \`${merge_sha}\`"
  echo
  if [[ -n "${pr_body}" ]]; then
    printf "%s\n" "${pr_body}"
  else
    echo "_No release description was provided in the release PR body._"
  fi
} > "${body_file}"

printf "tag_name=%s\n" "${tag_name}"
printf "release_name=%s\n" "${release_name}"
printf "body_file=%s\n" "${body_file}"
printf "release_version=%s\n" "${release_version}"
printf "monorepo_version=%s\n" "${monorepo_version}"
printf "rev_count=%s\n" "${rev_count}"
