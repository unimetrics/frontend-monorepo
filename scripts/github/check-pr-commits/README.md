# check-pr-commits

## What

Runs commitlint for all commits in the PR branch range (`merge-base(base, head)..head`).

## Why

Validates commit messages across the whole PR, not just the last commit.

## How to use

From repo root:

```bash
PR_BASE_REF=main PR_HEAD_SHA=$(git rev-parse HEAD) \
  bash scripts/github/check-pr-commits/check-pr-commits.sh
```

## Inputs

- Env:
  - `PR_BASE_REF` or `GITHUB_BASE_REF` (preferred): base branch name.
  - `PR_HEAD_SHA` (optional, defaults to `HEAD`): PR head commit.
  - `PR_BASE_SHA` (optional fallback if no base ref is provided).

## Output

- Prints linted commit range.
- Prints `No PR commits to lint.` if range is empty.
- Exits non-zero when commitlint fails.
