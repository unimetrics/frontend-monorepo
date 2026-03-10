---
name: ci-troubleshooter
description: Diagnose and fix failing CI pipelines in this repository. Use when a GitHub Actions workflow fails, checks are red, or the user asks why CI failed and how to fix it quickly and safely.
---

# CI Troubleshooter

Prioritize root cause and smallest safe fix.

## Workflow

1. Identify failing workflow/job/step from provided logs or local workflow files.
2. Classify failure type:
- dependency/install/toolchain
- lint/format/typecheck/test
- permissions/secrets/tokens
- workflow syntax/runner/environment
3. Reproduce locally when possible using repository scripts.
4. Isolate root cause:
- separate true failure from secondary noise
- map error to exact file/config/script
5. Implement minimal fix:
- prefer targeted patch over broad refactor
- preserve existing security and policy constraints
6. Re-validate:
- run relevant local checks
- list expected CI checks to pass after patch
7. If the fix updates PR-facing automation or merge behavior, verify `.ai/pr-instructions.md` stays consistent.

## Output

Return:

1. Root Cause
- concise explanation with file/step reference
2. Fix Applied
- what changed and why
3. Verification
- checks run and remaining risks
