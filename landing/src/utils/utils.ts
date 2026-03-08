import trimChars from "lodash/trim";
import { I18N } from "unimetrics:config";

const formatters = new Map<string, Intl.DateTimeFormat>();

const getFormatter = (locale: string): Intl.DateTimeFormat => {
  const formatter = formatters.get(locale);

  if (formatter) {
    return formatter;
  }

  const nextFormatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  });

  formatters.set(locale, nextFormatter);
  return nextFormatter;
};

export const getFormattedDate = (date: Date, locale = I18N?.language || "en"): string =>
  date ? getFormatter(locale).format(date) : "";

export const trim = (str = "", ch?: string) => {
  if (typeof ch !== "string") {
    return str;
  }

  return trimChars(str, ch);
};

// Function to format a number in thousands (K) or millions (M) format depending on its value
export const toUiAmount = (amount: number) => {
  if (!amount) return 0;

  let value: string;

  if (amount >= 1_000_000_000) {
    const formattedNumber = (amount / 1_000_000_000).toFixed(1);
    value =
      Number(formattedNumber) === Number.parseInt(formattedNumber)
        ? Number.parseInt(formattedNumber) + "B"
        : formattedNumber + "B";
  } else if (amount >= 1_000_000) {
    const formattedNumber = (amount / 1_000_000).toFixed(1);
    value =
      Number(formattedNumber) === Number.parseInt(formattedNumber)
        ? Number.parseInt(formattedNumber) + "M"
        : formattedNumber + "M";
  } else if (amount >= 1000) {
    const formattedNumber = (amount / 1000).toFixed(1);
    value =
      Number(formattedNumber) === Number.parseInt(formattedNumber)
        ? Number.parseInt(formattedNumber) + "K"
        : formattedNumber + "K";
  } else {
    value = Number(amount).toFixed(0);
  }

  return value;
};
