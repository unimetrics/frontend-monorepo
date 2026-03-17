# check-circular-deps

## What

Runs `madge --circular` for applicable workspaces (`api`, `app`, `charts`, `cli`, `landing`, `mobile`, `docs`, `ui`).

## Why

Detects circular imports early, which helps avoid runtime bugs and fragile module graphs.

## How to use

From repo root:

```bash
bash scripts/check-circular-deps/check-circular-deps.sh
```

## Inputs

- No arguments.
- Uses workspace source paths and each workspace TypeScript config.

## Output

- Prints a section per workspace.
- Exits non-zero if circular dependencies are detected by Madge.
