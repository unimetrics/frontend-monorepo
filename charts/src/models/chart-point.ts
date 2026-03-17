export interface ChartPoint {
  readonly meta?: ChartPointMetadata;
  readonly x: number;
  readonly y: null | number;
}

export type ChartPointMetadata = Record<string, unknown>;
