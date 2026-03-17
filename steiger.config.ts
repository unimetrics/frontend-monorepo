import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

// TODO: gradually remove while migrating landing and mobile to fsd
const legacyRules = {
  "fsd/ambiguous-slice-names": "off",
  "fsd/excessive-slicing": "off",
  "fsd/forbidden-imports": "off",
  "fsd/inconsistent-naming": "off",
  "fsd/insignificant-slice": "off",
  "fsd/no-layer-public-api": "off",
  "fsd/no-processes": "off",
  "fsd/no-public-api-sidestep": "off",
  "fsd/no-reserved-folder-names": "off",
  "fsd/no-segmentless-slices": "off",
  "fsd/no-segments-on-sliced-layers": "off",
  "fsd/no-ui-in-app": "off",
  "fsd/public-api": "off",
  "fsd/repetitive-naming": "off",
  "fsd/segments-by-purpose": "off",
  "fsd/shared-lib-grouping": "off",
  "fsd/typo-in-layer-name": "off",
} as const;

export default defineConfig([
  ...fsd.configs.recommended,
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.astro/**",
      "**/.expo/**",
      "**/.expo-shared/**",
      "**/coverage/**",
      "**/*.d.ts",
      "**/*.config.*",
      "**/public/**",
      "./api/**",
      "./cli/**",
      "./ui/**",
    ],
  },
  {
    files: ["./landing/src/**"],
    rules: legacyRules,
  },
  {
    files: ["./mobile/**"],
    rules: legacyRules,
  },
]);
