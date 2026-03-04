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

## Typical Flow

1. Create PR with code changes and a changeset.
2. Merge PR into `main`.
3. Run versioning step (manually or via CI release workflow).
4. Tag/release artifacts as needed.

## Notes

- If a change does not require a version bump, you can add an empty changeset.
- For internal-only packages, keep release notes for traceability.
