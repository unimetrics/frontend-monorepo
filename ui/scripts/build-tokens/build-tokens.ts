import type { FormatFnArguments, TransformedToken } from "style-dictionary/types";

import { register } from "@tokens-studio/sd-transforms";
import { kebabCase } from "change-case";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import StyleDictionary from "style-dictionary";

type ThemeConfig = {
  name: string;
  selectedTokenSets: ThemeSetArraySelection | ThemeSetObjectSelection;
};

type ThemeSetArraySelection = Array<{ id: string; status: ThemeSetStatus }>;

type ThemeSetObjectSelection = Record<string, ThemeSetStatus>;

type ThemeSetStatus = "disabled" | "enabled" | "source";

type ThemeSnapshot = Record<string, string>;

const scriptPath = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptPath);
const uiRoot = path.resolve(scriptDir, "../..");
const tokensRoot = path.join(uiRoot, "tokens");
const setsDir = path.join(tokensRoot, "sets");
const themesPath = path.join(tokensRoot, "$themes.json");
const generatedDir = path.join(tokensRoot, "generated");
const themeCssPath = path.join(uiRoot, "theme.css");
const tokensCssPath = path.join(uiRoot, "tokens.css");

register(StyleDictionary);

StyleDictionary.registerFormat({
  format: ({ dictionary }: FormatFnArguments): string => {
    const entries = [...dictionary.allTokens]
      .map(
        token =>
          [token.path.join("."), normalizeSnapshotValue(getTokenValue(token))] as const
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([tokenPath, value]) => `  "${tokenPath}": ${JSON.stringify(value)}`);

    return entries.length === 0 ? "{}\n" : `{\n${entries.join(",\n")}\n}\n`;
  },
  name: "unimetrics/json-dot",
});

const themeMappings: Array<[string, string]> = [
  ["--font-sans", "var(--ui-font-family-sans)"],
  ["--font-serif", "var(--ui-font-family-serif)"],
  ["--font-heading", "var(--ui-font-family-heading)"],
  ["--color-primary", "var(--ui-color-primary)"],
  ["--color-secondary", "var(--ui-color-secondary)"],
  ["--color-accent", "var(--ui-color-accent)"],
  ["--color-heading", "var(--ui-color-text-heading)"],
  ["--color-default", "var(--ui-color-text-default)"],
  ["--color-muted", "var(--ui-color-text-muted)"],
  ["--radius-sm", "var(--ui-radius-sm)"],
  ["--radius-md", "var(--ui-radius-md)"],
  ["--radius-lg", "var(--ui-radius-lg)"],
  ["--radius-xl", "var(--ui-radius-xl)"],
  ["--radius-full", "var(--ui-radius-pill)"],
  ["--spacing-18", "var(--ui-spacing-18)"],
  ["--shadow-focus", "var(--ui-shadow-focus)"],
];

async function build(): Promise<void> {
  const themes = await readJson<ThemeConfig[]>(themesPath);

  if (!Array.isArray(themes) || themes.length === 0) {
    throw new Error("$themes.json must be a non-empty array of themes.");
  }

  await fs.mkdir(generatedDir, { recursive: true });
  await cleanGeneratedSnapshots();

  for (const theme of themes) {
    if (!theme.name || !theme.selectedTokenSets) {
      throw new Error("Every theme must provide 'name' and 'selectedTokenSets'.");
    }

    await buildThemeSnapshot(theme);
  }

  const lightTheme = await readThemeSnapshot("light");
  const darkTheme = await readThemeSnapshot("dark");
  await writeTokensCss(lightTheme, darkTheme);
  await writeThemeCss();
}

async function buildThemeSnapshot(theme: ThemeConfig): Promise<void> {
  const selectedSetNames = getSelectedSetNames(theme);
  if (selectedSetNames.length === 0) {
    throw new Error(`Theme '${theme.name}' does not enable any token sets.`);
  }

  const sourceFiles = selectedSetNames.map(setName =>
    path.join(setsDir, `${setName}.json`)
  );
  const dictionary = new StyleDictionary({
    platforms: {
      json: {
        buildPath: `${generatedDir}/`,
        files: [
          {
            destination: `${theme.name}.json`,
            format: "unimetrics/json-dot",
          },
        ],
        transforms: ["name/kebab"],
      },
    },
    preprocessors: ["tokens-studio"],
    source: sourceFiles,
  });

  await dictionary.buildAllPlatforms();
}

async function cleanGeneratedSnapshots(): Promise<void> {
  const files = await fs.readdir(generatedDir);
  const snapshotFiles = files.filter(fileName => fileName.endsWith(".json"));

  await Promise.all(
    snapshotFiles.map(fileName =>
      fs.rm(path.join(generatedDir, fileName), { force: true })
    )
  );
}

function formatCssBlock(selector: string, entries: Array<[string, string]>): string {
  const lines = [
    `${selector} {`,
    ...entries.map(([name, value]) => `  ${name}: ${value};`),
    "}",
  ];

  return lines.join("\n");
}

function getSelectedSetNames(theme: ThemeConfig): string[] {
  const selected = theme.selectedTokenSets;

  if (Array.isArray(selected)) {
    return selected
      .filter(entry => entry.status === "enabled" || entry.status === "source")
      .map(entry => entry.id);
  }

  return Object.entries(selected)
    .filter(([, status]) => status === "enabled" || status === "source")
    .map(([setName]) => setName);
}

function getTokenValue(token: TransformedToken): unknown {
  return token.$value ?? token.value;
}

function normalizeSnapshotValue(value: unknown): string {
  if (value === undefined || value === null) {
    throw new Error("Style Dictionary produced an empty token value.");
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

async function readJson<T>(filePath: string): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw) as T;
}

async function readThemeSnapshot(themeName: string): Promise<Map<string, string>> {
  const snapshotPath = path.join(generatedDir, `${themeName}.json`);
  const snapshot = await readJson<ThemeSnapshot>(snapshotPath);
  return new Map(Object.entries(snapshot));
}

function sortEntries<TIn, TOut extends [string, string]>(
  map: Map<string, TIn>,
  mapper: (key: string, value: TIn) => TOut
): TOut[] {
  return [...map.entries()]
    .map(([key, value]) => mapper(key, value))
    .sort(([a], [b]) => a.localeCompare(b));
}

function toCssVarName(tokenPath: string): string {
  return `--ui-${tokenPath
    .split(".")
    .map(pathSegment => kebabCase(pathSegment))
    .join("-")}`;
}

async function writeThemeCss(): Promise<void> {
  const css = [
    "/*",
    " * Auto-generated from ui/scripts/build-tokens/build-tokens.ts.",
    " * Do not edit this file by hand.",
    " */",
    "",
    formatCssBlock("@theme", themeMappings),
    "",
  ].join("\n");

  await fs.writeFile(themeCssPath, css, "utf8");
}

async function writeTokensCss(
  lightTheme: Map<string, string>,
  darkTheme: Map<string, string>
): Promise<void> {
  const rootEntries = sortEntries(lightTheme, (tokenPath, value) => [
    toCssVarName(tokenPath),
    value,
  ]);

  const darkDiff = new Map<string, string>();
  for (const [tokenPath, darkValue] of darkTheme.entries()) {
    const lightValue = lightTheme.get(tokenPath);
    if (lightValue !== darkValue) {
      darkDiff.set(tokenPath, darkValue);
    }
  }

  const darkEntries = sortEntries(darkDiff, (tokenPath, value) => [
    toCssVarName(tokenPath),
    value,
  ]);

  const css = [
    "/*",
    " * Auto-generated from ui/tokens/sets/*.json via Style Dictionary + sd-transforms.",
    " * Do not edit this file by hand.",
    " */",
    "",
    formatCssBlock(":root", rootEntries),
    "",
    formatCssBlock(".dark", darkEntries),
    "",
    "::selection {",
    "  background-color: var(--ui-color-selection-background);",
    "  color: var(--ui-color-selection-text);",
    "}",
    "",
  ].join("\n");

  await fs.writeFile(tokensCssPath, css, "utf8");
}

try {
  await build();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[tokens] ${message}`);
  process.exitCode = 1;
}
