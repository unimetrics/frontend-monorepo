# Unimetrics Frontend Monorepo

Monorepo for Unimetrics client-facing products and shared packages.

Workspace definitions are sourced from [pnpm-workspace.yaml](./pnpm-workspace.yaml). Avoid maintaining manual workspace lists in docs.

## Requirements

- Node `>=24 <25`
- pnpm `10.11.0`

## Quick Start

```sh
nvm use
pnpm install
pnpm dev
```

`pnpm dev` runs the root `dev` script from `package.json`.

Current workspace/package list:

```sh
pnpm list -r --depth=-1 --json
```

## Run Specific Targets

```sh
pnpm --filter <workspace-package-name> <script>
pnpm --filter <workspace-package-name> run <script>
```

## Quality And Build

```sh
pnpm lint
pnpm build
pnpm syncpack:check
```

## Releases

```sh
pnpm changeset
pnpm changeset:status
pnpm changeset:version
```

See [RELEASING.md](./RELEASING.md) for branch flow and release process.

## FSD Architecture

This repository uses Feature-Sliced Design (FSD) conventions with `steiger`.

### Scope

- FSD scopes are defined by the root `lint:fsd` command and `steiger.config.ts`.
- Workspace membership is defined in `pnpm-workspace.yaml`; do not duplicate that list in docs.
- Workspaces not wired into `lint:fsd` are intentionally out of FSD checks.

### Target Layer Order

From highest to lowest responsibility:

1. `app`
2. `pages`
3. `widgets`
4. `features`
5. `entities`
6. `shared`

### Required Practices

- Import only from public APIs (`index.ts`) of slices.
- Keep `shared` for reusable, domain-agnostic code.
- Keep page-level orchestration in `pages`/`app`, not in `shared`.
- Avoid direct deep imports into sibling slices.

### Check Commands

- `pnpm lint:fsd` runs Steiger checks on configured UI package scopes.

## Collaboration Docs

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [FSD Architecture (this README)](./README.md#fsd-architecture)
- [SECURITY.md](./SECURITY.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
