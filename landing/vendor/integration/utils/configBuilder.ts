import merge from "lodash.merge";

import type { MetaData } from "~/types";

export interface AnalyticsConfig {
  vendors: {
    googleAnalytics: {
      id?: string;
      partytown?: boolean;
    };
  };
}

export interface AppBlogConfig {
  category: {
    isEnabled: boolean;
    pathname: string;
    robots: {
      follow: boolean;
      index: boolean;
    };
  };
  isEnabled: boolean;
  isRelatedPostsEnabled: boolean;
  list: {
    isEnabled: boolean;
    pathname: string;
    robots: {
      follow: boolean;
      index: boolean;
    };
  };
  post: {
    isEnabled: boolean;
    permalink: string;
    robots: {
      follow: boolean;
      index: boolean;
    };
  };
  postsPerPage: number;
  relatedPostsCount: number;
  tag: {
    isEnabled: boolean;
    pathname: string;
    robots: {
      follow: boolean;
      index: boolean;
    };
  };
}
export type Config = {
  analytics?: unknown;
  apps?: {
    blog?: AppBlogConfig;
  };
  i18n?: I18NConfig;
  metadata?: MetaDataConfig;
  site?: SiteConfig;
  ui?: unknown;
};
export interface I18NConfig {
  dateFormatter?: Intl.DateTimeFormat;
  language: string;
  textDirection: string;
}
export interface MetaDataConfig extends Omit<MetaData, "title"> {
  title?: {
    default: string;
    template: string;
  };
}
export interface SiteConfig {
  base?: string;
  googleSiteVerificationId?: string;
  name: string;
  site?: string;
  trailingSlash?: boolean;
}

export interface UIConfig {
  theme: string;
}

const DEFAULT_SITE_NAME = "Website";

const getSite = (config: Config) => {
  const _default = {
    base: "/",
    googleSiteVerificationId: "",
    name: DEFAULT_SITE_NAME,
    site: undefined,

    trailingSlash: false,
  };

  return merge({}, _default, config?.site ?? {}) as SiteConfig;
};

const getMetadata = (config: Config) => {
  const siteConfig = getSite(config);

  const _default = {
    description: "",
    openGraph: {
      type: "website",
    },
    robots: {
      follow: false,
      index: false,
    },
    title: {
      default: siteConfig?.name || DEFAULT_SITE_NAME,
      template: "%s",
    },
  };

  return merge({}, _default, config?.metadata ?? {}) as MetaDataConfig;
};

const getI18N = (config: Config) => {
  const _default = {
    language: "en",
    textDirection: "ltr",
  };

  const value = merge({}, _default, config?.i18n ?? {});

  return value as I18NConfig;
};

const getAppBlog = (config: Config) => {
  const _default = {
    category: {
      isEnabled: true,
      pathname: "category",
      robots: {
        follow: true,
        index: true,
      },
    },
    isEnabled: false,
    isRelatedPostsEnabled: false,
    list: {
      isEnabled: true,
      pathname: "blog",
      robots: {
        follow: true,
        index: true,
      },
    },
    post: {
      isEnabled: true,
      permalink: "/blog/%slug%",
      robots: {
        follow: true,
        index: true,
      },
    },
    postsPerPage: 6,
    relatedPostsCount: 4,
    tag: {
      isEnabled: true,
      pathname: "tag",
      robots: {
        follow: true,
        index: false,
      },
    },
  };

  return merge({}, _default, config?.apps?.blog ?? {}) as AppBlogConfig;
};

const getUI = (config: Config) => {
  const _default = {
    theme: "system",
  };

  return merge({}, _default, config?.ui ?? {});
};

const getAnalytics = (config: Config) => {
  const _default = {
    vendors: {
      googleAnalytics: {
        id: undefined,
        partytown: true,
      },
    },
  };

  return merge({}, _default, config?.analytics ?? {}) as AnalyticsConfig;
};

const buildConfig = (config: Config) => ({
  ANALYTICS: getAnalytics(config),
  APP_BLOG: getAppBlog(config),
  I18N: getI18N(config),
  METADATA: getMetadata(config),
  SITE: getSite(config),
  UI: getUI(config),
});

export default buildConfig;
