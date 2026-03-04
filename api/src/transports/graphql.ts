import { createRpcId, type RpcResponse } from "../core/rpc.js";
import { handleRpcRequest } from "../core/router.js";
import type { ApiRouter, ProcedureDictionary } from "../core/types.js";

export interface GraphqlRpcArgs {
  input?: unknown;
  procedure: string;
}

interface GraphqlRpcResolverOptions<Ctx, Procedures extends ProcedureDictionary<Ctx>> {
  getContext: (contextValue: unknown, args: GraphqlRpcArgs) => Ctx | Promise<Ctx>;
  router: ApiRouter<Ctx, Procedures>;
}

export const GRAPHQL_RPC_SDL = `
scalar JSON

type RpcError {
  code: String!
  message: String!
  details: JSON
}

type RpcResponse {
  id: ID!
  ok: Boolean!
  result: JSON
  error: RpcError
}

type Query {
  apiCall(procedure: String!, input: JSON): RpcResponse!
}
`;

export function createGraphqlRpcResolver<
  Ctx,
  Procedures extends ProcedureDictionary<Ctx>,
>(options: GraphqlRpcResolverOptions<Ctx, Procedures>) {
  return async (
    _parent: unknown,
    args: GraphqlRpcArgs,
    contextValue: unknown
  ): Promise<RpcResponse> => {
    return handleRpcRequest({
      getContext: () => options.getContext(contextValue, args),
      request: {
        id: createRpcId(),
        input: args.input ?? {},
        procedure: args.procedure,
      },
      router: options.router,
    });
  };
}
