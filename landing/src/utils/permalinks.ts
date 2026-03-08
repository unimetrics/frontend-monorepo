import slugify from "limax";
import isPlainObject from "lodash/isPlainObject";
import mapValues from "lodash/mapValues";
import { APP_BLOG, SITE } from "unimetrics:config";

import { trim } from "~/utils/utils";

export const trimSlash = (s: string) => trim(trim(s, "/"));
const createPath = (...params: string[]) => {
  const paths = params
    .map(el => trimSlash(el))
    .filter(el => !!el)
    .join("/");
  return "/" + paths + (SITE.trailingSlash && paths ? "/" : "");
};

const BASE_PATHNAME = SITE.base || "/";

export const cleanSlug = (text = "") =>
  trimSlash(text)
    .split("/")
    .map(slug => slugify(slug))
    .join("/");

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || "tag";

export const POST_PERMALINK_PATTERN = trimSlash(
  APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`
);

/** */
export const getCanonical = (path = ""): string | URL => {
  const url = String(new URL(path, SITE.site));
  if (SITE.trailingSlash == false && path && url.endsWith("/")) {
    return url.slice(0, -1);
  } else if (SITE.trailingSlash == true && path && !url.endsWith("/")) {
    return url + "/";
  }
  return url;
};

/** */
export const getPermalink = (slug = "", type = "page"): string => {
  let permalink: string;
  const normalizedSlug = slug.trim().toLowerCase();

  if (
    normalizedSlug.startsWith("https://") ||
    normalizedSlug.startsWith("http://") ||
    normalizedSlug.startsWith("://") ||
    normalizedSlug.startsWith("#")
  ) {
    return slug;
  }

  switch (type) {
    case "asset": {
      permalink = getAsset(slug);
      break;
    }

    case "blog": {
      permalink = getBlogPermalink();
      break;
    }

    case "category": {
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;
    }

    case "home": {
      permalink = getHomePermalink();
      break;
    }

    case "post": {
      permalink = createPath(trimSlash(slug));
      break;
    }

    case "tag": {
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;
    }

    case "page":
    default: {
      permalink = createPath(slug);
      break;
    }
  }

  return definitivePermalink(permalink);
};

/** */
export const getHomePermalink = (): string => getPermalink("/");

/** */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/** */
export const getAsset = (path: string): string =>
  "/" +
  [BASE_PATHNAME, path]
    .map(el => trimSlash(el))
    .filter(el => !!el)
    .join("/");

/** */
const definitivePermalink = (permalink: string): string =>
  createPath(BASE_PATHNAME, permalink);

/** */
export const applyGetPermalinks = (menu: unknown = {}) => {
  if (Array.isArray(menu)) {
    return menu.map(item => applyGetPermalinks(item));
  }

  if (isPlainObject(menu)) {
    const dictionary = menu as Record<string, unknown>;
    return mapValues(dictionary, (value, key) => {
      if (key !== "href") {
        return applyGetPermalinks(value);
      }

      if (typeof value === "string") {
        return getPermalink(value);
      }

      if (!isPlainObject(value)) {
        return value;
      }

      const href = value as {
        type?: string;
        url?: string;
      };

      switch (href.type) {
        case "asset": {
          return href.url ? getAsset(href.url) : value;
        }
        case "blog": {
          return getBlogPermalink();
        }
        case "home": {
          return getHomePermalink();
        }
        default: {
          if (href.url) {
            return getPermalink(href.url, href.type);
          }
          return value;
        }
      }
    });
  }

  return menu;
};
