---
name: release-manager
description: Manage repository releases and branch promotions for this monorepo. Use when the user asks for release preparation, promotion from dev to test to main (prod), hotfix flow, back-merge flow, or changeset/versioning checks before shipping.
---

# Release Manager

Use `RELEASING.md` as source of truth for flow and branch policy.

## Workflow

1. Validate release readiness:
- verify branch context (`dev`, `test`, `main`)
- check pending release state with `pnpm changeset:status`
- check lint/build/test status when requested
2. Plan promotion steps:
- normal release: `dev` -> `test` -> `main` (`prod`)
- emergency hotfix: patch from `main`, then back-merge to `test` and `dev`
3. Validate branch sync:
- detect missing back-merges from `main` to `test`/`dev`
- recommend merge PR order preserving history
4. Confirm release commands:
- `pnpm changeset:version` when release bump is needed
- include any required tagging/publish steps defined by user process
5. Flag blockers early:
- missing changesets
- failed checks
- inconsistent branch history

## Output

Return:

1. Release State
- current branch and readiness summary
2. Required Actions
- ordered, executable steps
3. Risks/Blockers
- concrete blockers with minimal fix direction
