# Unimetrics Frontend Monorepo

Monorepo for Unimetrics frontend surfaces:

- `landing`: Astro marketing site
- `app`: React + Vite web app
- `mobile`: Expo React Native app
- `ui`: shared tokens and UI-kit foundations

## Requirements

- Node `24.x`
- pnpm `10.11.0`

## Quick Start

```sh
nvm use
pnpm install
pnpm dev
```

## Common Commands

```sh
pnpm dev            # run all app dev servers
pnpm build          # build all workspaces
pnpm lint           # run workspace lint/typecheck
pnpm test           # run workspace tests
pnpm mobile         # run Expo mobile dev
pnpm syncpack:check # verify dependency consistency
```

## Releases

This repo uses Changesets:

```sh
pnpm changeset
pnpm changeset:status
pnpm changeset:version
```

See [RELEASING.md](./RELEASING.md) for details.

## Collaboration Docs

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [FSD.md](./FSD.md)
- [SECURITY.md](./SECURITY.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
