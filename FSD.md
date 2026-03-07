# FSD Architecture In Monorepo

This repository uses Feature-Sliced Design (FSD) conventions with `steiger`.

## Scope

- `app`: strict FSD checks.
- `landing`: transitional FSD checks while AstroWind structure is gradually migrated.
- `mobile`: transitional FSD checks while Expo structure is gradually migrated.
- `api`, `cli`, `ui`: intentionally excluded from FSD checks because they are not
  UI-sliced front-end applications.

## Target Layer Order

From highest to lowest responsibility:

1. `app`
2. `pages`
3. `widgets`
4. `features`
5. `entities`
6. `shared`

## Required Practices

- Import only from public APIs (`index.ts`) of slices.
- Keep `shared` for reusable, domain-agnostic code.
- Keep page-level orchestration in `pages`/`app`, not in `shared`.
- Avoid direct deep imports into sibling slices.

## Check Commands

- `pnpm lint:fsd` runs Steiger checks on all UI packages.
