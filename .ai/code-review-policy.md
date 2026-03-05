# Universal Code Review Policy

Use this policy for production-oriented code reviews across AI coding assistants.

## Goal

Identify correctness, security, and regression risk before merge. Prioritize behavior and safety over style.

## Review Scope

1. Start from changed files and diff only, then expand context when required.
2. Prioritize high-risk areas first:

- auth, permissions, secrets, cryptography
- money/billing/quotas/limits
- writes/deletes/migrations/schema assumptions
- API contracts and backward compatibility
- async flows, retries, idempotency, timeout/error handling

3. Validate key behavior paths:

- success path
- invalid/empty input path
- failure/retry/timeout path

4. Verify tests:

- changed logic must have relevant tests
- include negative-path and edge-case coverage when applicable

5. Enforce repository policies:

- verify code changes are consistent with `.ai/style-guide.md`
- verify commit messages in scope are consistent with `commit-message-policy.md`

6. Validate meta/documentation changes:

- for changed markdown/meta files (`README*`, `CONTRIBUTING*`, `RELEASING*`, `SECURITY*`, `*.md`), check that content is relevant to the change
- confirm docs do not describe outdated repo structure, workspace names, scripts, branch flow, or file paths
- flag stale, copied, or incorrect repository guidance as findings

## Severity

- `P0` Critical: security issue, data loss/corruption, outage risk, or broken core flow.
- `P1` High: major regression, contract break, or unsafe behavior likely in production.
- `P2` Medium: correctness gap in non-critical path or important missing validation.
- `P3` Low: minor issue, maintainability concern, or non-blocking test gap.

## Required Output Format

1. Findings

- `[Px] Title` — `path:line`
- Why this is a production risk
- Minimal fix direction

2. Open Questions / Assumptions

- Only unresolved items that block confidence

3. Summary

- Merge recommendation: `safe to merge` or `not safe to merge`
- Residual risk and test coverage note

If no findings, explicitly write:
`No functional or security findings identified.`
