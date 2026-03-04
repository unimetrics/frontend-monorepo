---
name: code-review-example
description: Perform a fast code review focused on bugs, regressions, security issues, and missing tests. Use when a user asks for a "review", "code review", "PR review", or asks whether a change is safe to merge.
---

# Code Review Example

## Overview

Identify concrete issues first, then summarize risk. Prioritize correctness and behavior regressions over style.

## Review Workflow

1. Read only changed files first (`git diff --name-only`, then file-level diffs).
2. Check high-risk areas:
- auth, permissions, billing, data writes/deletes
- state changes, async flows, error handling
- migrations, API contracts, schema assumptions
3. Validate expected behavior paths:
- success path
- empty/invalid input path
- failure/retry path
4. Flag missing tests for changed logic and edge cases.
5. Return findings ordered by severity.

## Severity Guide

- `P0` Critical: security/data-loss/outage risk or clearly broken core flow.
- `P1` High: major behavior regression or contract break likely in production.
- `P2` Medium: correctness issue in non-critical path or notable missing validation.
- `P3` Low: minor issue, maintainability concern, or test gap with limited impact.

## Output Format

Use this exact structure:

1. Findings
- `[Px] Title` — file + line
- Why it is a problem
- Minimal fix direction

2. Open Questions / Assumptions
- Only items that block confidence in correctness

3. Summary
- Short merge risk statement
- Short test coverage statement

If there are no findings, explicitly say: `No functional or security findings identified.`
