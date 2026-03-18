<div align="center">
  <h1 style="margin: 0; padding: 0;">@unimetrics/design-tokens</h1>
</div>
<br />
<div align="center">
  This is a package that contains design system tokens for the Unimetrics frontend monorepo.
</div>

## Table of Contents

- [Description](#description)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Description

The `@unimetrics/design-tokens` package is a collection of design tokens that define the visual style of the Unimetrics frontend applications. These tokens include colors, typography, spacing, and other design elements that can be used across all frontend projects.

Tokens are defined and configured in [Tokens Studio](https://github.com/tokens-studio) format.
The source JSON layout is:

- `tokens/core.json`
- `tokens/semantic.json`
- `tokens/themes/light.json`
- `tokens/themes/dark.json`

From these sources, the build step generates `tokens.css` and `theme.css` for frontend consumption.

This approach allows us to maintain a _single source of truth_ for our design system, making it easier to update and manage our visual style across all projects.
We don't include design tokens in the React UI kit because we try to keep the system flexible and _avoid tight coupling_ between its parts. By separating the design tokens into their own package, we can ensure that they can be used across all frontend projects without being tied to a specific implementation or framework.

## Usage

As it was said, the project assumes that the consumer projects are utilizing tailwindcss, so the generated css variables can be used directly in the tailwind configuration. Nevertheless, you can also use the generated css variables from `tokens.css` in your stylesheets or inline styles.

```css
/* Example of using generated css variables in another package */
@import "tailwindcss";
@import "@unimetrics/design-tokens/theme.css";
@import "@unimetrics/design-tokens/tokens.css";

/* Your styles here */
```

## Contributing

Follow root repository contribution guidelines in [CONTRIBUTING](../CONTRIBUTING.md).

When editing design tokens, update the source JSON files in `tokens/` and `tokens/themes/`. After making changes, run the build script to generate updated `tokens.css` and `theme.css`.

```bash
pnpm build
```

You can also run the build script in watch mode during development to automatically regenerate the token files whenever you make changes, which is quite useful for local development.

```bash
pnpm dev
```

Ensure, you don't edit the generated files directly, as they will be overwritten the next time you run the build script. Always make changes to the source JSON files in `tokens/` and `tokens/themes/`.

## License

This package inherits the license of the Unimetrics monorepo. Please refer to the [LICENSE](../LICENSE) file for more information.
