import type { InteractionModel } from "../interactions/interaction-model";
import type { AxisModel } from "./axis-model";
import type { ChartPoint } from "./chart-point";

export interface ThresholdLine {
  readonly id: string;
  readonly label: string;
  readonly severity?: "critical" | "info" | "warning";
  readonly value: number;
  readonly yAxisId: string;
}

export type TimeRangePreset = "1Y" | "7D" | "30D" | "90D" | "ALL";

export interface TimeSeriesChartModel {
  readonly axes: readonly AxisModel[];
  readonly compareMode?: "absolute" | "normalized";
  readonly interaction?: InteractionModel;
  readonly kind: "time-series";
  readonly rangePresets?: readonly TimeRangePreset[];
  readonly series: readonly TimeSeriesSeriesModel[];
  readonly subtitle?: string;
  readonly thresholds?: readonly ThresholdLine[];
  readonly title?: string;
}

export type TimeSeriesRenderType =
  | "area"
  | "band"
  | "bar"
  | "line"
  | "marker"
  | "scatter";

export interface TimeSeriesSeriesModel {
  readonly colorToken?: string;
  readonly hidden?: boolean;
  readonly id: string;
  readonly name: string;
  readonly points: readonly ChartPoint[];
  readonly smooth?: boolean;
  readonly stack?: string;
  readonly type: TimeSeriesRenderType;
  readonly yAxisId?: string;
}
