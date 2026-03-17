import type { InteractionModel } from "../interactions/interaction-model";
import type { ValueFormat } from "./value-format";

export interface DistributionBucket {
  readonly from: number;
  readonly to: number;
  readonly value: number;
}

export interface DistributionChartModel {
  readonly buckets: readonly DistributionBucket[];
  readonly interaction?: InteractionModel;
  readonly kind: "distribution";
  readonly title?: string;
  readonly xFormat: ValueFormat;
  readonly yFormat: ValueFormat;
}
