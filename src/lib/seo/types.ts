// Types
import type { ContentSeo } from "emdash";
import type { Locale } from "../../i18n/types";
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
  image: { url: string; width: number | null; height: number | null; alt: string };
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
