const DENSITY = " .'`^,:;Il!i~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpkhao*#MW&8%B@$";
const PALETTE = [
  238,
  240,
  242,
  244,
  246,
  248,
  250,
  252,
  254,
  255,
] as const;

export function colorizeBanner(input: string): string {
  let output = "";

  for (const char of input) {
    if (char === "\n") {
      output += "\n";
      continue;
    }

    if (char === " ") {
      output += " ";
      continue;
    }

    const densityIndex = Math.max(DENSITY.indexOf(char), 0);
    const ratio = densityIndex / (DENSITY.length - 1);
    const paletteIndex = Math.min(PALETTE.length - 1, Math.floor(ratio * PALETTE.length));
    const color = PALETTE[paletteIndex];

    output += `\u001B[38;5;${color}m${char}\u001B[0m`;
  }

  return output;
}
