import { Command } from "commander";

import { colorizeBanner } from "./ansi.js";
import { BANNER } from "./banner.js";

type SharedOptions = {
  apiUrl?: string;
  json?: boolean;
  token?: string;
  wallet?: string;
};

type PositionsOptions = SharedOptions & {
  chain: string;
};

type ReportOptions = SharedOptions & {
  format: "json" | "table";
  period: string;
};

type AlertsOptions = SharedOptions & {
  active: boolean;
};

type DoctorOptions = {
  apiUrl?: string;
  json?: boolean;
  token?: string;
};

function boolFromArgv(flag: string): boolean {
  return process.argv.includes(flag);
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

function buildBackendContext(options: SharedOptions | DoctorOptions) {
  return {
    apiUrl: options.apiUrl ?? process.env.LPDESK_API_URL ?? "http://localhost:8080",
    tokenConfigured: Boolean(options.token ?? process.env.LPDESK_API_TOKEN),
    wallet: "wallet" in options ? (options.wallet ?? null) : null,
  };
}

function printResult(data: unknown[] | Record<string, unknown>, asJson = false): void {
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

function addSharedOptions(command: Command): Command {
  return command
    .option("--wallet <address>", "Wallet address")
    .option("--api-url <url>", "Backend API base URL")
    .option("--token <token>", "Backend auth token")
    .option("--json", "Print JSON output");
}

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
    const backend = buildBackendContext(options);

    printResult(
      {
        backend: {
          apiUrl: backend.apiUrl,
          tokenConfigured: backend.tokenConfigured,
        },
        command: "metrics",
        fees24hUsd: 0,
        pnl7dUsd: 0,
        tvlUsd: 0,
        wallet: backend.wallet ?? "default",
      },
      options.json
    );
  });

  addSharedOptions(program.command("positions").description("List LP positions"))
    .option("--chain <chain>", "Chain name", "ethereum")
    .action(async (options: PositionsOptions) => {
      const backend = buildBackendContext(options);

      printResult(
        [
          {
            chain: options.chain,
            command: "positions",
            liquidityUsd: 0,
            pool: "TODO",
            unclaimedFeesUsd: 0,
            wallet: backend.wallet ?? "default",
          },
        ],
        options.json
      );
    });

  addSharedOptions(program.command("report").description("Generate a performance report"))
    .option("--period <period>", "Period: 7d|30d|90d", "30d")
    .option("--format <format>", "Output: table|json", "table")
    .action(async (options: ReportOptions) => {
      const backend = buildBackendContext(options);
      const report = {
        command: "report",
        feesUsd: 0,
        netPnlUsd: 0,
        period: options.period,
        roiPct: 0,
        wallet: backend.wallet ?? "default",
      };

      const asJson = options.format === "json" || options.json;
      printResult(report, asJson);
    });

  addSharedOptions(program.command("alerts").description("Show active alerts"))
    .option("--active", "Only active alerts", true)
    .action(async (options: AlertsOptions) => {
      const backend = buildBackendContext(options);

      printResult(
        [
          {
            active: Boolean(options.active),
            command: "alerts",
            severity: "info",
            title: "No active alerts configured",
            wallet: backend.wallet ?? "default",
          },
        ],
        options.json
      );
    });

  program
    .command("doctor")
    .description("Check CLI and backend configuration")
    .option("--api-url <url>", "Backend API base URL")
    .option("--token <token>", "Backend auth token")
    .option("--json", "Print JSON output")
    .action(async (options: DoctorOptions) => {
      const backend = buildBackendContext(options);

      const result = [
        {
          check: "node_version",
          details: `Detected Node.js ${process.versions.node}`,
          status: process.versions.node.startsWith("24.") ? "ok" : "warn",
        },
        {
          check: "api_url",
          details: backend.apiUrl,
          status: backend.apiUrl ? "ok" : "warn",
        },
        {
          check: "api_token",
          details: backend.tokenConfigured ? "configured" : "missing",
          status: backend.tokenConfigured ? "ok" : "warn",
        },
      ];

      printResult(result, options.json);
    });

  await program.parseAsync(process.argv);

  if (process.argv.length <= 2) {
    program.outputHelp();
  }
}
