import { ApiTransportError, toApiError } from "../core/errors.js";
import type { ApiCaller, ApiRouter, ProcedureDictionary } from "../core/types.js";

interface FetchLikeResponse {
  json: () => Promise<unknown>;
  ok: boolean;
  status: number;
  text: () => Promise<string>;
}

type FetchLike = (
  input: string,
  init?: {
    body?: string;
    headers?: Record<string, string>;
    method?: string;
  }
) => Promise<FetchLikeResponse>;

interface GraphqlClientOptions {
  endpoint: string;
  fetch?: FetchLike;
  fieldName?: string;
  headers?: Record<string, string>;
}

const DEFAULT_FIELD_NAME = "apiCall";

export function createGraphqlClient<Ctx, Procedures extends ProcedureDictionary<Ctx>>(
  router: ApiRouter<Ctx, Procedures>,
  options: GraphqlClientOptions
): ApiCaller<Procedures> {
  const fetcher = options.fetch ?? (globalThis.fetch as FetchLike | undefined) ?? null;

  if (!fetcher) {
    throw new ApiTransportError("No fetch implementation available for GraphQL client");
  }

  return new Proxy({} as ApiCaller<Procedures>, {
    get: (_target, property) => {
      if (typeof property !== "string") {
        return undefined;
      }

      return async (input: unknown) => {
        const fieldName = options.fieldName ?? DEFAULT_FIELD_NAME;
        const response = await fetcher(options.endpoint, {
          body: JSON.stringify({
            query: `query ApiCall($procedure: String!, $input: JSON) {
  ${fieldName}(procedure: $procedure, input: $input) {
    ok
    id
    result
    error {
      code
      message
      details
    }
  }
}`,
            variables: {
              input: input ?? {},
              procedure: property,
            },
          }),
          headers: {
            "content-type": "application/json",
            ...options.headers,
          },
          method: "POST",
        });

        if (!response.ok) {
          throw new ApiTransportError(
            `GraphQL request failed with ${response.status}`,
            await response.text()
          );
        }

        const payload = (await response.json()) as {
          data?: Record<string, unknown>;
          errors?: Array<{ message: string }>;
        };

        if (payload.errors?.length) {
          throw new ApiTransportError(
            payload.errors.map(error => error.message).join("; "),
            payload.errors
          );
        }

        const rpcResponse = payload.data?.[fieldName] as
          | {
              error?: {
                code: string;
                details?: unknown;
                message: string;
              };
              ok: boolean;
              result?: unknown;
            }
          | undefined;

        if (!rpcResponse?.ok) {
          throw toApiError(
            new ApiTransportError(
              rpcResponse?.error?.message ?? "GraphQL transport returned an error",
              rpcResponse?.error?.details
            )
          );
        }

        const procedure = router.procedures[property];

        if (!procedure) {
          throw new ApiTransportError(`Unknown procedure in GraphQL client: ${property}`);
        }

        return procedure.output.parseAsync(rpcResponse.result);
      };
    },
  });
}
