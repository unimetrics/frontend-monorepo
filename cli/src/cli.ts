import { createCaller, createLpDeskContext, lpDeskRouter } from "@unimetrics/api";
import { Command } from "commander";

import { colorizeBanner } from "./ansi.js";
import { BANNER } from "./banner.js";

type AlertsOptions = SharedOptions & {
  active?: boolean;
};

type DoctorOptions = {
  apiUrl?: string;
  json?: boolean;
  token?: string;
};

type PositionsOptions = SharedOptions & {
  chain?: string;
};

type ReportOptions = SharedOptions & {
  format?: "json" | "table";
  period?: "7d" | "30d" | "90d";
};

type SharedOptions = {
  apiUrl?: string;
  json?: boolean;
  token?: string;
  wallet?: string;
};

export async function runCli(): Promise<void> {
  printBanner();

  const program = new Command();

  program
    .name("lpdesk")
    .description("Private account for Uniswap LPs (metrics, reports, alerts)")
    .version("0.1.0")
    .showHelpAfterError()
    .option("--no-banner", "Disable startup banner")
    .option("--plain", "Disable ANSI banner colors");

  addSharedOptions(
    program.command("metrics").description("Show portfolio metrics")
  ).action(async (options: SharedOptions) => {
    const caller = createLpDeskCaller(options);
    const result = await caller.metrics({
      wallet: options.wallet,
    });

    printResult(result, options.json);
  });

  addSharedOptions(program.command("positions").description("List LP positions"))
    .option("--chain <chain>", "Chain name", "ethereum")
    .action(async (options: PositionsOptions) => {
      const caller = createLpDeskCaller(options);
      const result = await caller.positions({
        chain: options.chain,
        wallet: options.wallet,
      });

      printResult(result, options.json);
    });

  addSharedOptions(program.command("report").description("Generate a performance report"))
    .option("--period <period>", "Period: 7d|30d|90d", "30d")
    .option("--format <format>", "Output: table|json", "table")
    .action(async (options: ReportOptions) => {
      const caller = createLpDeskCaller(options);
      const result = await caller.report({
        period: options.period,
        wallet: options.wallet,
      });

      const asJson = options.format === "json" || options.json;
      printResult(result, asJson);
    });

  addSharedOptions(program.command("alerts").description("Show active alerts"))
    .option("--active", "Only active alerts")
    .action(async (options: AlertsOptions) => {
      const caller = createLpDeskCaller(options);
      const result = await caller.alerts({
        active: options.active ?? true,
        wallet: options.wallet,
      });

      printResult(result, options.json);
    });

  program
    .command("doctor")
    .description("Check CLI and backend configuration")
    .option("--api-url <url>", "Backend API base URL")
    .option("--token <token>", "Backend auth token")
    .option("--json", "Print JSON output")
    .action(async (options: DoctorOptions) => {
      const caller = createLpDeskCaller(options);
      const result = await caller.doctor({});

      printResult(result, options.json);
    });

  await program.parseAsync(process.argv);

  if (process.argv.length <= 2) {
    program.outputHelp();
  }
}

function addSharedOptions(command: Command): Command {
  return command
    .option("--wallet <address>", "Wallet address")
    .option("--api-url <url>", "Backend API base URL")
    .option("--token <token>", "Backend auth token")
    .option("--json", "Print JSON output");
}

function boolFromArgv(flag: string): boolean {
  return process.argv.includes(flag);
}

function createLpDeskCaller(options: DoctorOptions | SharedOptions) {
  const context = createLpDeskContext({
    apiUrl: options.apiUrl ?? process.env.LPDESK_API_URL,
    nodeVersion: process.versions.node,
    token: options.token ?? process.env.LPDESK_API_TOKEN,
  });

  return createCaller({
    getContext: () => context,
    router: lpDeskRouter,
  });
}

function printBanner(): void {
  const showBanner = !boolFromArgv("--no-banner");
  const plain = boolFromArgv("--plain");

  if (!showBanner) {
    return;
  }

  console.log(plain ? BANNER : colorizeBanner(BANNER));
  console.log("\nLP Desk CLI — type --help\n");
}

function printResult(data: Record<string, unknown> | unknown[], asJson = false): void {
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  if (Array.isArray(data)) {
    console.table(data);
    return;
  }

  console.table([data]);
}
