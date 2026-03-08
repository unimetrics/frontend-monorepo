# check-generated-artifacts.ts

## Why

Ensure token linting validates only generated token artifacts and does not fail on unrelated changed files.

## What

Checks git diff state only for generated token outputs:

- `ui/tokens.css`
- `ui/theme.css`

Fails when any of these files are modified after token build.

## How to use

Direct script run:

```bash
tsx ui/scripts/lint-tokens/check-generated-artifacts.ts
```

## Inputs

- Git working tree state for:
  - `ui/tokens.css`
  - `ui/theme.css`

## Output

- Pass/fail result for generated token artifact freshness.

Failure behavior:

- Exits non-zero with clear error output listing stale generated files.
