# Unimetrics Frontend Monorepo

Monorepo for Unimetrics client-facing products and shared packages:

- `landing`: Astro marketing site
- `app`: React + Vite web app
- `mobile`: Expo React Native app
- `api`: shared TypeScript API client/core package
- `cli`: operations CLI (`lpdesk`)
- `ui`: shared tokens and Tailwind preset

## Requirements

- Node `>=24 <25`
- pnpm `10.11.0`

## Quick Start

```sh
nvm use
pnpm install
pnpm dev
```

`pnpm dev` starts the landing site (`@unimetrics/landing`).

## Run Specific Targets

```sh
pnpm dev                              # landing (Astro)
pnpm --filter @unimetrics/app dev     # web app (Vite)
pnpm mobile                           # mobile (Expo)
pnpm ios                              # Expo iOS
pnpm android                          # Expo Android
pnpm web:mobile                       # Expo web target
pnpm cli:help                         # CLI usage
```

## Quality And Build

```sh
pnpm lint
pnpm test
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
