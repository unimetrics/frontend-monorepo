import type { ChartModel } from "../models/chart-model";
import type { ComparisonChartModel } from "../models/comparison-chart-model";
import type { DistributionChartModel } from "../models/distribution-chart-model";
import type { RangeSafetyChartModel } from "../models/range-safety-chart-model";
import type { TimeSeriesChartModel } from "../models/time-series-chart-model";

export interface ChartValidationIssue {
  readonly message: string;
  readonly path: string;
}

const validateTimeSeriesChartModel = (
  model: TimeSeriesChartModel
): ChartValidationIssue[] => {
  const issues: ChartValidationIssue[] = [];

  if (model.series.length === 0) {
    issues.push({
      message: "At least one series is required.",
      path: "series",
    });
  }

  if (model.axes.length === 0) {
    issues.push({
      message: "At least one y-axis definition is required.",
      path: "axes",
    });
  }

  const axisIds = new Set<string>();

  for (const [index, axis] of model.axes.entries()) {
    if (axisIds.has(axis.id)) {
      issues.push({
        message: `Duplicate axis id \"${axis.id}\".`,
        path: `axes[${index.toString()}].id`,
      });
    }

    axisIds.add(axis.id);
  }

  for (const [index, series] of model.series.entries()) {
    if (series.points.length === 0) {
      issues.push({
        message: "Series must include at least one point.",
        path: `series[${index.toString()}].points`,
      });
    }

    if (series.yAxisId && !axisIds.has(series.yAxisId)) {
      issues.push({
        message: `Unknown axis id \"${series.yAxisId}\".`,
        path: `series[${index.toString()}].yAxisId`,
      });
    }
  }

  for (const [index, threshold] of model.thresholds?.entries() ?? []) {
    if (!axisIds.has(threshold.yAxisId)) {
      issues.push({
        message: `Unknown axis id \"${threshold.yAxisId}\".`,
        path: `thresholds[${index.toString()}].yAxisId`,
      });
    }
  }

  return issues;
};

const validateComparisonChartModel = (
  model: ComparisonChartModel
): ChartValidationIssue[] => {
  if (model.items.length > 0) {
    return [];
  }

  return [
    {
      message: "At least one comparison item is required.",
      path: "items",
    },
  ];
};

const validateRangeSafetyChartModel = (
  model: RangeSafetyChartModel
): ChartValidationIssue[] => {
  const issues: ChartValidationIssue[] = [];

  if (model.bands.length === 0) {
    issues.push({
      message: "At least one safety band is required.",
      path: "bands",
    });
  }

  for (const [index, band] of model.bands.entries()) {
    if (band.from > band.to) {
      issues.push({
        message: 'Band "from" must be less than or equal to "to".',
        path: `bands[${index.toString()}]`,
      });
    }
  }

  return issues;
};

const validateDistributionChartModel = (
  model: DistributionChartModel
): ChartValidationIssue[] => {
  if (model.buckets.length > 0) {
    return [];
  }

  return [
    {
      message: "At least one distribution bucket is required.",
      path: "buckets",
    },
  ];
};

export const validateChartModel = (model: ChartModel): ChartValidationIssue[] => {
  switch (model.kind) {
    case "comparison": {
      return validateComparisonChartModel(model);
    }

    case "distribution": {
      return validateDistributionChartModel(model);
    }

    case "range-safety": {
      return validateRangeSafetyChartModel(model);
    }

    case "time-series": {
      return validateTimeSeriesChartModel(model);
    }

    default: {
      return [];
    }
  }
};

export const assertValidChartModel = (model: ChartModel): void => {
  const issues = validateChartModel(model);

  if (issues.length === 0) {
    return;
  }

  const serializedIssues = issues
    .map(issue => `- ${issue.path}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid chart model:\n${serializedIssues}`);
};
