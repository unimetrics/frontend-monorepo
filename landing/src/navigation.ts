import { getMessages, t } from "~/i18n";
import { localizeHref } from "~/i18n/links";
import { defaultLocale } from "~/i18n/routing";
import { getAsset, getBlogPermalink, getPermalink } from "~/utils/permalinks";

const getTranslator = (locale: string) => {
  const messages = getMessages(locale);

  return (key: string) => t(messages, key);
};

const getLocalize = (locale: string) => (href: string) => localizeHref(locale, href);

export const getHeaderData = (locale: string = defaultLocale) => {
  const translate = getTranslator(locale);
  const localize = getLocalize(locale);

  return {
    actions: [
      {
        href: "https://github.com/unimetrics/frontend-monorepo",
        target: "_blank",
        text: translate("header.action.download"),
      },
    ],
    links: [
      {
        links: [
          {
            href: localize(getPermalink("/homes/saas")),
            text: translate("nav.link.saas"),
          },
          {
            href: localize(getPermalink("/homes/startup")),
            text: translate("nav.link.startup"),
          },
          {
            href: localize(getPermalink("/homes/mobile-app")),
            text: translate("nav.link.mobileApp"),
          },
          {
            href: localize(getPermalink("/homes/personal")),
            text: translate("nav.link.personal"),
          },
        ],
        text: translate("nav.group.homes"),
      },
      {
        links: [
          {
            href: localize(getPermalink("/#features")),
            text: translate("nav.link.featuresAnchor"),
          },
          {
            href: localize(getPermalink("/services")),
            text: translate("nav.link.services"),
          },
          {
            href: localize(getPermalink("/pricing")),
            text: translate("nav.link.pricing"),
          },
          {
            href: localize(getPermalink("/about")),
            text: translate("nav.link.about"),
          },
          {
            href: localize(getPermalink("/contact")),
            text: translate("nav.link.contact"),
          },
          {
            href: localize(getPermalink("/terms")),
            text: translate("nav.link.terms"),
          },
          {
            href: localize(getPermalink("/privacy")),
            text: translate("nav.link.privacyPolicy"),
          },
        ],
        text: translate("nav.group.pages"),
      },
      {
        links: [
          {
            href: localize(getPermalink("/landing/lead-generation")),
            text: translate("nav.link.leadGeneration"),
          },
          {
            href: localize(getPermalink("/landing/sales")),
            text: translate("nav.link.longFormSales"),
          },
          {
            href: localize(getPermalink("/landing/click-through")),
            text: translate("nav.link.clickThrough"),
          },
          {
            href: localize(getPermalink("/landing/product")),
            text: translate("nav.link.productDetails"),
          },
          {
            href: localize(getPermalink("/landing/pre-launch")),
            text: translate("nav.link.preLaunch"),
          },
          {
            href: localize(getPermalink("/landing/subscription")),
            text: translate("nav.link.subscription"),
          },
        ],
        text: translate("nav.group.landing"),
      },
      {
        links: [
          {
            href: localize(getBlogPermalink()),
            text: translate("nav.link.blogList"),
          },
          {
            href: localize(
              getPermalink("get-started-website-with-astro-tailwind-css", "post")
            ),
            text: translate("nav.link.article"),
          },
          {
            href: localize(getPermalink("markdown-elements-demo-post", "post")),
            text: translate("nav.link.articleMdx"),
          },
          {
            href: localize(getPermalink("tutorials", "category")),
            text: translate("nav.link.categoryPage"),
          },
          {
            href: localize(getPermalink("astro", "tag")),
            text: translate("nav.link.tagPage"),
          },
        ],
        text: translate("nav.group.blog"),
      },
      {
        href: "#",
        text: translate("nav.link.widgets"),
      },
    ],
  };
};

export const getFooterData = (locale: string = defaultLocale) => {
  const translate = getTranslator(locale);
  const localize = getLocalize(locale);

  return {
    footNote: `
      ${translate("footer.footnote.madeBy")} <a class="text-blue-600 underline dark:text-text-muted" href="https://github.com/unimetrics"> Arthelokyo</a> · ${translate("footer.footnote.rightsReserved")}
    `,
    links: [
      {
        links: [
          { href: "#", text: translate("footer.link.features") },
          { href: "#", text: translate("footer.link.security") },
          { href: "#", text: translate("footer.link.team") },
          { href: "#", text: translate("footer.link.enterprise") },
          { href: "#", text: translate("footer.link.customerStories") },
          { href: "#", text: translate("nav.link.pricing") },
          { href: "#", text: translate("footer.link.resources") },
        ],
        title: translate("footer.group.product"),
      },
      {
        links: [
          { href: "#", text: translate("footer.link.developerApi") },
          { href: "#", text: translate("footer.link.partners") },
          { href: "#", text: translate("footer.link.atom") },
          { href: "#", text: translate("footer.link.electron") },
          { href: "#", text: translate("footer.link.unimetricsDesktop") },
        ],
        title: translate("footer.group.platform"),
      },
      {
        links: [
          { href: "#", text: translate("footer.link.docs") },
          { href: "#", text: translate("footer.link.communityForum") },
          { href: "#", text: translate("footer.link.professionalServices") },
          { href: "#", text: translate("footer.link.skills") },
          { href: "#", text: translate("footer.link.status") },
        ],
        title: translate("footer.group.support"),
      },
      {
        links: [
          { href: "#", text: translate("nav.link.about") },
          { href: "#", text: translate("footer.link.blog") },
          { href: "#", text: translate("footer.link.careers") },
          { href: "#", text: translate("footer.link.press") },
          { href: "#", text: translate("footer.link.inclusion") },
          { href: "#", text: translate("footer.link.socialImpact") },
          { href: "#", text: translate("footer.link.shop") },
        ],
        title: translate("footer.group.company"),
      },
    ],
    secondaryLinks: [
      { href: localize(getPermalink("/terms")), text: translate("nav.link.terms") },
      {
        href: localize(getPermalink("/privacy")),
        text: translate("footer.link.privacyPolicy"),
      },
    ],
    socialLinks: [
      { ariaLabel: "X", href: "#", icon: "tabler:brand-x" },
      { ariaLabel: "Instagram", href: "#", icon: "tabler:brand-instagram" },
      { ariaLabel: "Facebook", href: "#", icon: "tabler:brand-facebook" },
      {
        ariaLabel: "RSS",
        href: getAsset("/rss.xml"),
        icon: "tabler:rss",
      },
      {
        ariaLabel: "GitHub",
        href: "https://github.com/unimetrics/frontend-monorepo",
        icon: "tabler:brand-github",
      },
    ],
  };
};
