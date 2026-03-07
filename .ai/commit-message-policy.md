# Commit Message Policy

This repository validates commit messages with Commitlint using:

- `@commitlint/config-conventional`
- local overrides from `commitlint.config.cjs`

## Required Format

Use Conventional Commits format:

```text
<type>(<optional-scope>): <subject>
```

Examples:

- `feat(app): add sentry initialization for web app`
- `fix(cli): handle missing config path`
- `docs: update releasing flow for test->main`
- `fix(app): enforce expected chainId before tx signing`
- `feat(app): add allowance reset flow for ERC20 approvals`
- `refactor(api): normalize bigint amount serialization in rpc responses`

## Notes

- Additional conventional commit validations come from `@commitlint/config-conventional`.
- Keep commit messages imperative and specific to the actual change.
- For Web3-impacting changes, mention the affected chain/protocol context in the subject when relevant.
- For PR-level requirements beyond commit message format, follow `.ai/pr-instructions.md`.
