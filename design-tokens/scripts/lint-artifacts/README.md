# lint-artifacts.ts

## Why

The script checks if generated CSS files (exported by the design-tokens package) are in sync with design token JSON sources by building and checking git state.

## What

Checks git diff state for generated token outputs:

- `design-tokens/tokens.css`
- `design-tokens/theme.css`

Fails when any of these files are modified after token build.

## How to use

Direct script run:

```bash
tsx design-tokens/scripts/lint-artifacts/lint-artifacts.ts
```

## Inputs

- Git working tree state for:
  - `design-tokens/tokens.css`
  - `design-tokens/theme.css`

## Output

- Pass/fail result for generated token artifact freshness.

Failure behavior:

- Exits non-zero with clear error output listing stale generated files.
