import { register } from "@tokens-studio/sd-transforms";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";

import { buildRawCssAdapter, registerRawCssAdapter } from "~/adapters/raw-css";
import { type BuildTokensContext } from "~/adapters/shared";
import {
  buildTailwindCssAdapter,
  registerTailwindCssAdapter,
} from "~/adapters/tailwindcss";

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const uiRoot = path.resolve(scriptDir, "../..");

const tokensRoot = path.join(uiRoot, "tokens");
const themesRoot = path.join(tokensRoot, "themes");
const generatedRoot = path.join(tokensRoot, "generated");

const corePath = path.join(tokensRoot, "core.json");
const semanticPath = path.join(tokensRoot, "semantic.json");
const lightThemePath = path.join(themesRoot, "light.json");
const darkThemePath = path.join(themesRoot, "dark.json");

const tokensCssPath = path.join(uiRoot, "tokens.css");
const themeCssPath = path.join(uiRoot, "theme.css");

register(StyleDictionary);
registerRawCssAdapter();
registerTailwindCssAdapter();

const buildCssArtifacts = async (): Promise<void> => {
  const context: BuildTokensContext = {
    corePath,
    darkThemePath,
    generatedRoot,
    lightThemePath,
    semanticPath,
    themeCssPath,
    tokensCssPath,
    uiRoot,
  };

  await buildRawCssAdapter(context);
  await buildTailwindCssAdapter(context);
};

try {
  await buildCssArtifacts();
  console.info("[ui/tokens] build complete");
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[ui/tokens] ${message}`);
  process.exitCode = 1;
}
