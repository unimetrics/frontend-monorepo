import { toApiError } from "./errors.js";

export interface RpcRequest {
  id: string;
  input: unknown;
  procedure: string;
}

export interface RpcErrorPayload {
  code: string;
  details?: unknown;
  message: string;
}

export interface RpcSuccessResponse {
  id: string;
  ok: true;
  result: unknown;
}

export interface RpcFailureResponse {
  error: RpcErrorPayload;
  id: string;
  ok: false;
}

export type RpcResponse = RpcFailureResponse | RpcSuccessResponse;

export function createRpcId(): string {
  if (typeof globalThis.crypto !== "undefined" && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  return `rpc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function toRpcFailure(id: string, error: unknown): RpcFailureResponse {
  const apiError = toApiError(error);

  return {
    error: {
      code: apiError.code,
      details: apiError.details,
      message: apiError.message,
    },
    id,
    ok: false,
  };
}

export function toRpcSuccess(id: string, result: unknown): RpcSuccessResponse {
  return {
    id,
    ok: true,
    result,
  };
}
