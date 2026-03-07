# PR Instructions

Use this file when preparing, updating, or reviewing pull requests.

## Branch And Merge Rules

1. For protected branches `dev`, `test`, and `main`, merge through merge queue.
2. Use merge commits for protected branches.
3. Do not use `Rebase and merge` or `Squash and merge` on protected branches.
4. Assume sync PRs between protected branches may be automation-generated and still require review.

## PR Content Requirements

1. Keep PR scope focused and minimal.
2. Include a clear summary of what changed and why.
3. Include validation evidence:

- exact commands run
- pass/fail status
- known non-blocking warnings (if any)

4. For UI changes, include screenshots or recordings.
5. For risk-sensitive changes, include rollback notes.

## Required Local Validation

Run the relevant checks before opening or updating a PR:

```sh
pnpm lint
pnpm build
pnpm syncpack:check
```

## Changesets

1. If the change should appear in release notes, add a changeset (`pnpm changeset`).
2. If no changeset is added, explicitly state why in the PR description.

## Documentation And Meta Sync

When behavior, scripts, workflows, or policies change, update docs and meta files in the same PR:

1. User-facing docs (`README.md`, `CONTRIBUTING.md`, `RELEASING.md`, etc.)
2. AI guidance docs (`.ai/*`, `AGENTS.md`, `.github/copilot-instructions.md`)
3. Script docs (`README.md` in the script folder)

## Security Reporting

Never report vulnerabilities in PR comments or public issues. Follow `SECURITY.md`.
