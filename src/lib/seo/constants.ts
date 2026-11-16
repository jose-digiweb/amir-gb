// Dependencies
import { LOCALE } from "../../i18n/constants";
import { ROUTE } from "../../site/constants";

/**
 * The {@link SEO} constant
 * @description What every page tells search engines and link previews: the site's name, the language search falls back to, how a page is kept out of search, and the share card's kind
 */
export const SEO = {
  SITE_NAME: "AMIR-GB",
  X_DEFAULT: "x-default",
  NOINDEX: "noindex",
  STAGING_HOST_SUFFIX: ".workers.dev",
  TWITTER_CARD: "summary_large_image",
  HTTP_PATTERN: /^https?:\/\//,
  TRAILING_SLASH: "always",
} as const;

/**
 * The {@link OG_TYPE} constant
 * @description The kinds of page a link preview can describe
 */
export const OG_TYPE = {
  WEBSITE: "website",
  ARTICLE: "article",
} as const;

/**
 * The {@link OG_LOCALE} constant
 * @description Each language as link previews name it
 */
export const OG_LOCALE = {
  [LOCALE.NL]: "nl_NL",
  [LOCALE.EN]: "en_GB",
  [LOCALE.PT]: "pt_PT",
} as const;

/**
 * The {@link SHARE_IMAGE} constant
 * @description The picture a link preview shows when a page has none of its own, at the size previews ask for
 */
export const SHARE_IMAGE = {
  SRC: "/og/amir-gb.jpg",
  WIDTH: 1200,
  HEIGHT: 630,
} as const;

/**
 * The {@link SITEMAP} constant
 * @description The site's sitemaps, as paths from the site's root, and how many entries one read takes
 */
export const SITEMAP = {
  INDEX: "/sitemap.xml",
  PAGES: "/sitemap-pages.xml",
  NEWS: "/sitemap-news.xml",
  EVENTS: "/sitemap-events.xml",
  READ_LIMIT: 100,
  CONTENT_TYPE: "application/xml; charset=utf-8",
  NAMESPACE: "http://www.sitemaps.org/schemas/sitemap/0.9",
  XHTML_NAMESPACE: "http://www.w3.org/1999/xhtml",
} as const;

/**
 * The {@link ROBOTS} constant
 * @description What robots.txt says: everyone may read the site except EmDash's admin and API
 */
export const ROBOTS = {
  CONTENT_TYPE: "text/plain; charset=utf-8",
  PRIVATE_PATH: "/_emdash/",
} as const;

/**
 * The {@link XML_ESCAPES} constant
 * @description The characters XML text has to write as entities
 */
export const XML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
} as const;

/**
 * The {@link SITEMAP_PAGES} constant
 * @description The site's own pages search may list, in every language; the archive is left out, as it has no page until there are past events
 */
export const SITEMAP_PAGES = [
  ROUTE.HOME,
  ROUTE.GET_HELP,
  ROUTE.EVENTS,
  ROUTE.EVENTS_CALENDAR,
  ROUTE.NEWS,
  ROUTE.ABOUT,
  ROUTE.JOIN,
  ROUTE.CONTACT,
  ROUTE.DONATE,
  ROUTE.PRIVACY,
] as const;
