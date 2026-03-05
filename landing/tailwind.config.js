import typographyPlugin from "@tailwindcss/typography";
import uiTailwindPreset from "@unimetrics/ui/tailwind-preset";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,json,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  plugins: [
    typographyPlugin,
    plugin(({ addVariant }) => {
      addVariant("intersect", "&:not([no-intersect])");
    }),
  ],
  presets: [uiTailwindPreset],
  theme: {
    extend: {
      animation: {
        fade: "fadeInUp 1s both",
      },

      keyframes: {
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(2rem)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
    },
  },
};
