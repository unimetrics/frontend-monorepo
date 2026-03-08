import { z } from "zod";

import { createApiRouter, defineProcedure } from "../core/router.js";

export interface LpDeskContext {
  apiUrl: string;
  nodeVersion: string;
  token?: string;
}

const WalletInputSchema = z
  .object({
    wallet: z.string().min(1).optional(),
  })
  .default({});

const MetricsOutputSchema = z.object({
  backend: z.object({
    apiUrl: z.string().url().or(z.string().startsWith("http://")).or(z.string()),
    tokenConfigured: z.boolean(),
  }),
  command: z.literal("metrics"),
  fees24hUsd: z.number(),
  pnl7dUsd: z.number(),
  tvlUsd: z.number(),
  wallet: z.string(),
});

const PositionsInputSchema = z
  .object({
    chain: z.string().default("ethereum"),
    wallet: z.string().optional(),
  })
  .default({});

const PositionsOutputSchema = z.array(
  z.object({
    chain: z.string(),
    command: z.literal("positions"),
    liquidityUsd: z.number(),
    pool: z.string(),
    unclaimedFeesUsd: z.number(),
    wallet: z.string(),
  })
);

const ReportInputSchema = z
  .object({
    period: z.enum(["7d", "30d", "90d"]).default("30d"),
    wallet: z.string().optional(),
  })
  .default({});

const ReportOutputSchema = z.object({
  command: z.literal("report"),
  feesUsd: z.number(),
  netPnlUsd: z.number(),
  period: z.enum(["7d", "30d", "90d"]),
  roiPct: z.number(),
  wallet: z.string(),
});

const AlertsInputSchema = z
  .object({
    active: z.boolean().default(true),
    wallet: z.string().optional(),
  })
  .default({});

const AlertsOutputSchema = z.array(
  z.object({
    active: z.boolean(),
    command: z.literal("alerts"),
    severity: z.enum(["info", "warn", "error"]),
    title: z.string(),
    wallet: z.string(),
  })
);

const DoctorInputSchema = z.object({}).default({});

const DoctorOutputSchema = z.array(
  z.object({
    check: z.enum(["api_url", "api_token", "node_version"]),
    details: z.string(),
    status: z.enum(["ok", "warn"]),
  })
);

export function createLpDeskContext(input: {
  apiUrl?: string;
  nodeVersion?: string;
  token?: string;
}): LpDeskContext {
  return {
    apiUrl: input.apiUrl ?? "http://localhost:8080",
    nodeVersion: input.nodeVersion ?? "unknown",
    token: input.token,
  };
}

const createLpDeskProcedure = defineProcedure<LpDeskContext>();
const lpDeskProcedures = {
  alerts: createLpDeskProcedure({
    description: "Show active alerts",
    input: AlertsInputSchema,
    output: AlertsOutputSchema,
    resolve: ({ input }) => {
      return [
        {
          active: input.active,
          command: "alerts" as const,
          severity: "info" as const,
          title: "No active alerts configured",
          wallet: input.wallet ?? "default",
        },
      ];
    },
  }),
  doctor: createLpDeskProcedure({
    description: "Check CLI and backend configuration",
    input: DoctorInputSchema,
    output: DoctorOutputSchema,
    resolve: ({ ctx }) => {
      const nodeStatus: "ok" | "warn" = ctx.nodeVersion.startsWith("24.") ? "ok" : "warn";
      const apiUrlStatus: "ok" | "warn" = ctx.apiUrl ? "ok" : "warn";
      const tokenStatus: "ok" | "warn" = ctx.token ? "ok" : "warn";

      return [
        {
          check: "node_version" as const,
          details: `Detected Node.js ${ctx.nodeVersion}`,
          status: nodeStatus,
        },
        {
          check: "api_url" as const,
          details: ctx.apiUrl,
          status: apiUrlStatus,
        },
        {
          check: "api_token" as const,
          details: ctx.token ? "configured" : "missing",
          status: tokenStatus,
        },
      ];
    },
  }),
  metrics: createLpDeskProcedure({
    description: "Show portfolio metrics",
    input: WalletInputSchema,
    output: MetricsOutputSchema,
    resolve: ({ ctx, input }) => {
      return {
        backend: {
          apiUrl: ctx.apiUrl,
          tokenConfigured: Boolean(ctx.token),
        },
        command: "metrics" as const,
        fees24hUsd: 0,
        pnl7dUsd: 0,
        tvlUsd: 0,
        wallet: input.wallet ?? "default",
      };
    },
  }),
  positions: createLpDeskProcedure({
    description: "List LP positions",
    input: PositionsInputSchema,
    output: PositionsOutputSchema,
    resolve: ({ input }) => {
      return [
        {
          chain: input.chain,
          command: "positions" as const,
          liquidityUsd: 0,
          pool: "TODO",
          unclaimedFeesUsd: 0,
          wallet: input.wallet ?? "default",
        },
      ];
    },
  }),
  report: createLpDeskProcedure({
    description: "Generate a performance report",
    input: ReportInputSchema,
    output: ReportOutputSchema,
    resolve: ({ input }) => {
      return {
        command: "report" as const,
        feesUsd: 0,
        netPnlUsd: 0,
        period: input.period,
        roiPct: 0,
        wallet: input.wallet ?? "default",
      };
    },
  }),
};

export const lpDeskRouter = createApiRouter<LpDeskContext, typeof lpDeskProcedures>(
  lpDeskProcedures
);
