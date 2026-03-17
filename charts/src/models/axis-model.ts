import type { ValueFormat } from "./value-format";

export interface AxisModel {
  readonly format: ValueFormat;
  readonly id: string;
  readonly max?: "auto" | number;
  readonly min?: "auto" | number;
  readonly position: "left" | "right";
}
