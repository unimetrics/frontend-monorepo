import type { InteractionModel } from "../interactions/interaction-model";
import type { ValueFormat } from "./value-format";

export interface ComparisonChartModel {
  readonly format: ValueFormat;
  readonly interaction?: InteractionModel;
  readonly items: readonly ComparisonItem[];
  readonly kind: "comparison";
  readonly layout: ComparisonLayout;
  readonly title?: string;
}

export interface ComparisonItem {
  readonly id: string;
  readonly label: string;
  readonly meta?: Record<string, unknown>;
  readonly secondaryValue?: number;
  readonly value: number;
}

export type ComparisonLayout = "bar" | "grouped-bar" | "ranked" | "waterfall";
