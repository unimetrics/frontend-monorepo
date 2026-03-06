import type { ApiCaller, ApiRouter, ProcedureDictionary } from "../core/types.js";

import { ApiTransportError, toApiError } from "../core/errors.js";
import { createRpcId, type RpcResponse } from "../core/rpc.js";

export interface WebSocketLike {
  addEventListener: (
    event: "message",
    listener: (event: MessageEventLike) => void
  ) => void;
  removeEventListener: (
    event: "message",
    listener: (event: MessageEventLike) => void
  ) => void;
  send: (payload: string) => void;
}

interface MessageEventLike {
  data: string;
}

interface WebSocketClientOptions {
  socket: WebSocketLike;
  timeoutMs?: number;
}

export function createWebSocketClient<Ctx, Procedures extends ProcedureDictionary<Ctx>>(
  router: ApiRouter<Ctx, Procedures>,
  options: WebSocketClientOptions
): ApiCaller<Procedures> {
  const pending = new Map<
    string,
    {
      reject: (error: Error) => void;
      resolve: (value: unknown) => void;
      timer: ReturnType<typeof setTimeout>;
    }
  >();

  const timeoutMs = options.timeoutMs ?? 15_000;

  const onMessage = (event: MessageEventLike) => {
    const payload = JSON.parse(event.data) as RpcResponse;
    const waiting = pending.get(payload.id);

    if (!waiting) {
      return;
    }

    clearTimeout(waiting.timer);
    pending.delete(payload.id);

    if (!payload.ok) {
      waiting.reject(
        toApiError(new ApiTransportError(payload.error.message, payload.error.details))
      );
      return;
    }

    waiting.resolve(payload.result);
  };

  options.socket.addEventListener("message", onMessage);

  return new Proxy({} as ApiCaller<Procedures>, {
    get: (_target, property) => {
      if (typeof property !== "string") {
        return;
      }

      return async (input: unknown) => {
        const id = createRpcId();

        const response = await new Promise<unknown>((resolve, reject) => {
          const timer = setTimeout(() => {
            pending.delete(id);
            reject(
              new ApiTransportError(`WebSocket request timed out after ${timeoutMs}ms`, {
                procedure: property,
              })
            );
          }, timeoutMs);

          pending.set(id, { reject, resolve, timer });

          options.socket.send(
            JSON.stringify({
              id,
              input: input ?? {},
              procedure: property,
            })
          );
        });

        const procedure = router.procedures[property];

        if (!procedure) {
          throw new ApiTransportError(
            `Unknown procedure in WebSocket client: ${property}`
          );
        }

        return procedure.output.parseAsync(response);
      };
    },
  });
}
