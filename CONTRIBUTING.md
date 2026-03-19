# Contributing

Thanks for contributing to the Unimetrics frontend monorepo.

Architecture guidelines: we use FSD; see [README: FSD Architecture](./README.md#fsd-architecture).

## Setup

```sh
nvm use
pnpm install
```

## Script Development

- Follow [scripts/SCRIPT_STANDARDS.md](./scripts/SCRIPT_STANDARDS.md).
- Use Bash (`.sh`) or TypeScript (`.ts`) only for automation scripts.
- Run TypeScript scripts with `tsx`.

## Local Skills (Experimental)

- `.agents/skills/` is ignored by default so developers can add local/project skills manually or via `npx skills add ...` without polluting `git status`.
- If a skill is required for the whole team and is project-specific, commit it with force from `.agents/skills/` (for example, `git add -f .agents/skills/<skill>/`).
- `skills-lock.json` is currently ignored because lock support is experimental; this policy may be revisited later.

## Branch and Commits

- Create feature branches from `dev`
- Use Conventional Commits (commitlint enforced)
- Keep PRs focused and small when possible

## Before Opening a PR

Run:

```sh
pnpm lint
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

## Merging PRs

For protected branches (`dev`, `test`, `main`), we use merge queue with merge commits.

### Why

- Keeps history clean and predictable
- Avoids rebase/squash signature issues
- Works with required signed commits and branch protections

### What to do in GitHub UI

1. Open the approved PR.
2. Click `Merge when ready` (or `Queue` depending on UI wording).
3. Confirm queueing the PR.
4. Wait for queue checks to pass and merge automatically.

### What not to do

- Do not use `Rebase and merge` on protected branches.
- Do not use `Squash and merge` on protected branches.
- Do not bypass queue manually unless it is an explicit incident response.

### Branch promotion PRs

Branch sync PRs (`main -> test`, `main -> dev`, `test -> dev`) are created automatically by automation.

- Review them like normal PRs.
- Merge via queue the same way as any other protected-branch PR.
