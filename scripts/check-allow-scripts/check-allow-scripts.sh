#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/../.."

package_json_path="package.json"
original_package_json="$(mktemp)"
trap 'rm -f "$original_package_json"' EXIT

cp "$package_json_path" "$original_package_json"

echo "Running allow-scripts auto to check configuration..."

set +e
allow_scripts_output="$(pnpm exec allow-scripts auto 2>&1)"
allow_scripts_status=$?
set -e

if [[ -n "$allow_scripts_output" ]]; then
  printf '%s\n' "$allow_scripts_output"
fi

if [[ "$allow_scripts_status" -ne 0 ]]; then
  echo "allow-scripts exited with code $allow_scripts_status" >&2
  exit "$allow_scripts_status"
fi

if ! cmp -s "$package_json_path" "$original_package_json"; then
  cp "$original_package_json" "$package_json_path"

  echo "allow-scripts configuration is outdated!" >&2
  echo "Run 'pnpm exec allow-scripts auto' to update the configuration," >&2
  echo "then commit the changes to package.json." >&2

  if [[ -n "$allow_scripts_output" ]]; then
    echo >&2
    echo "Output from allow-scripts:" >&2
    printf '%s\n' "$allow_scripts_output" >&2
  fi

  exit 1
fi

echo "allow-scripts configuration is up-to-date"
