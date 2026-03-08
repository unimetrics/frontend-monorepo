import { defaultLocale, isLocale, type Locale } from "~/i18n/routing";

export interface Messages {
  [key: string]: Messages | string;
}

type MessageNode = Messages | string;

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

export const t = (messages: Messages, key: string): string => {
  const directValue = messages[key];
  if (typeof directValue === "string") {
    return directValue;
  }

  const nestedValue = key.split(".").reduce<MessageNode | undefined>((node, segment) => {
    if (!isMessagesObject(node)) {
      return;
    }

    return node[segment];
  }, messages);

  return typeof nestedValue === "string" ? nestedValue : key;
};
