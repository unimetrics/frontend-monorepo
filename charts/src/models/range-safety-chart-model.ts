import type { InteractionModel } from "../interactions/interaction-model";

export interface PriceMarker {
  readonly id: string;
  readonly label: string;
  readonly value: number;
}

export interface RangeBand {
  readonly from: number;
  readonly id: string;
  readonly label: string;
  readonly severity?: "risk" | "safe" | "watch";
  readonly to: number;
}

export interface RangeSafetyChartModel {
  readonly bands: readonly RangeBand[];
  readonly currentPrice: number;
  readonly history?: readonly RangeSafetyHistoryPoint[];
  readonly interaction?: InteractionModel;
  readonly kind: "range-safety";
  readonly markers?: readonly PriceMarker[];
  readonly stats?: RangeSafetyStats;
  readonly title?: string;
}

export interface RangeSafetyHistoryPoint {
  readonly x: number;
  readonly y: number;
}

export interface RangeSafetyStats {
  readonly breachProbability?: number;
  readonly expectedDaysInRange?: number;
  readonly historicalRebalances?: number;
}
