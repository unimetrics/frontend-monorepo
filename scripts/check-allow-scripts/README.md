# check-allow-scripts

## What

Runs `pnpm exec allow-scripts auto` in check mode and fails if `package.json` would be changed.

## Why

Keeps `lavamoat.allowScripts` deterministic in CI and prevents drift from approved lifecycle scripts.

## How to use

From repo root:

```bash
bash scripts/check-allow-scripts/check-allow-scripts.sh
```

## Inputs

- No arguments.
- Uses root `package.json`.

## Output

- Prints `allow-scripts` command output.
- Exits `0` when config is up to date.
- Exits `1` when config is outdated and prints remediation command.
