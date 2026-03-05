---
name: docs-structure-guard
description: Review and correct repository documentation for structural accuracy. Use when markdown/meta docs change and you need to verify they match the actual repository structure, workspace names, scripts, branches, and file paths.
---

# Docs Structure Guard

Treat documentation drift as a correctness issue.

## Workflow

1. Inspect changed doc/meta files (`*.md`, release docs, contribution docs, README files).
2. Validate structural claims against repository reality:
- workspace/package names
- branch names and release flow
- script names and commands
- file paths and directory layout
3. Flag stale or copied content from other repositories.
4. Patch docs to reflect current repository truth with minimal edits.
5. Re-check consistency with:
- `.ai/style-guide.md`
- `.ai/code-review-policy.md` (for review expectations)
- `commit-message-policy.md` (when commit policy is described)

## Output

Return:

1. Documentation Findings
- incorrect statements with file/path references
2. Corrections
- exact updates made
3. Residual Ambiguities
- items requiring maintainer confirmation
