import js from "@eslint/js";
import typescriptParser from "@typescript-eslint/parser";
import astroEslintParser from "astro-eslint-parser";
import eslintPluginAstro from "eslint-plugin-astro";
import jsdoc from "eslint-plugin-jsdoc";
import noSecrets from "eslint-plugin-no-secrets";
import perfectionist from "eslint-plugin-perfectionist";
import promisePlugin from "eslint-plugin-promise";
import * as regexpPlugin from "eslint-plugin-regexp";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

const rootTsFiles = ["*.{ts,mts,cts}"];
const apiTsFiles = ["api/**/*.{ts,mts,cts,tsx}"];
const appTsFiles = ["app/**/*.{ts,mts,cts,tsx}"];
const cliTsFiles = ["cli/**/*.{ts,mts,cts,tsx}"];
const landingTsFiles = ["landing/**/*.{ts,mts,cts,tsx}"];
const mobileTsFiles = ["mobile/**/*.{ts,mts,cts,tsx}"];
const uiTsFiles = ["ui/**/*.{ts,mts,cts,tsx}"];
const scriptsTsFiles = [
  "scripts/**/*.{ts,mts,cts}",
  "*/scripts/**/*.{ts,mts,cts}",
];
const allTsFiles = [
  ...rootTsFiles,
  ...apiTsFiles,
  ...appTsFiles,
  ...cliTsFiles,
  ...landingTsFiles,
  ...mobileTsFiles,
  ...uiTsFiles,
  ...scriptsTsFiles,
];

const rootJsFiles = ["*.{js,mjs,cjs}"];
const workspaceJsFiles = ["{api,app,cli,landing,mobile,ui}/**/*.{js,mjs,cjs,jsx}"];
const allJsFiles = [...rootJsFiles, ...workspaceJsFiles];

const astroFiles = ["landing/**/*.astro"];
const allCodeFiles = [...allTsFiles, ...allJsFiles, ...astroFiles];
const scriptsSrc = scriptsTsFiles;

const tsConfigs = tseslint.configs.recommended.map(config => ({
  ...config,
  files: allTsFiles,
}));

const astroConfigs = eslintPluginAstro.configs["flat/recommended"].map(config => {
  if (Array.isArray(config.files)) {
    return {
      ...config,
      files: config.files.map(pattern => `landing/${pattern}`),
    };
  }

  if (config.rules) {
    return {
      ...config,
      files: astroFiles,
    };
  }

  return config;
});

export default [
  {
    ...js.configs.recommended,
    files: allJsFiles,
  },
  ...tsConfigs,
  ...astroConfigs,
  {
    files: allCodeFiles,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: astroFiles,
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        extraFileExtensions: [".astro"],
        parser: "@typescript-eslint/parser",
      },
    },
  },
  {
    files: [...allTsFiles, "landing/**/*.astro/*.js"],
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "no-console": [
        "warn",
        {
          allow: ["warn", "error", "info"],
        },
      ],
      "no-unused-vars": "off",
    },
  },
  {
    files: [...allJsFiles, ...astroFiles],
    rules: {
      "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
    },
  },
  {
    ...perfectionist.configs["recommended-natural"],
    files: [...allTsFiles, ...allJsFiles],
    rules: {
      ...perfectionist.configs["recommended-natural"].rules,
      "perfectionist/sort-imports": [
        "error",
        {
          order: "asc",
          type: "natural",
        },
      ],
    },
  },
  {
    ...unicorn.configs["recommended"],
    files: [...allTsFiles, ...allJsFiles],
    rules: {
      ...unicorn.configs["recommended"].rules,
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            camelCase: true,
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      "unicorn/import-style": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-sort": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
  {
    ...sonarjs.configs.recommended,
    files: [...allTsFiles, ...allJsFiles],
    rules: {
      ...sonarjs.configs.recommended.rules,
      "sonarjs/no-nested-conditional": "off",
      "sonarjs/no-nested-functions": "warn",
      "sonarjs/no-nested-template-literals": "off",
      "sonarjs/no-unused-vars": "off",
      "sonarjs/todo-tag": "warn",
    },
  },
  {
    ...regexpPlugin.configs["flat/recommended"],
    files: [...allTsFiles, ...allJsFiles],
  },
  {
    ...promisePlugin.configs["flat/recommended"],
    files: [...allTsFiles, ...allJsFiles],
  },
  {
    files: [
      "app/**/*.{ts,tsx,js,jsx}",
      "landing/**/*.{ts,tsx,js,jsx,astro}",
      "mobile/**/*.{ts,tsx,js,jsx}",
    ],
    plugins: {
      "no-secrets": noSecrets,
      security,
    },
    rules: {
      "no-secrets/no-secrets": "error",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-object-injection": "off",
      "security/detect-unsafe-regex": "error",
    },
  },
  {
    files: ["landing/src/pages/**/*.astro"],
    rules: {
      "no-secrets/no-secrets": "off",
    },
  },
  {
    files: ["landing/src/components/common/BasicScripts.astro"],
    rules: {
      "unicorn/consistent-function-scoping": "off",
      "unicorn/prefer-module": "off",
    },
  },
  {
    files: ["landing/src/utils/images-optimization.ts"],
    rules: {
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/fixme-tag": "off",
      "sonarjs/slow-regex": "off",
      "sonarjs/use-type-alias": "off",
      "unicorn/no-await-expression-member": "off",
      "unicorn/prefer-number-properties": "off",
      "unicorn/prefer-single-call": "off",
    },
  },
  {
    files: ["landing/src/utils/images.ts"],
    rules: {
      "sonarjs/cognitive-complexity": "off",
      "unicorn/no-await-expression-member": "off",
    },
  },
  {
    files: ["landing/src/utils/permalinks.ts"],
    rules: {
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/no-redundant-boolean": "off",
      "unicorn/no-useless-switch-case": "off",
    },
  },
  {
    ...jsdoc.configs["flat/recommended-typescript"],
    files: scriptsSrc,
    ignores: ["scripts/utils/**"],
    rules: {
      ...jsdoc.configs["flat/recommended-typescript"].rules,
      "jsdoc/require-file-overview": "off",
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
        },
      ],
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/public/**",
      "**/.astro/**",
    ],
  },
];
