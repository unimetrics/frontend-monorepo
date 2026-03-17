import type { ChartModel } from "../models/chart-model";
import type { ChartTheme } from "../theme/chart-theme";

export interface ChartAdapter<TOutput, TModel extends ChartModel = ChartModel> {
  build(input: ChartRenderInput<TModel>): TOutput;
}

export interface ChartRenderInput<TModel extends ChartModel = ChartModel> {
  readonly model: TModel;
  readonly theme: ChartTheme;
}
