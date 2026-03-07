<div align="center">
  <h1 style="margin: 0; padding: 0;">@unimetrics/ui</h1>
</div>
<br />
<div align="center">
  This is a package that contains ui design system tokens for the Unimetrics frontend monorepo.
</div>

## Table of Contents

- [Description](#description)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description

The `@unimetrics/ui` package is a collection of design tokens that define the visual style of the Unimetrics frontend applications. These tokens include colors, typography, spacing, and other design elements that can be used across all frontend projects.

Tokens are defined and configured in [Tokens Studio](https://github.com/tokens-studio) format.
Tokens are represented as JSON files in `tokens/sets/` and are generated into a single `tokens/generated/tokens.studio.json` file for easy consumption by Figma and other tools. See the [Tokens Studio plugin docs](https://docs.tokens.studio/token-storage/manage-sync-provider) for more information on how to sync JSON token representations with Figma.
On the other hand, tailwindcss-like css variables are generated into `tokens.css` and `theme.css` files for use in frontend applications.

This approach allows us to maintain a _single source of truth_ for our design system, making it easier to update and manage our visual style across all projects.
We don't include design tokens in the React ui-kit because we try to keep the system flexible and _avoid tight coupling_ between its parts. By separating the design tokens into their own package, we can ensure that they can be used across all frontend projects without being tied to a specific implementation or framework.

## Usage

As it was said, the project assumes that the consumer projects are utilizing tailwindcss, so the generated css variables can be used directly in the tailwind configuration. Nevertheless, you can also use the generated css variables from `tokens.css` in your stylesheets or inline styles.

```css
/* Example of using generated css variables in another package */
@import "tailwindcss";
@import "@unimetrics/ui/tokens.css";
@import "@unimetrics/ui/theme.css";

/* Your styles here */
```

## Contributing

When editing design tokens, please make sure to update the corresponding JSON files in the `tokens/sets` directory. After making changes, run the build script to generate the updated `tokens/generated/tokens.studio.json`, `tokens.css`, and `theme.css` files.

```bash
pnpm build
```

You can also run the build script in watch mode during development to automatically regenerate the token files whenever you make changes, which is quite useful for local development.

```bash
pnpm dev
```

Ensure, you don't edit the generated files directly, as they will be overwritten the next time you run the build script. Always make changes to the source JSON files in the `tokens/sets` directory.

## License

This package inherits the license of the Unimetrics monorepo. Please refer to the [LICENSE](../LICENSE) file for more information.
