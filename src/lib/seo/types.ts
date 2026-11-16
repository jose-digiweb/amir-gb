// Types
import type { ContentSeo } from "emdash";
import type { Locale } from "../../i18n/types";
import type { EventStatus } from "../events/types";
import type { OG_TYPE } from "./constants";

/**
 * The {@link OgType} type
 * @description One of the {@link OG_TYPE} values
 */
export type OgType = (typeof OG_TYPE)[keyof typeof OG_TYPE];

/**
 * The {@link LanguageAlternate} type
 * @description One language version of a page for search engines: its language, or x-default, and its full address
 */
export type LanguageAlternate = {
  hreflang: string;
  href: string;
};

/**
 * The {@link LocalePath} type
 * @description A page's path in one language
 */
export type LocalePath = {
  locale: Locale;
  path: string;
};

/**
 * The {@link PageSeo} type
 * @description What a page sets for search and link previews beyond its title and description; anything left out takes the site's default
 */
export type PageSeo = {
  title?: string;
  description?: string;
  canonical?: string;
  alternates?: LanguageAlternate[];
  noindex?: boolean;
  image?: string;
  imageAlt?: string;
  type?: OgType;
  contentLocale?: Locale;
  structuredData?: JsonLdNode[];
};

/**
 * The {@link HeadSeoInput} type
 * @description Everything the head needs to work out a page's search and preview tags
 */
export type HeadSeoInput = {
  site: URL;
  pathname: string;
  locale: Locale;
  localePaths: LocalePath[];
  defaultLocale: Locale;
  shareImageAlt: string;
  seo?: PageSeo;
};

/**
 * The {@link HeadSeo} type
 * @description A page's search and preview tags, ready to render
 */
export type HeadSeo = {
  canonical: string;
  alternates: LanguageAlternate[];
  robots: string | null;
  ogType: OgType;
  ogLocale: string;
  ogLocaleAlternates: string[];
  image: {
    url: string;
    width: number | null;
    height: number | null;
    type: string | null;
    alt: string;
  };
};

/**
 * The {@link EntrySeoInput} type
 * @description What a post's or event's page knows for search: its language versions, whether it is shown in Dutch at another language's address, the editor's search settings and its photo
 */
export type EntrySeoInput = {
  alternates: LanguageAlternate[];
  isDutchOnly: boolean;
  defaultLocale: Locale;
  seo?: ContentSeo;
  image?: string;
  imageAlt?: string;
};

/**
 * The {@link SitemapUrl} type
 * @description One address in a sitemap, with its language versions and when it last changed
 */
export type SitemapUrl = {
  loc: string;
  lastmod?: string;
  alternates: LanguageAlternate[];
};

/**
 * The {@link SitemapEntry} type
 * @description One published post or event in one language, as the sitemap needs it
 */
export type SitemapEntry = {
  group: string;
  locale: Locale;
  path: string;
  lastmod: string;
  isHidden: boolean;
};

/**
 * The {@link JsonLdValue} type
 * @description Any value structured data can hold
 */
export type JsonLdValue =
  | string
  | number
  | boolean
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

/**
 * The {@link JsonLdNode} type
 * @description One thing described in structured data, such as AMIR-GB or an event
 */
export type JsonLdNode = { [key: string]: JsonLdValue };

/**
 * The {@link SiteSchemaInput} type
 * @description What AMIR-GB's own structured data needs: the site's address, the page's language, its legal name, its logo and its social profiles
 */
export type SiteSchemaInput = {
  site: URL;
  locale: Locale;
  legalName: string;
  logo: string;
  sameAs: string[];
};

/**
 * The {@link EventSchemaInput} type
 * @description An event as its structured data needs it
 */
export type EventSchemaInput = {
  site: URL;
  url: string;
  name: string;
  status: EventStatus;
  startsAt: Date;
  endsAt?: Date;
  originalStartsAt?: Date;
  placeName?: string;
  address?: string;
  isOnline: boolean;
  image?: string;
  description?: string;
  locale: Locale;
};

/**
 * The {@link ArticleSchemaInput} type
 * @description A post as its structured data needs it
 */
export type ArticleSchemaInput = {
  site: URL;
  url: string;
  headline: string;
  publishedAt: Date;
  image?: string;
  description?: string;
  locale: Locale;
};

/**
 * The {@link BreadcrumbStep} type
 * @description One step of a breadcrumb trail: its name and address
 */
export type BreadcrumbStep = {
  name: string;
  path: string;
};
