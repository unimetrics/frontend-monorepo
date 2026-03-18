# Project Architecture (AI Operating Guide)

This document is for AI agents working in this repository. It is optimized for fast orientation, correct workspace targeting, and minimal rework.

## 1. Read Order (Do This First)

1. `.ai/style-guide.md`
2. `.ai/style-guide/react.md` when editing `app/`
3. `.ai/style-guide/astro.md` when editing `landing/`
4. `.ai/style-guide/expo-react-native.md` when editing `mobile/`
5. `.ai/style-guide/docusaurus.md` when editing `docs/`
6. `.ai/commit-message-policy.md` for commits
7. `.ai/code-review-policy.md` for reviews
8. `.ai/pr-instructions.md` for PR tasks
9. `AGENTS.md` for skill triggers and agent rules

## 2. Repository Facts (Source of Truth)

- Package manager: `pnpm@10.11.0`
- Node engine: `>=24 <25` (root and all workspaces)
- Workspaces are defined in `pnpm-workspace.yaml` (source of truth)
- Runtime workspace listing: `pnpm list -r --depth=-1 --json`
- Primary build CI runs root `pnpm build` and `pnpm lh:check`
- Primary lint CI runs root lint pipeline from `.github/actions/lint/action.yaml`

Use `package.json`, workspace manifests, and workflow files as canonical runtime truth over stale README text.

## 3. Workspace Discovery

- Use `pnpm-workspace.yaml` as the canonical workspace set.
- Use `pnpm list -r --depth=-1 --json` when you need the current workspace/package names and paths.
- For workspace-specific commands and behavior, inspect each workspace `package.json` directly.

## 4. Current Dependency Graph

Direct internal workspace dependencies:

- `@unimetrics/landing` -> `@unimetrics/design-tokens`
- `@unimetrics/cli` -> `@unimetrics/api`

All other workspaces are currently independent at package level.

## 5. Task Routing (Fast Decision Rules)

Use this routing before editing:

1. UI token, color system, theme variable change:

- edit `design-tokens/tokens/**/*.json`
- run `pnpm --filter @unimetrics/design-tokens build`
- never hand-edit generated `design-tokens/theme.css` or `design-tokens/tokens.css`

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
pnpm dev               # runs design-tokens dev + landing dev in parallel
pnpm build             # builds design-tokens, then landing (not full monorepo build)
pnpm lint              # recursive lint scripts where present
pnpm lint:eslint       # root eslint across repo patterns
pnpm lint:circular     # madge circular checks for workspaces discovered from pnpm
pnpm lint:fsd          # steiger checks for configured UI workspace scopes
pnpm lint:i18n         # recursive i18n lint where present
pnpm format            # prettier --check
pnpm syncpack:check    # dependency range/version consistency
pnpm changeset         # create changeset
pnpm changeset:status
pnpm changeset:version
```

Important coverage notes:

- Root `pnpm build` runs only what is wired in the root `build` script.
- Root has no `test` script.
- Workspace `test` script behavior should be verified from each workspace `package.json`.

## 7. Workspace Command Discovery

```bash
pnpm list -r --depth=-1 --json
pnpm --filter <workspace-package-name> <script>
pnpm --filter <workspace-package-name> run <script>
```

## 8. Architecture Constraints

1. FSD boundaries:

- canonical FSD guidance is in `README.md#fsd-architecture`
- target layers: `app -> pages -> widgets -> features -> entities -> shared`
- strict/relaxed scopes are defined by `pnpm lint:fsd` and `steiger.config.ts`
- workspaces not wired into that lint flow are out of FSD scope by default

2. Script standards:

- automation scripts must be Bash (`.sh`) or TypeScript (`.ts`)
- script docs required in each script directory (`README.md`)
- update callsites when script paths change

3. Design tokens:

- token source files live in `design-tokens/tokens/**`
- generated artifacts live at `design-tokens/theme.css` and `design-tokens/tokens.css`
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
