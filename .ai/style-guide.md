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
- For Web3 values, use `bigint` and decimal-safe helpers. Never use JS floating-point math for on-chain amounts.
- Keep chain-specific constants (chain IDs, addresses, explorers) centralized per network.
- Treat indexer/3rd-party API data as eventually consistent; on critical flows, prefer direct chain confirmation.

## Web3 Safety Rules

- Always validate expected `chainId` before signing or sending transactions.
- Avoid unlimited token approvals by default; use minimal required allowance where feasible.
- Include explicit slippage/deadline controls for swap/quote execution flows.
- Handle transaction replacement/cancellation and confirmation depth explicitly.
- Never log or persist private keys, seed phrases, raw signing payloads, or sensitive wallet/session data.

## Safety

- Do not weaken security or validation logic without explicit reason.
- Avoid destructive operations in scripts and migrations.
- Keep backward compatibility for public interfaces unless intentionally changed.
