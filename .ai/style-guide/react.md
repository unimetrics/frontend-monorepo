# React Style Guide (`app`)

Use this guide for changes inside `app/` (React + Vite + TypeScript + Tailwind + PWA).

## Core Principles

- Keep components small and purpose-driven.
- Push business logic into hooks, services, or model-layer utilities.
- Prefer explicit data flow over implicit shared mutable state.
- Optimize for readability first, then performance where measurements justify it.

## Architecture and Boundaries

- Follow FSD import and layer boundaries from `FSD.md`.
- Import from slice public APIs (`index.ts`), not deep internals.
- Keep page orchestration in `pages/` and high-level providers in `app/`.
- Keep domain-agnostic utilities in `shared/`.

## File and Export Conventions

- Use named exports by default.
- Keep one major component per file.
- Co-locate view-specific hooks, styles, and tests near the component.
- Keep barrels minimal and stable; do not re-export internals accidentally.

## TypeScript

- Type all component props explicitly.
- Use `type` for object/union composition; use `interface` for extension contracts.
- Avoid `any`; use `unknown` and narrow it.
- Model async states explicitly (`idle | loading | success | error`).
- Keep parsing and validation near boundaries (API, storage, URL params).

## Component Patterns

- Components should be mostly declarative; heavy conditionals move to helpers.
- Prefer composition over inheritance and boolean prop explosions.
- Use controlled components for critical forms.
- Keep effects minimal; compute derived values during render when possible.

## Hooks

- Custom hooks should expose a stable API and hide implementation details.
- Keep hooks pure except for intentional side effects.
- Do not silence exhaustive-deps without a clear reason.
- Prefer `useMemo` and `useCallback` only when they prevent real re-renders or expensive recalculation.

## State Management

- Start with local state.
- Promote to shared state only when multiple distant consumers need it.
- Keep server/cache state separate from ephemeral UI state.
- Avoid large mutable singleton stores.

## Data Fetching and API Integration

- Centralize request/response typing through shared API contracts.
- Handle loading, empty, and error states in UI explicitly.
- Treat third-party/indexer data as eventually consistent.
- Retry only idempotent reads; never blindly retry writes.

## Error Handling and Observability

- Surface user-safe error messages in UI.
- Log actionable details to Sentry (without secrets).
- Tag errors with feature/module context.
- Fail closed for security-sensitive flows.

## Routing

- Keep route modules thin and focused on composition.
- Validate route params before use.
- Avoid hidden navigation side effects in low-level components.

## Styling and Design System

- Use Tailwind utilities with shared tokens from `@unimetrics/ui` where possible.
- Prefer semantic utility groups over long unstructured class strings.
- Extract repeated class patterns into local helpers/components.
- Respect spacing, typography, and color consistency.

## Accessibility

- Use semantic HTML first.
- Ensure keyboard navigation for all interactive elements.
- Always provide accessible names for controls.
- Preserve visible focus states.
- Validate contrast and motion preferences.

## Performance

- Lazy-load heavy routes/features.
- Keep bundle growth controlled; justify new dependencies.
- Use list virtualization for long collections.
- Avoid unnecessary re-renders by stabilizing props and splitting components.

## PWA and Runtime Environment

- Keep PWA manifest/service worker settings aligned with product behavior.
- Treat service worker caching rules as production behavior changes, not minor refactors.
- Use `import.meta.env` with `VITE_` prefix only.
- Never expose secrets via client env variables.

## i18n

- Externalize user-visible text where localization is expected.
- Avoid hardcoded locale assumptions for numbers, dates, and currency.
- Keep fallback copy deterministic.

## Testing Expectations

- Add tests for critical business logic and bug fixes.
- Prefer unit tests for pure logic and integration tests for user flows.
- Keep tests deterministic; avoid real network calls.
- Cover failure paths, not only happy paths.

## Security and Web3-Specific Guardrails

- Validate expected `chainId` before any signing action.
- Use decimal-safe math (`bigint` and helpers), never floating-point for on-chain amounts.
- Avoid unlimited approvals by default.
- Enforce explicit slippage/deadline controls on swap-like actions.
- Never log private keys, seed phrases, tokens, raw signed payloads, or wallet secrets.

## PR Checklist (React)

- Boundaries follow FSD and public API imports.
- Types are explicit; no `any` leakage.
- UI handles loading/empty/error states.
- Accessibility basics validated.
- Lint/typecheck/build pass.
- New logic includes tests or rationale for omission.
