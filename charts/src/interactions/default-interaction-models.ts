import type { InteractionModel } from "./interaction-model";

export const mobileInteractionDefaults: InteractionModel = {
  legendToggle: true,
  pan: true,
  tooltip: "press",
  zoom: true,
};

export const webInteractionDefaults: InteractionModel = {
  legendToggle: true,
  pan: true,
  tooltip: "hover",
  zoom: true,
};
