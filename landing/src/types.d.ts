import type { AstroComponentFactory } from "astro/runtime/server/index.js";
import type { HTMLAttributes, ImageMetadata } from "astro/types";

export interface Brands extends Omit<Headline, "classes">, Widget {
  icons?: Array<string>;
  images?: Array<Image>;
}

// COMPONENTS
export interface CallToAction extends Omit<HTMLAttributes<"a">, "slot"> {
  classes?: Record<string, string>;
  icon?: string;
  text?: string;
  type?: "button" | "reset" | "submit";
  variant?: "link" | "primary" | "secondary" | "tertiary";
}

export interface Collapse {
  classes?: Record<string, string>;
  columns?: number;
  iconDown?: string;
  iconUp?: string;
  items?: Array<Item>;
}

export interface Contact extends Form, Omit<Headline, "classes">, Widget {}

export interface Content extends Omit<Headline, "classes">, Widget {
  callToAction?: CallToAction;
  columns?: number;
  content?: string;
  image?: string | unknown;
  isAfterContent?: boolean;
  isReversed?: boolean;
  items?: Array<Item>;
}

export interface Disclaimer {
  label?: string;
}

export interface Faqs extends Omit<Headline, "classes">, Widget {
  columns?: number;
  iconDown?: string;
  iconUp?: string;
  items?: Array<Item>;
}

export interface Features extends Omit<Headline, "classes">, Widget {
  callToAction1?: CallToAction;
  callToAction2?: CallToAction;
  columns?: number;
  defaultIcon?: string;
  image?: string | unknown;
  isAfterContent?: boolean;
  isBeforeContent?: boolean;
  isReversed?: boolean;
  items?: Array<Item>;
  video?: Video;
}

export interface Form {
  button?: string;
  description?: string;
  disclaimer?: Disclaimer;
  inputs?: Array<Input>;
  textarea?: Textarea;
}

export interface Headline {
  classes?: Record<string, string>;
  subtitle?: string;
  tagline?: string;
  title?: string;
}

// WIDGETS
export interface Hero
  extends Omit<Headline, "classes">, Omit<Widget, "classes" | "isDark"> {
  actions?: CallToAction[] | string;
  content?: string;
  image?: string | unknown;
}

export interface Image {
  alt?: string;
  src: string;
}

export interface Input {
  autocomplete?: string;
  label?: string;
  name: string;
  placeholder?: string;
  type: HTMLInputTypeAttribute;
}

export interface Item {
  callToAction?: CallToAction;
  classes?: Record<string, string>;
  description?: string;
  icon?: string;
  image?: Image;
  title?: string;
}

export interface ItemGrid {
  classes?: Record<string, string>;
  columns?: number;
  defaultIcon?: string;
  items?: Array<Item>;
}

export interface MetaData {
  canonical?: string;
  description?: string;

  ignoreTitleTemplate?: boolean;

  openGraph?: MetaDataOpenGraph;

  robots?: MetaDataRobots;

  title?: string;
  twitter?: MetaDataTwitter;
}

export interface MetaDataImage {
  height?: number;
  url: string;
  width?: number;
}

export interface MetaDataOpenGraph {
  images?: Array<MetaDataImage>;
  locale?: string;
  siteName?: string;
  type?: string;
  url?: string;
}

export interface MetaDataRobots {
  follow?: boolean;
  index?: boolean;
}

export interface MetaDataTwitter {
  cardType?: string;
  handle?: string;
  site?: string;
}

export interface Post {
  /**  */
  author?: string;

  /**  */
  category?: Taxonomy;

  /**  */
  Content?: AstroComponentFactory;

  content?: string;
  /**  */
  draft?: boolean;

  /** Optional summary of post content. */
  excerpt?: string;
  /** A unique ID number that identifies a post. */
  id: string;
  /**  */
  image?: ImageMetadata | string;

  /**  */
  metadata?: MetaData;
  /**  */
  permalink: string;
  /**  */
  publishDate: Date;

  /**  */
  readingTime?: number;

  /** A post’s unique slug – part of the post’s URL based on its name, i.e. a post called “My Sample Page” has a slug “my-sample-page”. */
  slug: string;

  /**  */
  tags?: Taxonomy[];
  /**  */
  title: string;

  /**  */
  updateDate?: Date;
}

export interface Price {
  callToAction?: CallToAction;
  description?: string;
  hasRibbon?: boolean;
  items?: Array<Item>;
  period?: string;
  price?: number | string;
  ribbonTitle?: string;
  subtitle?: string;
  title?: string;
}

export interface Pricing extends Omit<Headline, "classes">, Widget {
  prices?: Array<Price>;
}

export interface Stat {
  amount?: number | string;
  icon?: string;
  title?: string;
}

export interface Stats extends Omit<Headline, "classes">, Widget {
  stats?: Array<Stat>;
}

export interface Steps extends Omit<Headline, "classes">, Widget {
  callToAction?: CallToAction | string;
  image?: Image | string;
  isReversed?: boolean;
  items?: Array<Item>;
}

export interface Taxonomy {
  slug: string;
  title: string;
}

export interface Team extends Omit<Headline, "classes">, Widget {
  team?: Array<TeamMember>;
}

export interface Testimonial {
  image?: string | unknown;
  job?: string;
  name?: string;
  testimonial?: string;
  title?: string;
}

export interface Testimonials extends Omit<Headline, "classes">, Widget {
  callToAction?: CallToAction;
  testimonials?: Array<Testimonial>;
}

export interface Textarea {
  label?: string;
  name?: string;
  placeholder?: string;
  rows?: number;
}

export interface Video {
  src: string;
  type?: string;
}

export interface Widget {
  bg?: string;
  classes?: Record<string, Record<string, string> | string>;
  id?: string;
  isDark?: boolean;
}

interface Social {
  href?: string;
  icon?: string;
}

interface TeamMember {
  classes?: Record<string, string>;
  description?: string;
  image?: Image;
  job?: string;
  name?: string;
  socials?: Array<Social>;
}
