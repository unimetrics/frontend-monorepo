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
body_file="${BODY_FILE:-release-notes.md}"

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

tag_name="release-${merge_sha}"
release_name="Release ${merge_sha:0:7}"

{
  echo "# ${pr_title}"
  echo
  echo "Source PR: [#${pr_number}](${pr_url})"
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
