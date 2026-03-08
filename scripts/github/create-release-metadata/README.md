# create-release-metadata

## What

Builds release metadata and release notes content for GitHub Release workflow.
It derives release versioning from the monorepo `package.json` version and the repository revision count at the merged commit.

## Why

Centralizes release note generation logic and exposes outputs in a workflow-friendly format.

## How to use

From repo root:

```bash
MERGE_SHA=<sha> PR_NUMBER=<number> PR_TITLE=<title> PR_URL=<url> \
PR_BODY=<body> VERSION_FILE=package.json \
bash scripts/github/create-release-metadata/create-release-metadata.sh
```

## Inputs

- Required env:
  - `MERGE_SHA`
  - `PR_NUMBER`
  - `PR_TITLE`
  - `PR_URL`
- Optional env:
  - `PR_BODY`
  - `VERSION_FILE` (default: `package.json`)
  - `BODY_FILE` (default: `${RUNNER_TEMP:-/tmp}/release-notes.md`)
- Required tools:
  - `jq`
- Required repository state:
  - Git history must include `MERGE_SHA` (for `git rev-list --count`).

## Output

- Writes release notes markdown to `${BODY_FILE}`.
- Prints key/value lines for workflow outputs:
  - `tag_name=...`
  - `release_name=...`
  - `body_file=...`
  - `release_version=...`
  - `monorepo_version=...`
  - `rev_count=...`
