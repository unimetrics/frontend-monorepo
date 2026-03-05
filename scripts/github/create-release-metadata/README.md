# create-release-metadata

## What

Builds release metadata and release notes content for GitHub Release workflow.

## Why

Centralizes release note generation logic and exposes outputs in a workflow-friendly format.

## How to use

From repo root:

```bash
MERGE_SHA=<sha> PR_NUMBER=<number> PR_TITLE=<title> PR_URL=<url> \
PR_BODY=<body> bash scripts/github/create-release-metadata/create-release-metadata.sh
```

## Inputs

- Required env:
  - `MERGE_SHA`
  - `PR_NUMBER`
  - `PR_TITLE`
  - `PR_URL`
- Optional env:
  - `PR_BODY`
  - `BODY_FILE` (default: `release-notes.md`)

## Output

- Writes release notes markdown to `${BODY_FILE}`.
- Prints key/value lines for workflow outputs:
  - `tag_name=...`
  - `release_name=...`
  - `body_file=...`
