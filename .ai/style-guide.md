# Style Guide

Use this guide for code changes in this repository.

## Stack and Tooling

- Use `pnpm` (not npm/yarn) for dependency and script commands.
- Respect workspace boundaries (`api`, `app`, `cli`, `landing`, `mobile`, `ui`).
- Use TypeScript/ESM conventions already used in each package.

## Quality Gates

- Keep ESLint and TypeScript checks green.
- Keep Prettier formatting consistent with repo config.
- Prefer minimal, focused diffs over broad refactors.

## Coding Conventions

- Prioritize correctness and explicit behavior over clever shortcuts.
- Preserve existing project structure and naming patterns.
- Add comments only when logic is non-obvious.
- Avoid introducing new dependencies unless clearly needed.

## Safety

- Do not weaken security or validation logic without explicit reason.
- Avoid destructive operations in scripts and migrations.
- Keep backward compatibility for public interfaces unless intentionally changed.
