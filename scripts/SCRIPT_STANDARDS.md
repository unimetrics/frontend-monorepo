# Script Development Standards

These rules are mandatory for scripts in this repository.

## Language And Runtime

1. Use **Bash** (`.sh`) or **TypeScript** (`.ts`) only.
2. Do not add new runtime JavaScript script files (`.js`, `.mjs`, `.cjs`) for automation tasks.
3. Run TypeScript scripts with `tsx` (for example: `pnpm dlx tsx path/to/script.ts` or `pnpm exec tsx ...`).

## Location And Paths

1. Put scripts in `scripts` folder.
2. Project-specific scripts should go in the relevant package (for example, `ui/scripts` for UI-related scripts).
3. Resolve repository root first, then use root-relative paths.
4. Avoid fragile path hopping patterns like `cd "$(dirname "$0")/../../.."`.
5. If a script path changes, update all callsites (`package.json`, workflows/actions, and workflow path filters) in the same change.
6. There is a special directory for helpers (`scripts/lib`) but avoid adding new scripts here unless they are truly generic and reusable across multiple other scripts.

## Documentation

1. Every script directory must have a `README.md`.
2. Script READMEs must include the following sections with clear, concise information:

- Why
- What
- How to use
- Inputs
- Output

## Safety

1. Use strict modes:

- Bash: `set -euo pipefail`
- TypeScript: explicit types for external data and file IO boundaries

2. Prefer idempotent behavior when possible.
3. Print clear actionable errors.
