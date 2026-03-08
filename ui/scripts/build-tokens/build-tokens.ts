import type { FormatFnArguments } from "style-dictionary/types";

import { register } from "@tokens-studio/sd-transforms";
import compact from "lodash/compact";
import find from "lodash/find";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";

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

const tempLightPath = path.join(generatedRoot, ".light.css");
const tempDarkPath = path.join(generatedRoot, ".dark.css");

type ThemeFormatOptions = {
  selector?: string;
};

register(StyleDictionary);

const shouldEmit = (name: string): boolean =>
  /^(?:border-width|color|font|motion|primitive|radius|shadow|spacing)\b/.test(name);

const toThemeVar = (tokenName: string): null | string => {
  const mappings: Array<[string, string]> = [
    ["primitive-color-", "--color-primitive-"],
    ["color-", "--color-"],
    ["spacing-", "--spacing-"],
    ["radius-", "--radius-"],
    ["shadow-", "--shadow-"],
    ["border-width-", "--border-width-"],
    ["font-family-", "--font-"],
    ["font-size-", "--text-"],
    ["font-line-height-", "--leading-"],
    ["font-weight-", "--font-weight-"],
    ["motion-duration-", "--duration-"],
  ];

  const match = find(mappings, ([prefix]) => tokenName.startsWith(prefix));
  if (!match) {
    return null;
  }

  const [prefix, varPrefix] = match;
  return `${varPrefix}${tokenName.slice(prefix.length)}`;
};

const normalizeValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    throw new Error("Token value cannot be empty.");
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
};

const getEntries = (
  dictionary: FormatFnArguments["dictionary"],
  mapName: (tokenName: string) => null | string
): Array<[string, string]> =>
  compact(
    dictionary.allTokens
      .filter(token => shouldEmit(token.name))
      .map(token => {
        const varName = mapName(token.name);
        if (!varName) {
          return null;
        }

        const rawValue = token.$value ?? token.value;
        return [varName, normalizeValue(rawValue)] as [string, string];
      })
  ).sort(([a], [b]) => a.localeCompare(b));

StyleDictionary.registerFormat({
  format: ({ dictionary }: FormatFnArguments): string => {
    const mappedEntries = getEntries(dictionary, tokenName => toThemeVar(tokenName)).map(
      ([name, value]) => `  ${name}: ${value};`
    );

    return [
      "/* AUTO-GENERATED — do not edit by hand */",
      "",
      "@theme {",
      ...mappedEntries,
      "}",
      "",
    ].join("\n");
  },
  name: "unimetrics/theme-css",
});

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
  name: "unimetrics/runtime-vars",
});

const makeDictionary = (
  source: string[],
  destination: string,
  format: string,
  options?: ThemeFormatOptions
): StyleDictionary =>
  new StyleDictionary({
    platforms: {
      css: {
        buildPath: `${uiRoot}/`,
        files: [{ destination, format, options }],
        transforms: ["name/kebab"],
      },
    },
    preprocessors: ["tokens-studio"],
    source,
  });

const buildCssArtifacts = async (): Promise<void> => {
  await fs.mkdir(generatedRoot, { recursive: true });

  const lightSource = [corePath, semanticPath, lightThemePath];
  const darkSource = [corePath, darkThemePath];

  await makeDictionary(
    lightSource,
    path.relative(uiRoot, tempLightPath),
    "unimetrics/runtime-vars",
    {
      selector: ":root",
    }
  ).buildAllPlatforms();

  const lightCss = await fs.readFile(tempLightPath, "utf8");

  await makeDictionary(
    darkSource,
    path.relative(uiRoot, tempDarkPath),
    "unimetrics/runtime-vars",
    {
      selector: ".dark",
    }
  ).buildAllPlatforms();

  const darkCss = await fs.readFile(tempDarkPath, "utf8");

  await makeDictionary(
    lightSource,
    path.relative(uiRoot, themeCssPath),
    "unimetrics/theme-css"
  ).buildAllPlatforms();

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

  await fs.writeFile(tokensCssPath, tokensCss, "utf8");
  await fs.rm(generatedRoot, { force: true, recursive: true });
};

const stripBanner = (css: string): string[] =>
  compact(
    css
      .split("\n")
      .map(line =>
        line.startsWith("/*") || line.trim() === "*/" || line.trim() === "" ? null : line
      )
  );

try {
  await buildCssArtifacts();
  console.info("Generated theme.css and tokens.css");
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[tokens] ${message}`);
  process.exitCode = 1;
}
