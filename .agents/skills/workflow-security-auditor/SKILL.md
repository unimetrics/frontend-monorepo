---
name: workflow-security-auditor
description: Audit GitHub Actions workflows and composite actions for security risks. Use when reviewing CI/CD hardening, secrets and token handling, pull_request safety, helper bot permissions, and action version pinning.
---

# Workflow Security Auditor

Prioritize secret exposure and privilege escalation risks first.

## Workflow

1. Inventory CI surface:
- `.github/workflows/*.y*ml`
- `.github/actions/**/action.y*ml`
- called scripts under `scripts/github/**`
2. Review trigger trust boundaries:
- `pull_request` vs `pull_request_target` vs `push` vs `workflow_dispatch` vs `schedule`
- confirm untrusted PR code is never executed with write tokens or secrets
3. Review permissions and tokens:
- check workflow/job `permissions` for least privilege
- identify every token source (`secrets.*`, `GITHUB_TOKEN`, app tokens, cloud tokens)
- verify token scope is minimal and tied to needed repo/resources only
4. Review secret handling:
- ensure secrets are not echoed, persisted, or passed to untrusted scripts/actions
- confirm PR-triggered jobs do not access high-privilege secrets
5. Review third-party action supply chain:
- flag any `uses: owner/repo@tag` that is not pinned to a full commit SHA
- include composite-action dependencies too
6. Review helper bot usage:
- verify where helper bot/app token is minted
- check events that can reach minting paths
- verify downstream steps using that token do not run untrusted input
7. Provide prioritized findings with exact file and line references.

## Output

Return:

1. Findings
- `[Px] Title` — `path:line`
- Risk explanation
- Minimal fix direction
2. Open Questions / Assumptions
- only items blocking confidence
3. Summary
- overall risk posture and immediate hardening priorities
