# Contributing

Thanks for contributing to the Unimetrics frontend monorepo.

## Setup

```sh
nvm use
pnpm install
```

## Branch and Commits

- Create feature branches from `main`
- Use Conventional Commits (commitlint enforced)
- Keep PRs focused and small when possible

## Before Opening a PR

Run:

```sh
pnpm lint
pnpm test
pnpm build
pnpm syncpack:check
```

If your changes should be tracked in release notes:

```sh
pnpm changeset
```

## Pull Requests

- Use the PR template
- Add context, screenshots, or recordings for UI changes
- Call out risks and migration steps if needed
