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

## Notes

- Additional conventional commit validations come from `@commitlint/config-conventional`.
- Keep commit messages imperative and specific to the actual change.
