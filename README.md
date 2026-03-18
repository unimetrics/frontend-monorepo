# Unimetrics Frontend Monorepo

Monorepo for Unimetrics client-facing products and shared packages:

- `landing`: Astro marketing site
- `app`: React + Vite web app
- `charts`: shared charting contracts and utilities for web/mobile adapters
- `mobile`: Expo React Native app
- `docs`: Docusaurus documentation site
- `api`: shared TypeScript API client/core package
- `cli`: operations CLI (`lpdesk`)
- `design-tokens`: shared tokens and Tailwind preset

## Requirements

- Node `>=24 <25`
- pnpm `10.11.0`

## Quick Start

```sh
nvm use
pnpm install
pnpm dev
```

`pnpm dev` starts both `@unimetrics/design-tokens` and `@unimetrics/landing`.

## Run Specific Targets

```sh
pnpm dev                              # landing (Astro)
pnpm --filter @unimetrics/app dev     # web app (Vite)
pnpm --filter @unimetrics/docs start  # docs (Docusaurus)
pnpm --filter @unimetrics/mobile dev  # mobile (Expo)
pnpm --filter @unimetrics/mobile ios  # Expo iOS
pnpm --filter @unimetrics/mobile android
pnpm --filter @unimetrics/mobile web  # Expo web target
pnpm --filter @unimetrics/cli start -- --help
pnpm --filter @unimetrics/charts build
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

## Collaboration Docs

- [CONTRIBUTING.md](./CONTRIBUTING.md)
- [FSD.md](./FSD.md)
- [SECURITY.md](./SECURITY.md)
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
