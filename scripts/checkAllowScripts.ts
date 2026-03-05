/**
 * @file
 *
 * This script checks that the lavamoat allow-scripts configuration
 * in package.json is up-to-date with all installed dependencies.
 * It runs `pnpm exec allow-scripts auto` and verifies no changes are needed.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export function main() {
  const rootDir = path.resolve(process.cwd());
  const packageJsonPath = path.join(rootDir, "package.json");
  const originalContent = fs.readFileSync(packageJsonPath, "utf8");

  console.info("Running allow-scripts auto to check configuration...");

  const result = spawnSync("pnpm", ["exec", "allow-scripts", "auto"], {
    cwd: rootDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    throw new Error(`Failed to run allow-scripts: ${result.error.message}`);
  }

  if (result.stdout) {
    console.info(result.stdout);
  }
  if (result.stderr) {
    console.error(result.stderr);
  }

  if (result.status !== 0) {
    throw new Error(`allow-scripts exited with code ${result.status}`);
  }

  const updatedContent = fs.readFileSync(packageJsonPath, "utf8");

  if (originalContent !== updatedContent) {
    fs.writeFileSync(packageJsonPath, originalContent, "utf8");

    const outputSection = result.stdout
      ? "\nOutput from allow-scripts:\n" + result.stdout
      : "";

    throw new Error(
      "allow-scripts configuration is outdated!\n" +
        "Run 'pnpm exec allow-scripts auto' to update the configuration,\n" +
        "then commit the changes to package.json." +
        outputSection
    );
  }

  console.info("allow-scripts configuration is up-to-date");
}

main();
