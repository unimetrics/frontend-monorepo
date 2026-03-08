export const locales = [
  "en",
  "ru",
  "de",
  "ar",
  "tr",
  "es",
  "fr",
  "id",
  "pt",
  "zh-CN",
  "zh-TW",
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = "en";

const localeSet = new Set<Locale>(locales);
const rtlLocaleSet = new Set<Locale>(["ar"]);

export const isLocale = (value: string): value is Locale => {
  return localeSet.has(value as Locale);
};

export const isRtlLocale = (locale: string): boolean => {
  return rtlLocaleSet.has(locale as Locale);
};

export const getLocaleDirection = (locale: string): "ltr" | "rtl" => {
  return isRtlLocale(locale) ? "rtl" : "ltr";
};
