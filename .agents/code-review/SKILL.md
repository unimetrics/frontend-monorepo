---
name: code-review
description: Perform a production-focused code review for pull requests or local changes. Use when the user asks for a review, PR review, merge-risk check, or asks whether a change is safe to ship. Focus on bugs, regressions, security risks, data integrity, and missing tests.
---

# Code Review

Use the shared policy in `.ai/code-review-policy.md` as the source of truth.

## Execution

1. Read `.ai/code-review-policy.md`.
2. If the review is for a pull request, also read `.ai/pr-instructions.md`.
3. Analyze changed files and surrounding context according to that policy.
4. Return results using the exact output format from the policy.

## Notes

- Do not downgrade severity for convenience.
- Prefer concrete findings over generic commentary.
