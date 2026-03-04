import type { z } from "zod";

export type ProcedureResolver<Ctx, Input, Output> = {
  bivarianceHack: (args: { ctx: Ctx; input: Input }) => Promise<Output> | Output;
}["bivarianceHack"];

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

export interface AnyProcedureDefinition<Ctx = unknown> {
  readonly description?: string;
  readonly input: z.ZodTypeAny;
  readonly output: z.ZodTypeAny;
  readonly resolve: ProcedureResolver<Ctx, any, any>;
}

export type ProcedureDictionary<Ctx = unknown> = Record<
  string,
  AnyProcedureDefinition<Ctx>
>;

export interface ApiRouter<Ctx, Procedures extends ProcedureDictionary<Ctx>> {
  procedures: Procedures;
}

export type InferProcedureInput<TProcedure extends AnyProcedureDefinition<any>> = z.input<
  TProcedure["input"]
>;

export type InferProcedureOutput<TProcedure extends AnyProcedureDefinition<any>> =
  z.output<TProcedure["output"]>;

export type ApiCaller<Procedures extends ProcedureDictionary<any>> = {
  [Name in keyof Procedures]: (
    input: InferProcedureInput<Procedures[Name]>
  ) => Promise<InferProcedureOutput<Procedures[Name]>>;
};

export type AnyApiRouter = ApiRouter<any, ProcedureDictionary<any>>;
