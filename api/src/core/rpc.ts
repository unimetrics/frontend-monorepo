import { toApiError } from "./errors.js";

export interface RpcErrorPayload {
  code: string;
  details?: unknown;
  message: string;
}

export interface RpcFailureResponse {
  error: RpcErrorPayload;
  id: string;
  ok: false;
}

export interface RpcRequest {
  id: string;
  input: unknown;
  procedure: string;
}

export type RpcResponse = RpcFailureResponse | RpcSuccessResponse;

export interface RpcSuccessResponse {
  id: string;
  ok: true;
  result: unknown;
}

let rpcIdCounter = 0;

export function createRpcId(): string {
  if (globalThis.crypto !== undefined && "randomUUID" in globalThis.crypto) {
    return globalThis.crypto.randomUUID();
  }

  rpcIdCounter += 1;
  return `rpc_${Date.now().toString(36)}_${rpcIdCounter.toString(36)}`;
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
