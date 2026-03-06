# apply-rulesets

## What

Syncs repository branch rulesets from `.github/rulesets/*.json` to GitHub via `gh api`.

## Why

Keeps branch protection/ruleset configuration versioned in git and reproducible.

## How to use

From repo root:

```bash
GITHUB_REPOSITORY=owner/repo GH_TOKEN=<token> \
  bash scripts/github/apply-rulesets/apply-rulesets.sh
```

Or pass repository as the first argument:

```bash
bash scripts/github/apply-rulesets/apply-rulesets.sh owner/repo
```

## Inputs

- Arg 1 (optional): `owner/repo`.
- Env:
  - `GITHUB_REPOSITORY` (required if arg is not provided).
  - `RULESET_DIR` (optional, defaults to `.github/rulesets`).
  - `GH_TOKEN` (required by `gh api` authentication).

## Output

- Prints whether each ruleset is created or updated.
- Exits non-zero on validation/API errors.
