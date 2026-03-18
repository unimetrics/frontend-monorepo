import type { ValueFormat } from "../models/value-format";

export interface DateFormatterOptions extends LocaleFormatterOptions {
  readonly dateStyle?: "full" | "long" | "medium" | "short";
  readonly timeStyle?: "full" | "long" | "medium" | "short";
}

export interface LocaleFormatterOptions {
  readonly locale?: string;
}

export interface NumberFormatterOptions extends LocaleFormatterOptions {
  readonly maximumFractionDigits?: number;
  readonly minimumFractionDigits?: number;
}

export interface TokenAtomicFormatterOptions {
  readonly decimals?: number;
  readonly groupSeparator?: string;
  readonly maxFractionDigits?: number;
  readonly symbol?: string;
  readonly trimTrailingZeros?: boolean;
}

const normalizeFractionDigits = (
  minimumFractionDigits: number | undefined,
  maximumFractionDigits: number | undefined
): {
  maximumFractionDigits: number;
  minimumFractionDigits: number;
} => {
  const normalizedMin = Math.max(0, minimumFractionDigits ?? 0);
  const normalizedMax = Math.max(normalizedMin, maximumFractionDigits ?? normalizedMin);

  return {
    maximumFractionDigits: normalizedMax,
    minimumFractionDigits: normalizedMin,
  };
};

const createNumberFormatter = (
  locale: string | undefined,
  options: {
    maximumFractionDigits: number;
    minimumFractionDigits: number;
  }
): Intl.NumberFormat => {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: options.maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits,
  });
};

export const formatNumber = (
  value: number,
  options: NumberFormatterOptions = {}
): string => {
  const fractionDigits = normalizeFractionDigits(
    options.minimumFractionDigits,
    options.maximumFractionDigits
  );

  return createNumberFormatter(options.locale, fractionDigits).format(value);
};

export const formatPercent = (
  value: number,
  options: NumberFormatterOptions = {}
): string => {
  const formatted = formatNumber(value * 100, {
    ...options,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
  });

  return `${formatted}%`;
};

export const formatUsd = (
  value: number,
  options: NumberFormatterOptions = {}
): string => {
  const fractionDigits = normalizeFractionDigits(
    options.minimumFractionDigits,
    options.maximumFractionDigits
  );

  return new Intl.NumberFormat(options.locale, {
    currency: "USD",
    maximumFractionDigits: fractionDigits.maximumFractionDigits,
    minimumFractionDigits: fractionDigits.minimumFractionDigits,
    style: "currency",
  }).format(value);
};

export const formatGasUsd = (
  value: number,
  options: NumberFormatterOptions = {}
): string => {
  return formatUsd(value, {
    ...options,
    maximumFractionDigits: options.maximumFractionDigits ?? 4,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
  });
};

export const formatDateTick = (
  value: number,
  options: DateFormatterOptions = {}
): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  const dateStyle = options.dateStyle ?? "medium";
  const timeStyle = options.timeStyle;

  return new Intl.DateTimeFormat(options.locale, {
    dateStyle,
    timeStyle,
  }).format(date);
};

export const toDecimalStringFromAtomic = (amount: bigint, decimals = 18): string => {
  if (decimals < 0) {
    throw new RangeError(`decimals must be >= 0, received ${decimals.toString()}`);
  }

  const isNegative = amount < 0n;
  const absoluteAmount = isNegative ? -amount : amount;

  if (decimals === 0) {
    return `${isNegative ? "-" : ""}${absoluteAmount.toString()}`;
  }

  const padded = absoluteAmount.toString().padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals);
  const fraction = padded.slice(-decimals);

  return `${isNegative ? "-" : ""}${whole}.${fraction}`;
};

const groupIntegerPart = (value: string, separator = ","): string => {
  if (value.length <= 3) {
    return value;
  }

  const chunks: string[] = [];

  for (let index = value.length; index > 0; index -= 3) {
    const start = Math.max(index - 3, 0);
    chunks.unshift(value.slice(start, index));
  }

  return chunks.join(separator);
};

const trimTrailingZeros = (value: string): string => {
  let end = value.length;

  while (end > 0 && value.codePointAt(end - 1) === 48) {
    end -= 1;
  }

  return value.slice(0, end);
};

export const formatTokenAmountFromAtomic = (
  amount: bigint,
  options: TokenAtomicFormatterOptions = {}
): string => {
  const decimals = options.decimals ?? 18;
  const maxFractionDigits = Math.max(0, options.maxFractionDigits ?? 6);
  const decimalValue = toDecimalStringFromAtomic(amount, decimals);
  const isNegative = decimalValue.startsWith("-");
  const unsigned = isNegative ? decimalValue.slice(1) : decimalValue;
  const [rawWhole, rawFraction = ""] = unsigned.split(".");
  const wholePart = groupIntegerPart(rawWhole ?? "0", options.groupSeparator);

  let fractionPart = rawFraction.slice(0, maxFractionDigits);

  if (options.trimTrailingZeros ?? true) {
    fractionPart = trimTrailingZeros(fractionPart);
  }

  const sign = isNegative ? "-" : "";
  const value = fractionPart.length > 0 ? `${wholePart}.${fractionPart}` : wholePart;
  const withSymbol = options.symbol ? `${options.symbol} ${value}` : value;

  return `${sign}${withSymbol}`;
};

export const formatValue = (
  value: number,
  format: ValueFormat,
  options: DateFormatterOptions & NumberFormatterOptions = {}
): string => {
  switch (format) {
    case "date": {
      return formatDateTick(value, options);
    }

    case "gas": {
      return formatGasUsd(value, options);
    }

    case "number": {
      return formatNumber(value, options);
    }

    case "percent": {
      return formatPercent(value, options);
    }

    case "token": {
      return formatNumber(value, {
        ...options,
        maximumFractionDigits: options.maximumFractionDigits ?? 6,
      });
    }

    case "usd": {
      return formatUsd(value, options);
    }
  }
};
