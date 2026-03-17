import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const uiRoot = path.resolve(scriptDir, "../..");
const gitBinary = "/usr/bin/git";

const generatedArtifacts = ["theme.css", "tokens.css"];

const diff = spawnSync(gitBinary, ["diff", "--name-only", "--", ...generatedArtifacts], {
  cwd: uiRoot,
  encoding: "utf8",
});

if (diff.status !== 0) {
  const stderr = diff.stderr?.trim();
  throw new Error(stderr || "[ui/tokens] Failed to check generated artifacts.");
}

const changedFiles = diff.stdout
  .split("\n")
  .map(file => file.trim())
  .filter(Boolean);

if (changedFiles.length > 0) {
  throw new Error(
    [
      "[ui/tokens] Generated artifacts are out of date:",
      ...changedFiles.map(file => `- ${file}`),
      "[ui/tokens] Run `pnpm build` and commit updated files.",
    ].join("\n")
  );
}

console.info("[ui/tokens] Generated artifacts are up to date.");
