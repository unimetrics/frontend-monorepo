import { handleRpcRequest } from "../core/router.js";
import type { RpcRequest } from "../core/rpc.js";
import type { ApiRouter, ProcedureDictionary } from "../core/types.js";

export interface WebSocketMessageEvent {
  data: string;
  reply: (payload: string) => void;
}

interface WebSocketMessageHandlerOptions<
  Ctx,
  Procedures extends ProcedureDictionary<Ctx>,
> {
  getContext: (event: WebSocketMessageEvent) => Ctx | Promise<Ctx>;
  router: ApiRouter<Ctx, Procedures>;
}

export function createWebSocketMessageHandler<
  Ctx,
  Procedures extends ProcedureDictionary<Ctx>,
>(options: WebSocketMessageHandlerOptions<Ctx, Procedures>) {
  return async (event: WebSocketMessageEvent): Promise<void> => {
    const request = JSON.parse(event.data) as RpcRequest;
    const response = await handleRpcRequest({
      getContext: () => options.getContext(event),
      request,
      router: options.router,
    });

    event.reply(JSON.stringify(response));
  };
}
