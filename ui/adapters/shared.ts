import type { FormatFnArguments } from "style-dictionary/types";

import compact from "lodash/compact";
import find from "lodash/find";
import path from "node:path";
import StyleDictionary from "style-dictionary";

export type BuildTokensContext = {
  corePath: string;
  darkThemePath: string;
  generatedRoot: string;
  lightThemePath: string;
  semanticPath: string;
  themeCssPath: string;
  tokensCssPath: string;
  uiRoot: string;
};

export type ThemeFormatOptions = {
  selector?: string;
};

export const runtimeVarsFormatName = "unimetrics/runtime-vars";
export const themeCssFormatName = "unimetrics/theme-css";

const shouldEmit = (name: string): boolean =>
  /^(?:border-width|color|font|motion|primitive|radius|shadow|spacing)\b/.test(name);

export const toThemeVar = (tokenName: string): null | string => {
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

  if (typeof value === "boolean" || typeof value === "number") {
    return String(value);
  }

  return JSON.stringify(value);
};

export const getEntries = (
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

export const makeDictionary = (
  context: BuildTokensContext,
  source: string[],
  destination: string,
  format: string,
  options?: ThemeFormatOptions
): StyleDictionary =>
  new StyleDictionary({
    log: {
      verbosity: "silent",
    },
    platforms: {
      css: {
        buildPath: `${context.uiRoot}/`,
        files: [
          {
            destination: path.relative(context.uiRoot, destination),
            format,
            options,
          },
        ],
        transforms: ["name/kebab"],
      },
    },
    preprocessors: ["tokens-studio"],
    source,
  });
