import type {
  TimeSeriesChartModel,
  TimeSeriesSeriesModel,
} from "../models/time-series-chart-model";

const sortPointsByTimestamp = (
  points: TimeSeriesSeriesModel["points"]
): TimeSeriesSeriesModel["points"] => {
  return [...points].sort((left, right) => left.x - right.x);
};

const deduplicatePointsByTimestamp = (
  points: TimeSeriesSeriesModel["points"]
): TimeSeriesSeriesModel["points"] => {
  const deduplicated: Array<TimeSeriesSeriesModel["points"][number]> = [];

  for (const point of points) {
    const previous = deduplicated.at(-1);

    if (previous && previous.x === point.x) {
      deduplicated[deduplicated.length - 1] = point;
      continue;
    }

    deduplicated.push(point);
  }

  return deduplicated;
};

export const normalizeTimeSeriesModel = (
  model: TimeSeriesChartModel
): TimeSeriesChartModel => {
  return {
    ...model,
    series: model.series.map(series => {
      const sortedPoints = sortPointsByTimestamp(series.points);
      const normalizedPoints = deduplicatePointsByTimestamp(sortedPoints);

      return {
        ...series,
        points: normalizedPoints,
      };
    }),
  };
};
