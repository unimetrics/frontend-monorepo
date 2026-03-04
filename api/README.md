# @unimetrics/api

Type-safe API handler collection for all frontend surfaces.

## Goals

- Single source of handler logic
- Shared TypeScript input/output contracts
- Transport adapters for REST, WebSocket, and GraphQL
- Typed clients for CLI, web app, and mobile app

## Main Exports

- `createApiRouter`, `defineProcedure`, `createCaller`
- `createRestHandler`, `createWebSocketMessageHandler`, `createGraphqlRpcResolver`
- `createRestClient`, `createWebSocketClient`, `createGraphqlClient`
- `lpDeskRouter`, `createLpDeskContext`

## Build

```sh
pnpm --filter @unimetrics/api build
```

## Example

```ts
import { createCaller, createLpDeskContext, lpDeskRouter } from "@unimetrics/api";

const caller = createCaller({
  getContext: () =>
    createLpDeskContext({
      apiUrl: "http://localhost:8080",
      nodeVersion: process.versions.node,
    }),
  router: lpDeskRouter,
});

const result = await caller.metrics({ wallet: "0xabc" });
```
