# @unimetrics/charts

Shared chart domain contracts for Unimetrics web and mobile apps.

## What this workspace contains

- platform-agnostic chart model types
- shared formatter helpers for chart labels/tooltips
- interaction and theme contracts
- lightweight transform and validation utilities
- adapter interfaces (without binding to a renderer yet)

## Why this package exists

Feature code should describe charts in product terms (APY history, LP-vs-hold, range safety), not in renderer-specific option objects.

This workspace is intentionally renderer-agnostic so it can be safely reused by both web and mobile adapters.

## Commands

```sh
pnpm --filter @unimetrics/charts lint
pnpm --filter @unimetrics/charts build
```

## Scope intentionally not added yet

- No direct `echarts` dependency in this package.
- No React or React Native rendering components in this package.

Those renderer bindings should live in dedicated consumer/adapter workspaces once first production chart screens land.
