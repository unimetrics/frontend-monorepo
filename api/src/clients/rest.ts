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

interface RestClientOptions {
  baseUrl: string;
  fetch?: FetchLike;
  headers?: Record<string, string>;
}

export function createRestClient<Ctx, Procedures extends ProcedureDictionary<Ctx>>(
  router: ApiRouter<Ctx, Procedures>,
  options: RestClientOptions
): ApiCaller<Procedures> {
  const fetcher = options.fetch ?? (globalThis.fetch as FetchLike | undefined) ?? null;

  if (!fetcher) {
    throw new ApiTransportError("No fetch implementation available for REST client");
  }

  return new Proxy({} as ApiCaller<Procedures>, {
    get: (_target, property) => {
      if (typeof property !== "string") {
        return undefined;
      }

      return async (input: unknown) => {
        const response = await fetcher(
          `${options.baseUrl.replace(/\/$/, "")}/${property}`,
          {
            body: JSON.stringify(input ?? {}),
            headers: {
              "content-type": "application/json",
              ...options.headers,
            },
            method: "POST",
          }
        );

        if (!response.ok) {
          const payload = await response.text();
          throw new ApiTransportError(`REST request failed with ${response.status}`, {
            payload,
            procedure: property,
          });
        }

        const payload = (await response.json()) as {
          data?: unknown;
          error?: {
            code: string;
            details?: unknown;
            message: string;
          };
          ok: boolean;
        };

        if (!payload.ok || typeof payload === "undefined") {
          throw toApiError(
            new ApiTransportError(
              payload.error?.message ?? "REST request failed",
              payload.error
            )
          );
        }

        const procedure = router.procedures[property];

        if (!procedure) {
          throw new ApiTransportError(`Unknown procedure in REST client: ${property}`);
        }

        return procedure.output.parseAsync(payload.data);
      };
    },
  });
}
