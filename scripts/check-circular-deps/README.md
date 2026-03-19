# check-circular-deps

## What

Runs `madge --circular` for workspaces discovered dynamically from `pnpm list -r --depth=-1 --json`.

## Why

Detects circular imports early, which helps avoid runtime bugs and fragile module graphs.

## How to use

From repo root:

```bash
bash scripts/check-circular-deps/check-circular-deps.sh
```

## Inputs

- No arguments.
- Uses workspace paths from `pnpm` workspace resolution.
- Auto-detects TypeScript config (`tsconfig.app.json` or `tsconfig.json`) and source targets inside each workspace.

## Output

- Prints a section per workspace.
- Exits non-zero if circular dependencies are detected by Madge.
