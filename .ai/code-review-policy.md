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
- Web3 critical paths (if relevant to the change):
  - chain/network selection and `chainId` validation
  - contract address/ABI changes and network-specific config
  - transaction lifecycle (pending/replaced/dropped/reverted/reorg) and idempotency in ui
  - token approvals/allowances and spend limits

3. Validate key behavior paths:

- success path
- invalid/empty input path
- failure/retry/timeout path
- Web3-specific failure paths:
  - wallet disconnected or locked
  - wrong network selected
  - user rejects signature/transaction
  - RPC/indexer returns stale or inconsistent state
  - tx confirmed then reorged or replaced

4. Verify tests:

- changed logic must have relevant tests
- include negative-path and edge-case coverage when applicable
- for Web3 logic, verify amount conversions, chain gating, and transaction-state transitions

5. Enforce repository policies:

- verify code changes are consistent with `.ai/style-guide.md`
- verify PR expectations are consistent with `.ai/pr-instructions.md` when PR metadata/description/checklist is present
- verify commit messages in scope are consistent with `.ai/commit-message-policy.md`
- for script changes, verify compliance with `scripts/SCRIPT_STANDARDS.md` and ensure required callsites are updated

6. Validate meta/documentation changes:

- for changed markdown/meta files (`README*`, `CONTRIBUTING*`, `RELEASING*`, `SECURITY*`, `*.md`), check that content is relevant to the change
- confirm docs do not describe outdated repo structure, workspace names, scripts, branch flow, or file paths
- confirm docs do not contain outdated chain IDs, contract addresses, network names, or wallet flow assumptions
- flag stale, copied, or incorrect repository guidance as findings

7. Ensure no secrets or sensitive data are exposed in code, tests, or documentation.

8. Ensure proper test (unit, e2e, integration, fuzz) coverage for any new or changed logic, especially for critical paths and edge cases. If new files or directories are added, verify they are visible by eslint, prettier, test runners and other relevant tools.

## Severity

- `P0` Critical: security issue, fund-loss risk, data loss/corruption, outage risk, or broken core flow.
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
