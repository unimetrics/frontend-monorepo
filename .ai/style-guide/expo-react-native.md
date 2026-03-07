# Expo React Native Style Guide (`mobile`)

Use this guide for changes inside `mobile/` (Expo + React Native + TypeScript).
For PR process and merge rules, also follow `../pr-instructions.md`.

## Core Principles

- Ship predictable behavior across iOS and Android first.
- Keep mobile UX responsive under poor network and low-end devices.
- Prefer simple and testable state transitions.
- Treat battery, bandwidth, and startup time as product constraints.

## Architecture and Boundaries

- Follow FSD boundaries as currently enforced for `mobile/src`.
- Keep screen composition separate from domain logic.
- Keep shared cross-platform utilities in reusable modules.
- Keep platform-specific logic explicit and isolated.

## Component Structure

- Build small, focused components with explicit props.
- Extract repeated UI patterns into shared primitives.
- Keep screens orchestration-focused; move business logic to hooks/services.
- Avoid deep prop drilling; compose by feature boundaries.

## TypeScript

- Use strict typing for props, navigation params, and API contracts.
- Avoid `any`; use `unknown` + runtime narrowing.
- Model state as explicit unions for async and lifecycle flows.
- Keep serialization-safe types for persisted/offline data.

## State and Data

- Keep ephemeral UI state local.
- Move reusable async/domain state into hooks/modules.
- Handle loading, stale, empty, and error states explicitly.
- Plan for intermittent connectivity and retries.

## Navigation

- Keep navigation decisions predictable and centralized.
- Type route params and validate before use.
- Avoid side-effect-heavy navigation in leaf components.
- Ensure deep links and app scheme handling stay consistent.

## Expo and Native Platform Practices

- Keep `app.json` identifiers and versioning stable.
- Add native capability changes deliberately and document them.
- Use Expo modules first before adding custom native code.
- Treat new permissions as product/security decisions, not implementation details.

## Styling and Layout

- Use `StyleSheet.create` for stable style objects where possible.
- Design for multiple screen sizes and safe areas.
- Avoid hardcoded pixel-perfect assumptions.
- Validate dark/light mode behavior where applicable.

## Performance

- Minimize work on initial render.
- Use memoization when profiling shows render pressure.
- Use `FlatList`/virtualized lists for large collections.
- Avoid unnecessary bridge traffic and expensive synchronous work.

## Accessibility

- Set accessibility roles, labels, and hints for interactive elements.
- Ensure touch targets are large enough.
- Keep text scalable and layouts resilient to font scaling.
- Validate screen reader flow on key screens.

## Error Handling and Telemetry

- Handle runtime failures with user-safe fallback states.
- Send actionable errors to monitoring without sensitive data.
- Tag events by screen/feature for debugging.
- Avoid noisy logs in production builds.

## Security

- Never store secrets in source or plain-text async storage.
- Use secure storage mechanisms for sensitive tokens.
- Validate all external inputs and deep-link payloads.
- Do not log credentials, session tokens, or wallet secrets.

## Web3 and Sensitive Value Handling

- Use `bigint` and decimal-safe helpers for on-chain values.
- Validate expected chain/network before sign/send operations.
- Avoid unlimited approvals by default.
- Handle pending/replaced/cancelled transaction states explicitly.

## Build and Release Discipline

- Keep EAS profiles/environment mapping explicit (`dev`, `preview`, `prod`).
- Test critical flows on both iOS and Android before promotion.
- Keep OTA update strategy compatible with native runtime versions.
- Document migration steps for config or native dependency changes.

## Testing Expectations

- Add tests for new business logic and bug fixes where feasible.
- Keep unit tests deterministic and independent from real network/device state.
- Run TypeScript checks before PR.
- For critical UI behavior, include manual test notes by platform.

## PR Checklist (Expo)

- FSD boundaries respected.
- Types and route params are explicit.
- Loading/error/offline states handled.
- Accessibility basics validated.
- Sensitive data handling reviewed.
- Lint/typecheck/build expectations pass.
