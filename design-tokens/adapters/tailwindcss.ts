import type { FormatFnArguments } from "style-dictionary/types";

import path from "node:path";
import StyleDictionary from "style-dictionary";

import {
  type BuildTokensContext,
  getEntries,
  makeDictionary,
  themeCssFormatName,
  toThemeVar,
} from "./shared";

export const registerTailwindCssAdapter = (): void => {
  StyleDictionary.registerFormat({
    format: ({ dictionary }: FormatFnArguments): string => {
      const mappedEntries = getEntries(dictionary, tokenName =>
        toThemeVar(tokenName)
      ).map(([name, value]) => `  ${name}: ${value};`);

      return [
        "/* AUTO-GENERATED — do not edit by hand */",
        "",
        "@theme {",
        ...mappedEntries,
        "}",
        "",
      ].join("\n");
    },
    name: themeCssFormatName,
  });
};

export const buildTailwindCssAdapter = async (
  context: BuildTokensContext
): Promise<void> => {
  const lightSource = [context.corePath, context.semanticPath, context.lightThemePath];

  await makeDictionary(
    context,
    lightSource,
    context.themeCssPath,
    themeCssFormatName
  ).buildAllPlatforms();

  console.info(
    `[design-tokens] updated ${path.relative(context.workspaceRoot, context.themeCssPath)}`
  );
};
