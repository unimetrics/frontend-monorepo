# Astro Style Guide (`landing`)

Use this guide for changes inside `landing/` (Astro + static output + selective React islands).
For PR process and merge rules, also follow `../pr-instructions.md`.

## Core Principles

- Prefer static output by default.
- Use islands only for real interactivity.
- Keep pages content-first and fast-first.
- Treat SEO, accessibility, and performance as baseline requirements.

## Architecture and Content

- Keep route-level composition in `src/pages`.
- Keep reusable layout and shell concerns in `src/layouts`.
- Keep reusable UI blocks in `src/components`.
- Use content collections and typed frontmatter for structured content.

## Static-First Strategy

- Default to server-free static rendering.
- Add client-side hydration only where needed (`client:load`, `client:visible`, `client:idle`).
- Choose the lightest hydration directive that satisfies UX.
- Avoid hydrating entire pages when one interactive island is enough.

## Component Conventions

- Keep Astro components mostly presentational.
- Keep heavy transformations in utility modules, not template blocks.
- Avoid deeply nested conditional rendering in `.astro` files.
- Prefer explicit props typing in frontmatter scripts.

## React Islands in Astro

- Use React islands for complex interactions only.
- Keep island props serializable and minimal.
- Avoid passing large mutable objects through hydration boundaries.
- Document why hydration is required for each new island.

## TypeScript and Data Validation

- Type content frontmatter and configuration objects.
- Validate external data before rendering.
- Handle missing/invalid content gracefully.
- Avoid `any` in page data paths.

## Styling

- Use Tailwind utilities with shared tokens.
- Avoid page-level one-off style drift unless intentionally scoped.
- Prefer predictable class structure over ad-hoc utility accumulation.

## Images and Media

- Use Astro image tooling and optimization helpers.
- Prefer local optimized assets for critical visuals.
- Use responsive sizes and meaningful alt text.
- Keep external image domains explicitly configured.

## SEO and Metadata

- Set canonical URLs, title, description, and social metadata per page type.
- Ensure sitemap and RSS behavior remain correct after route/content changes.
- Keep robots and indexing directives explicit.
- Validate preview cards and structured data on key pages.

## Performance

- Protect Core Web Vitals by minimizing hydrated JS.
- Keep third-party scripts opt-in and scoped.
- Use compression and caching rules intentionally.
- Track bundle and image growth in PRs with notable impact.

## Accessibility

- Use semantic landmarks (`header`, `main`, `nav`, `footer`).
- Maintain heading hierarchy and meaningful link text.
- Ensure keyboard access for menus, toggles, and dialogs.
- Respect reduced-motion and color-contrast requirements.

## CMS and Content Editing Safety

- Keep CMS config changes backwards-compatible for editors.
- Validate generated routes from new content paths.
- Guard against missing metadata in markdown/MDX.
- Avoid introducing content schema ambiguity.

## Environment and Config

- Use `PUBLIC_` env vars only for client-exposed values.
- Never expose secrets through public env variables.
- Keep `astro.config.ts` changes focused and documented in PR description.
- Treat adapter/output changes as deployment-impacting changes.

## Testing and Validation

- Run Astro checks and workspace lint/format before merge.
- Validate broken link risk on changed routes/navigation.
- Smoke-test critical pages in preview deployments.
- Verify analytics and SEO tags on representative pages.

## PR Checklist (Astro)

- Static-first rendering preserved unless intentional.
- New hydration has clear reason and minimal scope.
- Metadata and SEO for changed pages are correct.
- Accessibility basics validated.
- Build/check/lint/format pass.
- Content changes include schema/frontmatter compatibility checks.
