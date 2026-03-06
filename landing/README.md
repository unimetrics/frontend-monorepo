# 🚀 Unimetrics

<img src="https://raw.githubusercontent.com/unimetrics/.github/main/resources/unimetrics/lighthouse-score.png" align="right"
     alt="Unimetrics Lighthouse Score" width="100" height="358">

🌟 _Most *starred* & *forked* Astro theme in 2022, 2023 & 2024_. 🌟

**Unimetrics** is a free and open-source template to make your website using **[Astro 5.0](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/)**. Ready to start a new project and designed taking into account web best practices.

- ✅ **Production-ready** scores in **PageSpeed Insights** reports.
- ✅ Integration with **Tailwind CSS** supporting **Dark mode** and **_RTL_**.
- ✅ **Fast and SEO friendly blog** with automatic **RSS feed**, **MDX** support, **Categories & Tags**, **Social Share**, ...
- ✅ **Image Optimization** (using new **Astro Assets** and **Unpic** for Universal image CDN).
- ✅ Generation of **project sitemap** based on your routes.
- ✅ **Open Graph tags** for social media sharing.
- ✅ **Analytics** built-in Google Analytics, and Splitbee integration.

<br>

![Unimetrics Theme Screenshot](https://raw.githubusercontent.com/unimetrics/.github/main/resources/unimetrics/screenshot-unimetrics-1.0.png)

[![unimetrics](https://custom-icon-badges.demolab.com/badge/made%20by%20-unimetrics-556bf2?style=flat-square&logo=github&logoColor=white&labelColor=101827)](https://github.com/unimetrics)
[![License](https://img.shields.io/github/license/unimetrics/frontend-monorepo?style=flat-square&color=dddddd&labelColor=000000)](https://github.com/unimetrics/frontend-monorepo/blob/main/LICENSE.md)
[![Maintained](https://img.shields.io/badge/maintained%3F-yes-brightgreen.svg?style=flat-square)](https://github.com/unimetrics)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat-square)](https://github.com/unimetrics/frontend-monorepo#contributing)
[![Known Vulnerabilities](https://snyk.io/test/github/unimetrics/frontend-monorepo/badge.svg?style=flat-square)](https://snyk.io/test/github/unimetrics/frontend-monorepo)
[![Stars](https://img.shields.io/github/stars/unimetrics/frontend-monorepo.svg?style=social&label=stars&maxAge=86400&color=ff69b4)](https://github.com/unimetrics/frontend-monorepo)
[![Forks](https://img.shields.io/github/forks/unimetrics/frontend-monorepo.svg?style=social&label=forks&maxAge=86400&color=ff69b4)](https://github.com/unimetrics/frontend-monorepo)

<br>

<details open>
<summary>Table of Contents</summary>

- [Demo](#demo)
- [Upcoming: Unimetrics 2.0 – We Need Your Vision!](#-upcoming-unimetrics-20--we-need-your-vision)
- [TL;DR](#tldr)
- [Getting started](#getting-started)
  - [Project structure](#project-structure)
  - [Commands](#commands)
  - [Configuration](#configuration)
  - [Deploy](#deploy)
- [Frequently Asked Questions](#frequently-asked-questions)
- [Related Projects](#related-projects)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

</details>

<br>

## Demo

📌 [https://unimetrics.com/](https://unimetrics.com/)

<br>

## 🔔 Upcoming: Unimetrics 2.0 – We Need Your Vision!

We're embarking on an exciting journey with **Unimetrics 2.0**, and we want you to be a part of it! We're currently taking the first steps in developing this new version and your insights are invaluable. Join the discussion and share your feedback, ideas, and suggestions to help shape the future of **Unimetrics**. Let's make **Unimetrics 2.0** even better, together!

[Share Your Feedback in Our Discussion!](https://github.com/unimetrics/frontend-monorepo/discussions/392)

<br>

## TL;DR

```shell
pnpm create astro@latest --template unimetrics/frontend-monorepo
```

## Getting started

**Unimetrics** tries to give you quick access to creating a website using [Astro 5.0](https://astro.build/) + [Tailwind CSS](https://tailwindcss.com/). It's a free theme which focuses on simplicity, good practices and high performance.

Very little vanilla javascript is used only to provide basic functionality so that each developer decides which framework (React, Vue, Svelte, Solid JS...) to use and how to approach their goals.

In this version the template supports all the options in the `output` configuration, `static`, `hybrid` and `server`, but the blog only works with `prerender = true`. We are working on the next version and aim to make it fully compatible with SSR.

### Project structure

Inside **Unimetrics** template, you'll see the following folders and files:

```
/
├── public/
│   ├── _headers
│   └── robots.txt
├── src/
│   ├── assets/
│   │   ├── favicons/
│   │   ├── images/
│   │   └── styles/
│   │       └── tailwind.css
│   ├── components/
│   │   ├── blog/
│   │   ├── common/
│   │   ├── ui/
│   │   ├── widgets/
│   │   │   ├── Header.astro
│   │   │   └── ...
│   │   ├── CustomStyles.astro
│   │   ├── Favicons.astro
│   │   └── Logo.astro
│   ├── content/
│   │   ├── post/
│   │   │   ├── post-slug-1.md
│   │   │   ├── post-slug-2.mdx
│   │   │   └── ...
│   │   └-- config.ts
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── MarkdownLayout.astro
│   │   └── PageLayout.astro
│   ├── pages/
│   │   ├── [...blog]/
│   │   │   ├── [category]/
│   │   │   ├── [tag]/
│   │   │   ├── [...page].astro
│   │   │   └── index.astro
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├-- rss.xml.ts
│   │   └── ...
│   ├── utils/
│   ├── config.yaml
│   └── navigation.js
├── package.json
├── astro.config.ts
└── ...
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory if they do not require any transformation or in the `assets/` directory if they are imported directly.

[![Edit Unimetrics on CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://githubbox.com/unimetrics/frontend-monorepo/tree/main) [![Open in Gitpod](https://svgshare.com/i/xdi.svg)](https://gitpod.io/?on=gitpod#https://github.com/unimetrics/frontend-monorepo) [![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/unimetrics/frontend-monorepo)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file `README.md`. Update `src/config.yaml` and contents. Have fun!

<br>

### Commands

All commands are run from the root of the project, from a terminal:

| Command          | Action                                             |
| :--------------- | :------------------------------------------------- |
| `pnpm install`   | Installs dependencies                              |
| `pnpm dev`       | Starts local dev server at `localhost:4321`        |
| `pnpm build`     | Build your production site to `./dist/`            |
| `pnpm preview`   | Preview your build locally, before deploying       |
| `pnpm check`     | Check your project for errors                      |
| `pnpm fix`       | Run Eslint and format codes with Prettier          |
| `pnpm astro ...` | Run CLI commands like `astro add`, `astro preview` |

<br>

### Configuration

Basic configuration file: `./src/config.yaml`

```yaml
site:
  name: "Example"
  site: "https://example.com"
  base: "/" # Change this if you need to deploy to Github Pages, for example
  trailingSlash: false # Generate permalinks with or without "/" at the end

  googleSiteVerificationId: false # Or some value,

# Default SEO metadata
metadata:
  title:
    default: "Example"
    template: "%s — Example"
  description: "This is the default meta description of Example website"
  robots:
    index: true
    follow: true
  openGraph:
    site_name: "Example"
    images:
      - url: "~/assets/images/default.png"
        width: 1200
        height: 628
    type: website
  twitter:
    handle: "@twitter_user"
    site: "@twitter_user"
    cardType: summary_large_image

i18n:
  language: en
  textDirection: ltr

apps:
  blog:
    isEnabled: true # If the blog will be enabled
    postsPerPage: 6 # Number of posts per page

    post:
      isEnabled: true
      permalink: "/blog/%slug%" # Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
      robots:
        index: true

    list:
      isEnabled: true
      pathname: "blog" # Blog main path, you can change this to "articles" (/articles)
      robots:
        index: true

    category:
      isEnabled: true
      pathname: "category" # Category main path /category/some-category, you can change this to "group" (/group/some-category)
      robots:
        index: true

    tag:
      isEnabled: true
      pathname: "tag" # Tag main path /tag/some-tag, you can change this to "topics" (/topics/some-category)
      robots:
        index: false

    isRelatedPostsEnabled: true # If a widget with related posts is to be displayed below each post
    relatedPostsCount: 4 # Number of related posts to display

analytics:
  vendors:
    googleAnalytics:
      id: null # or "G-XXXXXXXXXX"

ui:
  theme: "system" # Values: "system" | "light" | "dark" | "light:only" | "dark:only"
```

<br>

#### Customize Design

To customize Font families, Colors or more Elements refer to the following files:

- `src/components/CustomStyles.astro`
- `src/assets/styles/tailwind.css`

### Deploy

#### Deploy to production (manual)

You can create an optimized production build with:

```shell
pnpm build
```

Now, your website is ready to be deployed. All generated files are located at
`dist` folder, which you can deploy the folder to any hosting service you
prefer.

#### Deploy to Netlify

Clone this repository on your own GitHub account and deploy it to Netlify:

[![Netlify Deploy button](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/unimetrics/frontend-monorepo)

#### Deploy to Vercel

Clone this repository on your own GitHub account and deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Funimetrics%2Ffrontend-monorepo)

<br>

## Frequently Asked Questions

- Why?
-
-

<br>

## Related projects

- [TailNext](https://tailnext.vercel.app/) - Free template using Next.js 14 and Tailwind CSS with the new App Router.
- [Qwind](https://qwind.pages.dev/) - Free template to make your website using Qwik + Tailwind CSS.

## Contributing

If you have any ideas, suggestions or find any bugs, feel free to open a discussion, an issue or create a pull request.
That would be very useful for all of us and we would be happy to listen and take action.

## Acknowledgements

Maintained by the Unimetrics team and a community of [contributors](https://github.com/unimetrics/frontend-monorepo/graphs/contributors).

## License

**Unimetrics** is licensed under the MIT license — see the [LICENSE](./LICENSE.md) file for details.
