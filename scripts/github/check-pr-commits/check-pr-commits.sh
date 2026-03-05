#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../../.."

base_sha="${PR_BASE_SHA:-}"
base_ref="${PR_BASE_REF:-${GITHUB_BASE_REF:-}}"
head_sha="${PR_HEAD_SHA:-HEAD}"

if ! git cat-file -e "${head_sha}^{commit}" >/dev/null 2>&1; then
  echo "Head commit $head_sha is not available in local clone." >&2
  exit 1
fi

if [[ -n "$base_ref" ]]; then
  if ! git show-ref --verify --quiet "refs/remotes/origin/$base_ref"; then
    git fetch origin "$base_ref" --depth=200
  fi

  base_sha="$(git merge-base "origin/$base_ref" "$head_sha")"
elif [[ -z "$base_sha" ]]; then
  echo "PR_BASE_REF/GITHUB_BASE_REF or PR_BASE_SHA is required to lint PR commits." >&2
  exit 1
fi

if ! git cat-file -e "${base_sha}^{commit}" >/dev/null 2>&1; then
  echo "Base commit $base_sha is not available in local clone." >&2
  exit 1
fi

echo "Linting commit messages in range: ${base_sha}..${head_sha}"

commit_count="$(git rev-list --count "${base_sha}..${head_sha}")"
if [[ "$commit_count" -eq 0 ]]; then
  echo "No PR commits to lint."
  exit 0
fi

pnpm exec commitlint --from "$base_sha" --to "$head_sha" --verbose
