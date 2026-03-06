import { getAsset, getBlogPermalink, getPermalink } from "./utils/permalinks";

export const headerData = {
  actions: [
    {
      href: "https://github.com/unimetrics/frontend-monorepo",
      target: "_blank",
      text: "Download",
    },
  ],
  links: [
    {
      links: [
        {
          href: getPermalink("/homes/saas"),
          text: "SaaS",
        },
        {
          href: getPermalink("/homes/startup"),
          text: "Startup",
        },
        {
          href: getPermalink("/homes/mobile-app"),
          text: "Mobile App",
        },
        {
          href: getPermalink("/homes/personal"),
          text: "Personal",
        },
      ],
      text: "Homes",
    },
    {
      links: [
        {
          href: getPermalink("/#features"),
          text: "Features (Anchor Link)",
        },
        {
          href: getPermalink("/services"),
          text: "Services",
        },
        {
          href: getPermalink("/pricing"),
          text: "Pricing",
        },
        {
          href: getPermalink("/about"),
          text: "About us",
        },
        {
          href: getPermalink("/contact"),
          text: "Contact",
        },
        {
          href: getPermalink("/terms"),
          text: "Terms",
        },
        {
          href: getPermalink("/privacy"),
          text: "Privacy policy",
        },
      ],
      text: "Pages",
    },
    {
      links: [
        {
          href: getPermalink("/landing/lead-generation"),
          text: "Lead Generation",
        },
        {
          href: getPermalink("/landing/sales"),
          text: "Long-form Sales",
        },
        {
          href: getPermalink("/landing/click-through"),
          text: "Click-Through",
        },
        {
          href: getPermalink("/landing/product"),
          text: "Product Details (or Services)",
        },
        {
          href: getPermalink("/landing/pre-launch"),
          text: "Coming Soon or Pre-Launch",
        },
        {
          href: getPermalink("/landing/subscription"),
          text: "Subscription",
        },
      ],
      text: "Landing",
    },
    {
      links: [
        {
          href: getBlogPermalink(),
          text: "Blog List",
        },
        {
          href: getPermalink("get-started-website-with-astro-tailwind-css", "post"),
          text: "Article",
        },
        {
          href: getPermalink("markdown-elements-demo-post", "post"),
          text: "Article (with MDX)",
        },
        {
          href: getPermalink("tutorials", "category"),
          text: "Category Page",
        },
        {
          href: getPermalink("astro", "tag"),
          text: "Tag Page",
        },
      ],
      text: "Blog",
    },
    {
      href: "#",
      text: "Widgets",
    },
  ],
};

export const footerData = {
  footNote: `
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://github.com/unimetrics"> Arthelokyo</a> · All rights reserved.
  `,
  links: [
    {
      links: [
        { href: "#", text: "Features" },
        { href: "#", text: "Security" },
        { href: "#", text: "Team" },
        { href: "#", text: "Enterprise" },
        { href: "#", text: "Customer stories" },
        { href: "#", text: "Pricing" },
        { href: "#", text: "Resources" },
      ],
      title: "Product",
    },
    {
      links: [
        { href: "#", text: "Developer API" },
        { href: "#", text: "Partners" },
        { href: "#", text: "Atom" },
        { href: "#", text: "Electron" },
        { href: "#", text: "Unimetrics Desktop" },
      ],
      title: "Platform",
    },
    {
      links: [
        { href: "#", text: "Docs" },
        { href: "#", text: "Community Forum" },
        { href: "#", text: "Professional Services" },
        { href: "#", text: "Skills" },
        { href: "#", text: "Status" },
      ],
      title: "Support",
    },
    {
      links: [
        { href: "#", text: "About" },
        { href: "#", text: "Blog" },
        { href: "#", text: "Careers" },
        { href: "#", text: "Press" },
        { href: "#", text: "Inclusion" },
        { href: "#", text: "Social Impact" },
        { href: "#", text: "Shop" },
      ],
      title: "Company",
    },
  ],
  secondaryLinks: [
    { href: getPermalink("/terms"), text: "Terms" },
    { href: getPermalink("/privacy"), text: "Privacy Policy" },
  ],
  socialLinks: [
    { ariaLabel: "X", href: "#", icon: "tabler:brand-x" },
    { ariaLabel: "Instagram", href: "#", icon: "tabler:brand-instagram" },
    { ariaLabel: "Facebook", href: "#", icon: "tabler:brand-facebook" },
    { ariaLabel: "RSS", href: getAsset("/rss.xml"), icon: "tabler:rss" },
    {
      ariaLabel: "Github",
      href: "https://github.com/unimetrics/frontend-monorepo",
      icon: "tabler:brand-github",
    },
  ],
};
