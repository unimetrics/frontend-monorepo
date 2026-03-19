# Style Guide

Use this guide for code changes in this repository.

For pull request preparation and PR-specific rules, also follow `.ai/pr-instructions.md`.

## Stack and Tooling

- Use `pnpm` (not npm/yarn) for dependency and script commands.
- Respect workspace boundaries defined in `pnpm-workspace.yaml`.
- Use TypeScript/ESM conventions already used in each package.
- Follow existing patterns for imports, exports, and module structure in each package.

## File names conventions

- Use `kebab-case` for file and directory names.
- Use `PascalCase` for React component files and their default exports.
- Readme file always should be named `README.md` and located in the root of the package or subdirectory if it is a readme for that subdirectory.

## Framework-Specific Guides

- React (`app`): `./style-guide/react.md`
- Astro (`landing`): `./style-guide/astro.md`
- Expo React Native (`mobile`): `./style-guide/expo-react-native.md`
- Docusaurus (`docs`): `./style-guide/docusaurus.md`

## Scripts Organization

- Follow `scripts/SCRIPT_STANDARDS.md` for new scripts and updates to existing scripts.

## Quality Gates

- Keep ESLint and TypeScript checks green.
- Keep Prettier formatting consistent with repo config.
- Prefer minimal, focused diffs over broad refactors.

## Coding Conventions

- Prioritize correctness and explicit behavior over clever shortcuts.
- Preserve existing project structure and naming patterns.
- Add comments only when logic is non-obvious.
- Prefer existing abstractions first: use platform APIs, shared internal utilities, and already-installed package helpers before writing custom duplicate logic.
- Do not re-implement behavior that already exists in a maintained abstraction unless there is a clear functional or performance reason.
- Avoid introducing new dependencies unless clearly needed.
- For any styling work, use only design tokens defined in `design-tokens/tokens` (via generated `@unimetrics/design-tokens` token outputs). Do not invent new ad-hoc color tokens or hardcoded palette values unless explicitly requested and added to `design-tokens/tokens` first.
- For Web3 values, use `bigint` and decimal-safe helpers. Never use JS floating-point math for on-chain amounts.
- Keep chain-specific constants (chain IDs, addresses, explorers) centralized per network.
- Treat indexer/3rd-party API data as eventually consistent; on critical flows, prefer direct chain confirmation.

## Web3 Safety Rules

- Always validate expected `chainId` before signing or sending transactions.
- Avoid unlimited token approvals by default; use minimal required allowance where feasible.
- Include explicit slippage/deadline controls for swap/quote execution flows.
- Handle transaction replacement/cancellation and confirmation depth explicitly.
- Never log or persist private keys, seed phrases, raw signing payloads, or sensitive wallet/session data.
- For any new Web3 interaction, consider potential failure modes and edge cases (network errors, user rejections, chain reorgs) and handle them gracefully.
- For any new Web3 dependency, evaluate maintenance status, security history, and compatibility with our supported chains and environments.

## Safety

- Do not weaken security or validation logic without explicit reason.
- Avoid destructive operations in scripts and migrations.
- Keep backward compatibility for public interfaces unless intentionally changed.
- Avoid JS/TS bugs and common vulnerabilities (infinite loops, unhandled promises, unsafe eval, etc.).
- For any new logic, consider potential edge cases and failure modes, and handle them gracefully.
