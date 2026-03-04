import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const bannerCandidates = [
  path.join(currentDir, "banner.txt"),
  path.join(currentDir, "../../src/banner.txt"),
];
const bannerPath = bannerCandidates.find(candidate => existsSync(candidate));

if (!bannerPath) {
  throw new Error("Unable to locate banner.txt");
}

export const BANNER = readFileSync(bannerPath, "utf8").trimEnd();
