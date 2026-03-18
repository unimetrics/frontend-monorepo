# Docusaurus Style Guide (`docs`)

Use this guide for changes inside `docs/` (Docusaurus + MDX + TypeScript).
For PR process and merge rules, also follow `../pr-instructions.md`.

## Core Principles

- Keep docs accurate to the current repository state.
- Optimize for clarity and scannability over prose volume.
- Prefer stable navigation and predictable information architecture.
- Treat broken links and stale commands as correctness bugs.

## Structure and Navigation

- Keep documentation pages in `docs/docs/**`.
- Keep custom React components in `docs/src/components/**`.
- Keep global docs styles in `docs/src/css/custom.css`; avoid scattering global overrides.
- Update `docs/sidebars.ts` when adding, moving, or removing doc pages.

## Content Quality

- Use explicit headings and a consistent hierarchy.
- Keep examples executable or clearly marked as pseudo-code.
- Prefer repository-accurate commands (`pnpm`, workspace filters, real file paths).
- Avoid stale references to removed workspaces, scripts, or branch flows.

## MD/MDX Conventions

- Use frontmatter consistently when required by existing patterns.
- Keep imports in MDX minimal and local to the page purpose.
- Avoid heavy interactive UI in docs unless it materially improves understanding.
- Use fenced code blocks with language tags whenever possible.

## Docusaurus and Config Safety

- Treat `docs/docusaurus.config.ts` and `docs/sidebars.ts` as deployment-impacting files.
- Keep `onBrokenLinks` strict behavior intact unless explicitly requested.
- Do not change routing, base URL, or i18n defaults without a migration note.
- Keep plugin/preset changes minimal and clearly justified.

## Styling

- Prefer local component styling or narrowly scoped CSS over broad global selectors.
- Keep typography and spacing consistent across pages.
- Avoid introducing one-off visual patterns for single pages without reason.
- Preserve readable contrast and keyboard-accessible interaction states.

## Validation

- Run `pnpm --filter @unimetrics/docs typecheck` for TypeScript-affecting changes.
- Run `pnpm --filter @unimetrics/docs build` for structural/content/config changes.
- Validate changed links and navigation paths in the built output.

## PR Checklist (Docusaurus)

- Page structure and sidebar entries are consistent.
- Commands/paths/workspace names are current and accurate.
- MDX/component usage is minimal and justified.
- Config changes are deliberate and documented.
- Typecheck/build pass for `@unimetrics/docs`.
