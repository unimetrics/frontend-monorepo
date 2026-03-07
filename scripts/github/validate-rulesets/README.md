# validate-rulesets

## Why

Provide a single, reusable validation step for repository branch ruleset JSON files.

## What

Validates all `.json` files in `.github/rulesets` (or `RULESET_DIR`) using `jq`.
Fails fast on invalid JSON, missing directory, or empty ruleset directory.

## How to use

From repo root:

```bash
bash scripts/github/validate-rulesets/validate-rulesets.sh
```

Custom directory:

```bash
RULESET_DIR=.github/rulesets bash scripts/github/validate-rulesets/validate-rulesets.sh
```

## Inputs

- Env:
  - `RULESET_DIR` (optional, defaults to `<repo>/.github/rulesets`)

## Output

- Prints validation summary with number of files checked.
- Exits non-zero on validation errors.
