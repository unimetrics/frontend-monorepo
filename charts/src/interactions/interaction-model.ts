export interface InteractionModel {
  readonly legendToggle: boolean;
  readonly pan: boolean;
  readonly syncGroup?: string;
  readonly tooltip: "hover" | "none" | "press";
  readonly zoom: boolean;
}
