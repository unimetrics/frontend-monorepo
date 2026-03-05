# sync-branch-prs

## What

Creates branch-sync pull requests from one source branch to one or more target branches.

## Why

Keeps long-lived environment branches aligned after new commits land on the source branch (for example `main -> test/dev`) without direct bot pushes to protected branches.

## How to use

From repo root:

```bash
GITHUB_TOKEN=<token> \
GITHUB_REPOSITORY=owner/repo \
SOURCE_BRANCH=main \
TARGET_BRANCHES="test dev" \
bash scripts/github/sync-branch-prs/sync-branch-prs.sh
```

## Inputs

- Required env:
  - `GITHUB_REPOSITORY` (`owner/repo`)
  - `GITHUB_TOKEN` (used by `gh` auth)
- Optional env:
  - `SOURCE_BRANCH` (default: `main`)
  - `TARGET_BRANCHES` space-separated list (default: `test dev`)

## Output

- Prints sync status per target branch.
- For each target branch:
  - skips if already up to date
  - skips if an open sync PR already exists
  - otherwise creates a PR and prints its URL
- Exits non-zero on unexpected CLI/git failures.
