import { I18N } from "unimetrics:config";

export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  year: "numeric",
});

export const getFormattedDate = (date: Date): string =>
  date ? formatter.format(date) : "";

export const trim = (str = "", ch?: string) => {
  let end = str.length || 0,
    start = 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.slice(start, end) : str;
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
