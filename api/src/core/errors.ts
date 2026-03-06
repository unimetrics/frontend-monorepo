export type ApiErrorCode =
  | "BAD_REQUEST"
  | "INTERNAL_ERROR"
  | "METHOD_NOT_ALLOWED"
  | "NOT_FOUND"
  | "TRANSPORT_ERROR"
  | "VALIDATION_ERROR";

export class ApiError extends Error {
  code: ApiErrorCode;
  details: unknown;
  status: number;

  constructor(args: {
    code: ApiErrorCode;
    details?: unknown;
    message: string;
    status: number;
  }) {
    super(args.message);
    this.code = args.code;
    this.details = args.details;
    this.name = "ApiError";
    this.status = args.status;
  }
}

export class ApiMethodNotAllowedError extends ApiError {
  constructor(method: string) {
    super({
      code: "METHOD_NOT_ALLOWED",
      details: { method },
      message: `Method not allowed: ${method}`,
      status: 405,
    });
  }
}

export class ApiProcedureNotFoundError extends ApiError {
  constructor(procedureName: string) {
    super({
      code: "NOT_FOUND",
      details: { procedureName },
      message: `Procedure not found: ${procedureName}`,
      status: 404,
    });
  }
}

export class ApiTransportError extends ApiError {
  constructor(message: string, details?: unknown) {
    super({
      code: "TRANSPORT_ERROR",
      details,
      message,
      status: 502,
    });
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError({
      code: "INTERNAL_ERROR",
      details: {
        name: error.name,
      },
      message: error.message,
      status: 500,
    });
  }

  return new ApiError({
    code: "INTERNAL_ERROR",
    details: error,
    message: "Unknown API error",
    status: 500,
  });
}
