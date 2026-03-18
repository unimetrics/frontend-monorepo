# build-tokens.ts

## Why

Keep token generation simple and deterministic while preserving runtime theme switching.

## What

Builds token outputs from Tokens Studio JSON sources:

- runtime CSS variables in `design-tokens/tokens.css`
- Tailwind `@theme` mapping in `design-tokens/theme.css`

## How to use

Direct script run:

```bash
tsx design-tokens/scripts/build-tokens/build-tokens.ts
```

## Inputs

- `design-tokens/tokens/core.json`
- `design-tokens/tokens/semantic.json`
- `design-tokens/tokens/themes/light.json`
- `design-tokens/tokens/themes/dark.json`

## Output

- `design-tokens/tokens.css`
- `design-tokens/theme.css`

Failure behavior:

- Exits non-zero with a clear error message for invalid token references, invalid JSON, or build-time transform failures.
