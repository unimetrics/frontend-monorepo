import defaultTheme from "tailwindcss/defaultTheme";

const preset = {
  theme: {
    extend: {
      borderRadius: {
        DEFAULT: "var(--ui-radius-md)",
        full: "var(--ui-radius-pill)",
        lg: "var(--ui-radius-lg)",
        sm: "var(--ui-radius-sm)",
        xl: "var(--ui-radius-xl)",
      },
      colors: {
        accent: "var(--aw-color-accent)",
        default: "var(--aw-color-text-default)",
        heading: "var(--aw-color-text-heading)",
        muted: "var(--aw-color-text-muted)",
        primary: "var(--aw-color-primary)",
        secondary: "var(--aw-color-secondary)",
      },
      fontFamily: {
        heading: [
          "var(--aw-font-heading, ui-sans-serif)",
          ...defaultTheme.fontFamily.sans,
        ],
        sans: ["var(--aw-font-sans, ui-sans-serif)", ...defaultTheme.fontFamily.sans],
        serif: ["var(--aw-font-serif, ui-serif)", ...defaultTheme.fontFamily.serif],
      },
      spacing: {
        18: "var(--ui-space-18)",
      },
    },
  },
};

export default preset;
