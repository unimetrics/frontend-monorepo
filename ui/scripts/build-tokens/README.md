# build-tokens.ts

## Why

Keep token generation simple and deterministic while preserving runtime theme switching.

## What

Builds token outputs from Tokens Studio JSON sources:

- runtime CSS variables in `ui/tokens.css`
- Tailwind `@theme` mapping in `ui/theme.css`

## How to use

Direct script run:

```bash
tsx ui/scripts/build-tokens/build-tokens.ts
```

## Inputs

- `ui/tokens/core.json`
- `ui/tokens/semantic.json`
- `ui/tokens/themes/light.json`
- `ui/tokens/themes/dark.json`

## Output

- `ui/tokens.css`
- `ui/theme.css`

Failure behavior:

- Exits non-zero with a clear error message for invalid token references, invalid JSON, or build-time transform failures.
