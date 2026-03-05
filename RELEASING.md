# Releasing

This repository uses Changesets for versioning and changelog management.

## Create a Changeset

When a change should appear in release history:

```sh
pnpm changeset
```

## Check Release State

```sh
pnpm changeset:status
```

## Apply Version Bumps

```sh
pnpm changeset:version
```

## Branches and Promotion Flow

This repository uses three long-lived branches:

- `dev`: active development branch.
- `test`: release-candidate branch for QA and final checks.
- `main` (`prod`): production branch with code used by end users.

Promotion path:

1. Feature work is merged into `dev` (with a changeset when needed).
2. When you want to prepare a release, promote `dev` to `test`.
3. QA validates in `test` while development continues in `dev` (release freeze happens in `test`, not in `dev`).
4. If fixes are required, apply them to `test`, re-validate, and back-merge relevant fixes to `dev`.
5. After validation, promote `test` to `main` (`prod`).
6. Run `pnpm changeset:version` and complete tagging/release steps as needed.

## Hotfixes for `main` (`prod`)

If a production issue is found, use one of these paths:

1. Normal hotfix path (preferred): `dev` -> `test` -> `main` (`prod`) with full QA.
2. Emergency hotfix path: patch from `main`, release to `main` quickly, then validate in `test` and back-merge to `dev`.

Recommended emergency sequence:

1. Create `hotfix/*` from `main`.
2. Open PR into `main`, merge, release.
3. Merge `main` -> `test` and validate there.
4. Merge `test` -> `dev` (or `main` -> `dev` if `test` is not ahead).

This keeps all long-lived branches aligned after emergency production fixes.

## Back-Merges from `main`

Sometimes changes land in `main` outside the normal promotion flow (for example: release/version commits, Dependabot updates, emergency fixes).
Those commits must be propagated back to `test` and `dev`.

Recommended policy:

1. Use regular merge PRs (`main` -> `test`, then `test` -> `dev`) to preserve commit history.
2. Prefer merge commits for branch synchronization PRs.
3. Use cherry-pick only for exceptional cases when you intentionally do not want the full merge.

## Branch Rulesets as Code

Branch protection policies are managed as code and stored in:

- `.github/rulesets/branch-dev.json`
- `.github/rulesets/branch-test.json`
- `.github/rulesets/branch-main.json`

They are applied automatically by `.github/workflows/sync-rulesets.yaml`, which runs:

```sh
bash scripts/github/apply-rulesets.sh
```

For automatic updates from CI, configure `RULESETS_ADMIN_TOKEN` in repository secrets with permission to manage repository rulesets.
The default `GITHUB_TOKEN` usually cannot update rulesets.
If `RULESETS_ADMIN_TOKEN` is not configured, the sync workflow will skip applying rulesets.

## Notes

- If a change does not require a version bump, you can add an empty changeset.
- For internal-only packages, keep release notes for traceability.
