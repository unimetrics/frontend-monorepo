import {
  ApiMethodNotAllowedError,
  ApiProcedureNotFoundError,
  toApiError,
} from "../core/errors.js";
import { executeProcedure } from "../core/router.js";
import type { ApiRouter, ProcedureDictionary } from "../core/types.js";

export interface RestHandlerRequest {
  body?: unknown;
  method: string;
  path: string;
  query?: Record<string, string | undefined>;
}

export interface RestHandlerResponse {
  body: unknown;
  headers: Record<string, string>;
  status: number;
}

interface RestHandlerOptions<Ctx, Procedures extends ProcedureDictionary<Ctx>> {
  basePath?: string;
  getContext: (request: RestHandlerRequest) => Ctx | Promise<Ctx>;
  router: ApiRouter<Ctx, Procedures>;
}

const DEFAULT_HEADERS = {
  "content-type": "application/json",
};

function normalizeProcedurePath(pathname: string, basePath: string): string {
  if (!pathname.startsWith(basePath)) {
    return "";
  }

  return decodeURIComponent(pathname.slice(basePath.length).replace(/^\/+/, ""));
}

function getInputForMethod(request: RestHandlerRequest): unknown {
  if (request.method === "GET") {
    const encoded = request.query?.input;

    if (!encoded) {
      return request.query ?? {};
    }

    return JSON.parse(encoded);
  }

  return request.body ?? {};
}

export function createRestHandler<Ctx, Procedures extends ProcedureDictionary<Ctx>>(
  options: RestHandlerOptions<Ctx, Procedures>
) {
  const basePath = options.basePath ?? "/api";

  return async (request: RestHandlerRequest): Promise<RestHandlerResponse> => {
    try {
      if (!request.method) {
        throw new ApiMethodNotAllowedError("UNKNOWN");
      }

      if (request.method !== "GET" && request.method !== "POST") {
        throw new ApiMethodNotAllowedError(request.method);
      }

      const procedure = normalizeProcedurePath(request.path, basePath);

      if (!procedure) {
        throw new ApiProcedureNotFoundError(request.path);
      }

      const ctx = await options.getContext(request);
      const input = getInputForMethod(request);
      const data = await executeProcedure({
        ctx,
        input,
        name: procedure,
        router: options.router,
      });

      return {
        body: {
          data,
          ok: true,
          procedure,
        },
        headers: DEFAULT_HEADERS,
        status: 200,
      };
    } catch (error) {
      const apiError = toApiError(error);

      return {
        body: {
          error: {
            code: apiError.code,
            details: apiError.details,
            message: apiError.message,
          },
          ok: false,
        },
        headers: DEFAULT_HEADERS,
        status: apiError.status,
      };
    }
  };
}
