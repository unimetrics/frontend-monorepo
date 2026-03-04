import defaultTheme from "tailwindcss/defaultTheme";

const preset = {
  theme: {
    extend: {
      colors: {
        primary: "var(--aw-color-primary)",
        secondary: "var(--aw-color-secondary)",
        accent: "var(--aw-color-accent)",
        heading: "var(--aw-color-text-heading)",
        default: "var(--aw-color-text-default)",
        muted: "var(--aw-color-text-muted)",
      },
      fontFamily: {
        sans: ["var(--aw-font-sans, ui-sans-serif)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--aw-font-serif, ui-serif)", ...defaultTheme.fontFamily.serif],
        heading: [
          "var(--aw-font-heading, ui-sans-serif)",
          ...defaultTheme.fontFamily.sans,
        ],
      },
      borderRadius: {
        sm: "var(--ui-radius-sm)",
        DEFAULT: "var(--ui-radius-md)",
        lg: "var(--ui-radius-lg)",
        xl: "var(--ui-radius-xl)",
        full: "var(--ui-radius-pill)",
      },
      spacing: {
        18: "var(--ui-space-18)",
      },
    },
  },
};

export default preset;
