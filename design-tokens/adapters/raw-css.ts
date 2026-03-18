import type { FormatFnArguments } from "style-dictionary/types";

import compact from "lodash/compact";
import { promises as fs } from "node:fs";
import path from "node:path";
import StyleDictionary from "style-dictionary";

import {
  type BuildTokensContext,
  getEntries,
  makeDictionary,
  runtimeVarsFormatName,
  type ThemeFormatOptions,
  toThemeVar,
} from "./shared";

const tempLightFileName = ".light.css";
const tempDarkFileName = ".dark.css";

export const registerRawCssAdapter = (): void => {
  StyleDictionary.registerFormat({
    format: ({ dictionary, options }: FormatFnArguments): string => {
      const selector = (options as ThemeFormatOptions | undefined)?.selector ?? ":root";

      const lines = getEntries(dictionary, tokenName => toThemeVar(tokenName)).map(
        ([name, value]) => `  ${name}: ${value};`
      );

      return [
        "/* AUTO-GENERATED — do not edit by hand */",
        "",
        `${selector} {`,
        ...lines,
        "}",
        "",
      ].join("\n");
    },
    name: runtimeVarsFormatName,
  });
};

const stripBanner = (css: string): string[] =>
  compact(
    css
      .split("\n")
      .map(line =>
        line.startsWith("/*") || line.trim() === "*/" || line.trim() === "" ? null : line
      )
  );

export const buildRawCssAdapter = async (context: BuildTokensContext): Promise<void> => {
  const lightSource = [context.corePath, context.semanticPath, context.lightThemePath];
  const darkSource = [context.corePath, context.darkThemePath];

  const tempLightPath = path.join(context.generatedRoot, tempLightFileName);
  const tempDarkPath = path.join(context.generatedRoot, tempDarkFileName);

  await fs.mkdir(context.generatedRoot, { recursive: true });

  try {
    await makeDictionary(context, lightSource, tempLightPath, runtimeVarsFormatName, {
      selector: ":root",
    }).buildAllPlatforms();

    await makeDictionary(context, darkSource, tempDarkPath, runtimeVarsFormatName, {
      selector: ".dark",
    }).buildAllPlatforms();

    const lightCss = await fs.readFile(tempLightPath, "utf8");
    const darkCss = await fs.readFile(tempDarkPath, "utf8");

    const tokensCss = [
      "/* AUTO-GENERATED — do not edit by hand */",
      "",
      ...stripBanner(lightCss),
      "",
      ...stripBanner(darkCss),
      "",
      "::selection {",
      "  background-color: var(--color-selection-background);",
      "  color: var(--color-selection-text);",
      "}",
      "",
    ].join("\n");

    await fs.writeFile(context.tokensCssPath, tokensCss, "utf8");
    console.info(
      `[design-tokens] updated ${path.relative(context.workspaceRoot, context.tokensCssPath)}`
    );
  } finally {
    await fs.rm(context.generatedRoot, { force: true, recursive: true });
  }
};
