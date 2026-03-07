# Design Tokens Source

Source of truth for UI tokens in Tokens Studio-style JSON format.

## Structure

- `sets/core.json`: primitives + shared foundations (typography, spacing, radius, shadow, motion)
- `sets/semantic.light.json`: semantic tokens for light theme
- `sets/semantic.dark.json`: semantic tokens for dark theme
- `$themes.json`: theme-to-set mapping using `selectedTokenSets`
- `generated/*.json`: resolved outputs per theme (generated)

## Build

```bash
pnpm build
```

Watch and rebuild on token JSON changes:

```bash
pnpm dev
```

This generates:

- `ui/tokens.css` (runtime CSS custom properties)
- `ui/tokens/generated/light.json`
- `ui/tokens/generated/dark.json`

Do not edit generated files manually.
