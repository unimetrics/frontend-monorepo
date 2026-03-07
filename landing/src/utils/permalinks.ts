import slugify from "limax";
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
export const applyGetPermalinks = (menu: object = {}) => {
  if (Array.isArray(menu)) {
    return menu.map(item => applyGetPermalinks(item));
  } else if (typeof menu === "object" && menu !== null) {
    const obj = {};
    for (const key in menu) {
      if (key === "href") {
        if (typeof menu[key] === "string") {
          obj[key] = getPermalink(menu[key]);
        } else if (typeof menu[key] === "object") {
          switch (menu[key].type) {
            case "asset": {
              obj[key] = getAsset(menu[key].url);

              break;
            }
            case "blog": {
              obj[key] = getBlogPermalink();

              break;
            }
            case "home": {
              obj[key] = getHomePermalink();

              break;
            }
            default: {
              if (menu[key].url) {
                obj[key] = getPermalink(menu[key].url, menu[key].type);
              }
            }
          }
        }
      } else {
        obj[key] = applyGetPermalinks(menu[key]);
      }
    }
    return obj;
  }
  return menu;
};
