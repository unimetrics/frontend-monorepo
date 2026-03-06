import { z } from "zod";

import type {
  ApiCaller,
  ApiRouter,
  ProcedureDefinition,
  ProcedureDictionary,
} from "./types.js";

import { ApiProcedureNotFoundError } from "./errors.js";
import { type RpcRequest, type RpcResponse, toRpcFailure, toRpcSuccess } from "./rpc.js";

type ProcedureBuilder<Ctx> = <
  InputSchema extends z.ZodTypeAny,
  OutputSchema extends z.ZodTypeAny,
>(
  procedure: ProcedureDefinition<Ctx, InputSchema, OutputSchema>
) => ProcedureDefinition<Ctx, InputSchema, OutputSchema>;

type RouterBuilder<Ctx> = <Procedures extends ProcedureDictionary<Ctx>>(
  procedures: Procedures
) => ApiRouter<Ctx, Procedures>;

export function createApiRouter<Ctx>(): RouterBuilder<Ctx>;
export function createApiRouter<Ctx, Procedures extends ProcedureDictionary<Ctx>>(
  procedures: Procedures
): ApiRouter<Ctx, Procedures>;
export function createApiRouter<Ctx, Procedures extends ProcedureDictionary<Ctx>>(
  procedures?: Procedures
): ApiRouter<Ctx, Procedures> | RouterBuilder<Ctx> {
  if (procedures === undefined) {
    return <TypedProcedures extends ProcedureDictionary<Ctx>>(
      typedProcedures: TypedProcedures
    ): ApiRouter<Ctx, TypedProcedures> => {
      return {
        procedures: typedProcedures,
      };
    };
  }

  return {
    procedures,
  };
}

export function createCaller<Ctx, Procedures extends ProcedureDictionary<Ctx>>(args: {
  getContext: () => Ctx | Promise<Ctx>;
  router: ApiRouter<Ctx, Procedures>;
}): ApiCaller<Procedures> {
  return new Proxy({} as ApiCaller<Procedures>, {
    get: (_target, property) => {
      if (typeof property !== "string") {
        return;
      }

      return async (input: unknown) => {
        const ctx = await args.getContext();

        return executeProcedure({
          ctx,
          input,
          name: property,
          router: args.router,
        });
      };
    },
  });
}
export function defineProcedure<Ctx>(): ProcedureBuilder<Ctx>;
export function defineProcedure<
  Ctx,
  InputSchema extends z.ZodTypeAny,
  OutputSchema extends z.ZodTypeAny,
>(
  procedure: ProcedureDefinition<Ctx, InputSchema, OutputSchema>
): ProcedureDefinition<Ctx, InputSchema, OutputSchema>;
export function defineProcedure<
  Ctx,
  InputSchema extends z.ZodTypeAny,
  OutputSchema extends z.ZodTypeAny,
>(
  procedure?: ProcedureDefinition<Ctx, InputSchema, OutputSchema>
): ProcedureBuilder<Ctx> | ProcedureDefinition<Ctx, InputSchema, OutputSchema> {
  if (procedure === undefined) {
    return ((typedProcedure: ProcedureDefinition<Ctx, z.ZodTypeAny, z.ZodTypeAny>) =>
      typedProcedure) as ProcedureBuilder<Ctx>;
  }

  return procedure;
}

export async function executeProcedure<
  Ctx,
  Procedures extends ProcedureDictionary<Ctx>,
  Name extends keyof Procedures,
>(args: {
  ctx: Ctx;
  input: unknown;
  name: Name;
  router: ApiRouter<Ctx, Procedures>;
}): Promise<z.output<Procedures[Name]["output"]>> {
  const procedure = args.router.procedures[args.name];

  if (!procedure) {
    throw new ApiProcedureNotFoundError(String(args.name));
  }

  const parsedInput = await procedure.input.parseAsync(args.input ?? {});
  const result = await procedure.resolve({
    ctx: args.ctx,
    input: parsedInput,
  });

  return procedure.output.parseAsync(result) as Promise<
    z.output<Procedures[Name]["output"]>
  >;
}

export async function handleRpcRequest<
  Ctx,
  Procedures extends ProcedureDictionary<Ctx>,
>(args: {
  getContext: () => Ctx | Promise<Ctx>;
  request: RpcRequest;
  router: ApiRouter<Ctx, Procedures>;
}): Promise<RpcResponse> {
  try {
    const ctx = await args.getContext();
    const result = await executeProcedure({
      ctx,
      input: args.request.input,
      name: args.request.procedure,
      router: args.router,
    });

    return toRpcSuccess(args.request.id, result);
  } catch (error) {
    return toRpcFailure(args.request.id, error);
  }
}
