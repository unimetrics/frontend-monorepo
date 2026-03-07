# UI Scripts

### `build-tokens.ts`

#### Why

Generate deterministic token artifacts from Tokens Studio JSON sources so app/runtime styles do not depend on manual edits.

#### What

Builds token outputs using Style Dictionary + `@tokens-studio/sd-transforms`:

- runtime variables in `ui/tokens.css`
- Tailwind mapping in `ui/theme.css`
- resolved theme snapshots in `ui/tokens/generated/*.json`

#### How to use

```bash
tsx ui/scripts/build-tokens/build-tokens.ts
```

Watch mode:

```bash
pnpm --filter @unimetrics/ui dev
```

#### Inputs

- `ui/tokens/sets/*.json`
- `ui/tokens/$themes.json`

#### Output

- `ui/tokens.css`
- `ui/theme.css`
- `ui/tokens/generated/light.json`
- `ui/tokens/generated/dark.json`

Failure behavior:

- Exits non-zero with clear error message for invalid/missing token sets, invalid theme selection, unknown references, or circular references.
