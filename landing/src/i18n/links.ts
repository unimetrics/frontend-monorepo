import { getRelativeLocaleUrl } from "astro:i18n";

import { defaultLocale, isLocale, type Locale, locales } from "~/i18n/routing";

const INTERNAL_ORIGIN = "https://unimetrics.local";
const HAS_FILE_EXTENSION = /\.[a-z0-9]+$/i;
const HAS_PROTOCOL = /^[a-z][a-z0-9+.-]*:/i;

const normalizeNoTrailingSlash = (value: string): string => {
  if (value === "/") {
    return value;
  }

  let normalized = value;

  while (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized || "/";
};

const trimSlashes = (value: string): string => {
  let start = 0;
  let end = value.length;

  while (start < end && value[start] === "/") {
    start += 1;
  }

  while (end > start && value[end - 1] === "/") {
    end -= 1;
  }

  return value.slice(start, end);
};

const getPathWithoutLocale = (pathname: string): string => {
  const normalizedPath = trimSlashes(pathname);

  if (!normalizedPath) {
    return "";
  }

  const [firstSegment, ...rest] = normalizedPath.split("/");

  if (isLocale(firstSegment)) {
    return rest.join("/");
  }

  return normalizedPath;
};

const localizePathname = (locale: string, pathname: string): string => {
  return normalizeNoTrailingSlash(
    getRelativeLocaleUrl(locale, getPathWithoutLocale(pathname))
  );
};

export const localizeHref = (locale: string, href: string): string => {
  if (!href || href.startsWith("#") || HAS_PROTOCOL.test(href) || href.startsWith("//")) {
    return href;
  }

  const url = new URL(href, INTERNAL_ORIGIN);
  const hasExtension = HAS_FILE_EXTENSION.test(url.pathname.split("/").pop() ?? "");

  if (hasExtension) {
    return href;
  }

  const localizedPathname = localizePathname(locale, url.pathname);
  return `${localizedPathname}${url.search}${url.hash}`;
};

export interface LocaleSwitchLink {
  href: string;
  isCurrent: boolean;
  label: string;
  locale: Locale;
}

export const getLocaleSwitchLinks = (
  currentLocale: string,
  pathname: string
): LocaleSwitchLink[] => {
  const normalizedLocale = isLocale(currentLocale) ? currentLocale : defaultLocale;
  const routePath = getPathWithoutLocale(pathname);

  return locales.map(locale => ({
    href: normalizeNoTrailingSlash(getRelativeLocaleUrl(locale, routePath)),
    isCurrent: locale === normalizedLocale,
    label: locale.toUpperCase(),
    locale,
  }));
};
