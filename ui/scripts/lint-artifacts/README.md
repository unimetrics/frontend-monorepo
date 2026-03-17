# lint-artifacts.ts

## Why

The script basically checks if generated css files (exported by ui package) are in sync with design tokens json by building it and checking git state.

## What

Checks git diff state for generated token outputs:

- `ui/tokens.css`
- `ui/theme.css`

Fails when any of these files are modified after token build.

## How to use

Direct script run:

```bash
tsx ui/scripts/lint-artifacts/lint-artifacts.ts
```

## Inputs

- Git working tree state for:
  - `ui/tokens.css`
  - `ui/theme.css`

## Output

- Pass/fail result for generated token artifact freshness.

Failure behavior:

- Exits non-zero with clear error output listing stale generated files.
