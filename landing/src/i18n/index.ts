import { SITE } from "unimetrics:config";

import { defaultLocale, isLocale, type Locale } from "~/i18n/routing";

export interface Messages {
  [key: string]: Messages | string;
}

type MessageNode = Messages | string;
type TranslationReplacements = Record<string, number | string>;

const dictionaries = import.meta.glob("./messages/*.json", {
  eager: true,
  import: "default",
}) as Record<string, Messages>;

const getDictionaryByLocale = (locale: Locale): Messages => {
  return dictionaries[`./messages/${locale}.json`];
};

export const getMessages = (locale: string): Messages => {
  if (isLocale(locale)) {
    return getDictionaryByLocale(locale);
  }

  return getDictionaryByLocale(defaultLocale);
};

const isMessagesObject = (value: MessageNode | undefined): value is Messages => {
  return typeof value === "object" && value !== null;
};

const interpolateMessage = (
  value: string,
  replacements: TranslationReplacements = {}
): string => {
  const runtimeReplacements: TranslationReplacements = {
    siteName: SITE?.name ?? "",
    ...replacements,
  };

  return value.replaceAll(/\{\{\s*(\w+)\s*\}\}/g, (match, replacementKey: string) => {
    const replacementValue = runtimeReplacements[replacementKey];
    return replacementValue === undefined ? match : String(replacementValue);
  });
};

export const t = (
  messages: Messages,
  key: string,
  replacements: TranslationReplacements = {}
): string => {
  const directValue = messages[key];
  if (typeof directValue === "string") {
    return interpolateMessage(directValue, replacements);
  }

  const nestedValue = key.split(".").reduce<MessageNode | undefined>((node, segment) => {
    if (!isMessagesObject(node)) {
      return;
    }

    return node[segment];
  }, messages);

  return typeof nestedValue === "string"
    ? interpolateMessage(nestedValue, replacements)
    : key;
};
