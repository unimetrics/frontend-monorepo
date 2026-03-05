import type { z } from "zod";

export type AnyApiRouter = ApiRouter<unknown, ProcedureDictionary<unknown>>;

export interface AnyProcedureDefinition<Ctx = unknown> {
  readonly description?: string;
  readonly input: z.ZodTypeAny;
  readonly output: z.ZodTypeAny;
  readonly resolve: ProcedureResolver<Ctx, unknown, unknown>;
}

export type ApiCaller<Procedures extends ProcedureDictionary<unknown>> = {
  [Name in keyof Procedures]: (
    input: InferProcedureInput<Procedures[Name]>
  ) => Promise<InferProcedureOutput<Procedures[Name]>>;
};

export interface ApiRouter<Ctx, Procedures extends ProcedureDictionary<Ctx>> {
  procedures: Procedures;
}

export type InferProcedureInput<TProcedure extends AnyProcedureDefinition<unknown>> =
  z.input<TProcedure["input"]>;

export type InferProcedureOutput<TProcedure extends AnyProcedureDefinition<unknown>> =
  z.output<TProcedure["output"]>;

export interface ProcedureDefinition<
  Ctx,
  InputSchema extends z.ZodTypeAny,
  OutputSchema extends z.ZodTypeAny,
> {
  readonly description?: string;
  readonly input: InputSchema;
  readonly output: OutputSchema;
  readonly resolve: ProcedureResolver<Ctx, z.output<InputSchema>, z.output<OutputSchema>>;
}

export type ProcedureDictionary<Ctx = unknown> = Record<
  string,
  AnyProcedureDefinition<Ctx>
>;

export type ProcedureResolver<Ctx, Input, Output> = {
  bivarianceHack: (args: { ctx: Ctx; input: Input }) => Output | Promise<Output>;
}["bivarianceHack"];
