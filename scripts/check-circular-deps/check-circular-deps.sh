#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../.."

run_madge() {
  local workspace="$1"
  shift

  echo "==> Checking circular dependencies in ${workspace}"
  pnpm exec madge \
    --circular \
    --exclude "(^|/)dist/|\\.d\\.ts$" \
    "$@"
}

run_madge "api" \
  --extensions ts \
  --ts-config api/tsconfig.json \
  api/src

run_madge "app" \
  --extensions ts,tsx \
  --ts-config app/tsconfig.app.json \
  app/src

run_madge "cli" \
  --extensions ts \
  --ts-config cli/tsconfig.json \
  cli/src \
  cli/bin

run_madge "landing" \
  --extensions ts,tsx,js,mjs,cjs \
  --ts-config landing/tsconfig.json \
  landing/src \
  landing/vendor

run_madge "mobile" \
  --extensions ts,tsx \
  --ts-config mobile/tsconfig.json \
  mobile/src \
  mobile/index.ts

run_madge "ui" \
  --extensions js,mjs,cjs \
  ui/tailwind-preset.js
