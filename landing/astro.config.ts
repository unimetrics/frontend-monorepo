import type { AstroIntegration } from "astro";

import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import compress from "astro-compress";
import icon from "astro-icon";
import { defineConfig } from "astro/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  lazyImagesRehypePlugin,
  readingTimeRemarkPlugin,
  responsiveTablesRehypePlugin,
} from "./src/utils/frontmatter";
import unimetrics from "./vendor/integration";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hasExternalScripts = false;
const whenExternalScripts = (
  items: (() => AstroIntegration)[] | (() => AstroIntegration) = []
) =>
  hasExternalScripts
    ? Array.isArray(items)
      ? items.map(item => item())
      : [items()]
    : [];

export default defineConfig({
  image: {
    domains: ["cdn.pixabay.com", "images.unsplash.com", "plus.unsplash.com"],
  },

  integrations: [
    sitemap(),
    mdx(),
    react(),
    icon({
      include: {
        "flat-color-icons": [
          "template",
          "gallery",
          "approval",
          "document",
          "advertising",
          "currency-exchange",
          "voice-presentation",
          "business-contact",
          "database",
        ],
        tabler: ["*"],
      },
    }),

    ...whenExternalScripts(() =>
      partytown({
        config: { forward: ["dataLayer.push"] },
      })
    ),

    compress({
      CSS: true,
      HTML: {
        "html-minifier-terser": {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      Logger: 1,
      SVG: false,
    }),

    unimetrics({
      config: "./src/config.yaml",
    }),
  ],

  markdown: {
    rehypePlugins: [responsiveTablesRehypePlugin, lazyImagesRehypePlugin],
    remarkPlugins: [readingTimeRemarkPlugin],
  },

  output: "static",

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "~": path.resolve(__dirname, "./src"),
      },
    },
  },
});
