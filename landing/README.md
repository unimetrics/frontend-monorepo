<div align="center">
  <h1 style="margin: 0; padding: 0;">@unimetrics/landing</h1>
</div>
<br />
<div align="center">
  This package contains the code for the landing page of Unimetrics. It is built with Astro and Tailwind CSS.
</div>

## Table of Contents

- [Description](#description)
- [Development](#development)
- [Pages CMS (Posts)](#pages-cms-posts)
- [Contributing](#contributing)
- [License](#license)

## Description

The landing page is based on [Astrowind template](https://github.com/arthelokyo/astrowind) with some customizations to fit our needs. It serves as the main entry point for users visiting the Unimetrics website and provides information about the product, its features, and how to get started.

## Development

To run the landing page locally, run the following command:

```bash
pnpm dev
```

This will start the Astro development server.

## Pages CMS (Posts)

This repository is preconfigured for [Pages CMS](https://pagescms.org/) with a root [`/.pages.yml`](../.pages.yml) file targeting blog posts in `landing/src/data/post`.

Security-first authoring flow:

1. Use a dedicated source branch for CMS edits (default: `cms/posts`).
2. Edit content from Pages CMS on that branch (not on `main`).
3. Let workflow [`/.github/workflows/cms-posts-pr.yaml`](../.github/workflows/cms-posts-pr.yaml) open/update a PR from `cms/posts` to `main` using the helper bot GitHub App token.
4. Merge through normal branch protection and checks.

Notes:

- You can override source/target branches with repository variables:
  - `CMS_POSTS_SOURCE_BRANCH` (default `cms/posts`)
  - `CMS_POSTS_TARGET_BRANCHES` (default `main`)
- Keep the CMS source branch protected:
  - [`/.github/rulesets/branch-cms-posts-deletion.json`](../.github/rulesets/branch-cms-posts-deletion.json)
  - [`/.github/rulesets/branch-cms-posts-force-push.json`](../.github/rulesets/branch-cms-posts-force-push.json)
- Limit write access on `cms/posts` to trusted editors and automation only.
- Avoid enabling commit-signature requirements on `cms/posts` unless your CMS commit path supports signed commits.
- If you use the hosted Pages CMS (`https://app.pagescms.org`), you do not need to add Pages CMS source code to this monorepo.
- If you self-host Pages CMS, run it as a separate service (recommended) and keep its database/app secrets isolated from the landing app.

## Contributing

Follow root repository contribution guidelines in [CONTRIBUTING](../CONTRIBUTING.md).

## License

This package inherits the license of the Unimetrics monorepo. Please refer to the [LICENSE](../LICENSE) file for more information.
