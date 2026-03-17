import type { ComparisonChartModel } from "./comparison-chart-model";
import type { DistributionChartModel } from "./distribution-chart-model";
import type { RangeSafetyChartModel } from "./range-safety-chart-model";
import type { TimeSeriesChartModel } from "./time-series-chart-model";

export type ChartModel =
  | ComparisonChartModel
  | DistributionChartModel
  | RangeSafetyChartModel
  | TimeSeriesChartModel;
