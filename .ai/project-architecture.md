# Project Architecture (AI Operating Guide)

This document is for AI agents working in this repository. It is optimized for fast orientation, correct workspace targeting, and minimal rework.

## 1. Read Order (Do This First)

1. `.ai/style-guide.md`
2. `.ai/style-guide/react.md` when editing `app/`
3. `.ai/style-guide/astro.md` when editing `landing/`
4. `.ai/style-guide/expo-react-native.md` when editing `mobile/`
5. `.ai/commit-message-policy.md` for commits
6. `.ai/code-review-policy.md` for reviews
7. `.ai/pr-instructions.md` for PR tasks
8. `AGENTS.md` for skill triggers and agent rules

## 2. Repository Facts (Source of Truth)

- Package manager: `pnpm@10.11.0`
- Node engine: `>=24 <25` (root and all workspaces)
- Workspaces (`pnpm-workspace.yaml`): `api`, `app`, `charts`, `cli`, `landing`, `mobile`, `ui`, `docs`
- Primary build CI runs root `pnpm build` and `pnpm lh:check`
- Primary lint CI runs root lint pipeline from `.github/actions/lint/action.yaml`

Use `package.json`, workspace manifests, and workflow files as canonical runtime truth over stale README text.

## 3. Workspace Map

| Workspace | Package               | Purpose                                               | Key Sources                                                                                    | Main Commands                                                           |
| --------- | --------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `api`     | `@unimetrics/api`     | Shared typed API core, handlers, clients, transports  | `api/src/core`, `api/src/handlers`, `api/src/clients`, `api/src/transports`                    | `pnpm --filter @unimetrics/api build`                                   |
| `app`     | `@unimetrics/app`     | Web app (React + Vite + PWA)                          | `app/src/app`, `app/src/pages`, `app/src/shared`                                               | `pnpm --filter @unimetrics/app dev`, `build`, `lint`                    |
| `charts`  | `@unimetrics/charts`  | Shared chart models, formatters, validation, adapters | `charts/src/models`, `charts/src/formatters`, `charts/src/transforms`, `charts/src/validation` | `pnpm --filter @unimetrics/charts lint`, `build`                        |
| `cli`     | `@unimetrics/cli`     | `lpdesk` CLI using shared API contracts               | `cli/bin/lpdesk.ts`, `cli/src/cli.ts`                                                          | `pnpm --filter @unimetrics/cli start -- --help`, `build`                |
| `landing` | `@unimetrics/landing` | Marketing site (Astro, i18n, blog)                    | `landing/src/pages`, `landing/src/components`, `landing/src/data/post`, `landing/src/i18n`     | `pnpm --filter @unimetrics/landing dev`, `build`, `lint`, `lint:i18n`   |
| `mobile`  | `@unimetrics/mobile`  | Expo React Native app                                 | `mobile/src/app`, `mobile/index.ts`, `mobile/app.json`                                         | `pnpm --filter @unimetrics/mobile dev`, `ios`, `android`, `web`, `lint` |
| `ui`      | `@unimetrics/ui`      | Design tokens and adapters                            | `ui/tokens`, `ui/scripts/build-tokens`, `ui/adapters`                                          | `pnpm --filter @unimetrics/ui build`, `dev`, `lint`                     |
| `docs`    | `@unimetrics/docs`    | Docusaurus docs app                                   | `docs/docs`, `docs/blog`, `docs/src`, `docs/docusaurus.config.ts`                              | `pnpm --filter @unimetrics/docs start`, `build`, `typecheck`            |

## 4. Current Dependency Graph

Direct internal workspace dependencies:

- `@unimetrics/landing` -> `@unimetrics/ui`
- `@unimetrics/cli` -> `@unimetrics/api`

All other workspaces are currently independent at package level.

## 5. Task Routing (Fast Decision Rules)

Use this routing before editing:

1. UI token, color system, theme variable change:

- edit `ui/tokens/**/*.json`
- run `pnpm --filter @unimetrics/ui build`
- never hand-edit generated `ui/theme.css` or `ui/tokens.css`

2. Marketing page, SEO metadata, blog, locale copy:

- edit `landing/src/**`
- for blog/CMS content, use `landing/src/data/post/**`
- for locale text, use `landing/src/i18n/messages/*.json`

3. Web app feature, router, providers, app-side i18n or telemetry:

- edit `app/src/**`
- app bootstrap is in `app/src/main.tsx`

4. CLI command behavior:

- edit `cli/src/cli.ts`
- if command contract changes, also edit `api/src/handlers/lpdesk.ts`

5. Shared chart contracts, chart formatters, chart-model validation/transforms:

- edit `charts/src/**`

6. API contract, procedure typing, transport behavior:

- edit `api/src/core/**`, `api/src/handlers/**`, `api/src/transports/**`, `api/src/clients/**`

7. Mobile behavior:

- edit `mobile/src/**`
- native/app metadata in `mobile/app.json`

8. GitHub automation, branch policies, release mechanics:

- workflows in `.github/workflows/**`
- reusable actions in `.github/actions/**`
- scripts in `scripts/github/**`
- rulesets in `.github/rulesets/**`

## 6. Root-Level Commands (What They Actually Do)

```bash
pnpm setup             # install + husky + allow-scripts
pnpm dev               # runs ui dev + landing dev in parallel
pnpm build             # builds ui, then landing (not full monorepo build)
pnpm lint              # recursive lint scripts where present
pnpm lint:eslint       # root eslint across repo patterns
pnpm lint:circular     # madge circular checks for api/app/charts/cli/landing/mobile/docs/ui
pnpm lint:fsd          # steiger checks app/landing/mobile
pnpm lint:i18n         # recursive i18n lint where present
pnpm format            # prettier --check
pnpm syncpack:check    # dependency range/version consistency
pnpm changeset         # create changeset
pnpm changeset:status
pnpm changeset:version
```

Important coverage notes:

- Root `pnpm build` does not build `api`, `app`, `charts`, `cli`, `mobile`, or `docs`.
- Root has no `test` script.
- Workspace `test` scripts currently print placeholder text in `api`, `app`, `charts`, `cli`, and `mobile`.

## 7. Workspace Command Matrix

```bash
pnpm --filter @unimetrics/api build
pnpm --filter @unimetrics/app dev
pnpm --filter @unimetrics/app build
pnpm --filter @unimetrics/app lint
pnpm --filter @unimetrics/charts lint
pnpm --filter @unimetrics/charts build
pnpm --filter @unimetrics/cli start -- --help
pnpm --filter @unimetrics/cli build
pnpm --filter @unimetrics/landing dev
pnpm --filter @unimetrics/landing build
pnpm --filter @unimetrics/landing lint
pnpm --filter @unimetrics/landing lint:i18n
pnpm --filter @unimetrics/mobile dev
pnpm --filter @unimetrics/mobile ios
pnpm --filter @unimetrics/mobile android
pnpm --filter @unimetrics/mobile web
pnpm --filter @unimetrics/mobile lint
pnpm --filter @unimetrics/ui dev
pnpm --filter @unimetrics/ui build
pnpm --filter @unimetrics/ui lint
pnpm --filter @unimetrics/docs start
pnpm --filter @unimetrics/docs build
pnpm --filter @unimetrics/docs typecheck
```

## 8. Architecture Constraints

1. FSD boundaries:

- target layers: `app -> pages -> widgets -> features -> entities -> shared`
- strict checks mainly for `app`
- `landing` and `mobile` use temporary relaxed Steiger rules
- `api`, `charts`, `cli`, `ui` are excluded from FSD checks

2. Script standards:

- automation scripts must be Bash (`.sh`) or TypeScript (`.ts`)
- script docs required in each script directory (`README.md`)
- update callsites when script paths change

3. Design tokens:

- token source files live in `ui/tokens/**`
- generated artifacts live at `ui/theme.css` and `ui/tokens.css`
- consumer apps should import generated outputs, not redefine token palettes

## 9. Environment and Runtime Inputs

App (`app/src/vite-env.d.ts`):

- `VITE_GA_MEASUREMENT_ID`
- `VITE_SENTRY_DSN`
- `VITE_SENTRY_ENVIRONMENT`
- `VITE_SENTRY_RELEASE`
- `VITE_SENTRY_TRACES_SAMPLE_RATE`
- `VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE`
- `VITE_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE`

CLI (`cli/src/cli.ts`):

- `LPDESK_API_URL`
- `LPDESK_API_TOKEN`

Landing analytics is configured in `landing/src/config.yaml` (`analytics.vendors.googleAnalytics.id`) and used only in production builds.

## 10. CI and Branching Model

- Long-lived branches: `dev`, `test`, `main`
- Promotion flow: `dev -> test -> main`
- Branch sync automation from `main` to `test` and `dev` exists
- Changesets are required for release-tracked changes
- Lint and build workflows run on pull requests, merge groups, and pushes to long-lived branches

## 11. AI Execution Playbook

For any task:

1. Identify impacted workspace(s) from file paths and ownership above.
2. Apply the relevant style guide before editing.
3. Edit source-of-truth files only, not generated outputs.
4. Run the smallest validating command set for changed workspace first.
5. Run root checks when change crosses workspaces or touches tooling/workflows.
6. If scripts/workflows/docs behavior changes, update docs in the same change.

If commands or docs conflict, trust:

1. `package.json` scripts
2. workflow/action files
3. config files (`pnpm-workspace.yaml`, `tsconfig`, `eslint`, `steiger`)
4. README text
