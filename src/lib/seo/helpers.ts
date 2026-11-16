// Dependencies
import { isLocale } from "../../i18n/helpers";
import { OG_LOCALE, OG_TYPE, SEO, SHARE_IMAGE } from "./constants";

// Types
import type {
  EntrySeoInput,
  HeadSeo,
  HeadSeoInput,
  LanguageAlternate,
  LocalePath,
  PageSeo,
} from "./types";

/**
 * The {@link toAbsoluteUrl} helper
 * @description A full address for a path on the site; a full address stays as it is
 * @param {string} path - A path such as /en/contact/, or a full address
 * @param {URL} site - The site's public address
 * @returns {string} The full address
 */
export function toAbsoluteUrl(path: string, site: URL): string {
  // A full address is already absolute
  if (SEO.HTTP_PATTERN.test(path)) {
    return path;
  }

  // A path joins the site's origin
  return new URL(path, site.origin).href;
}

/**
 * The {@link isStagingSite} helper
 * @description Whether the site runs on its preview address rather than AMIR-GB's own domain, so search engines are kept out
 * @param {URL} site - The site's public address
 * @returns {boolean} True on the preview address
 */
export function isStagingSite(site: URL): boolean {
  return site.hostname.endsWith(SEO.STAGING_HOST_SUFFIX);
}

/**
 * The {@link getLanguageAlternates} helper
 * @description A page's language versions as full addresses, with the default language as x-default
 * @param {LocalePath[]} localePaths - The page's path in each language
 * @param {URL} site - The site's public address
 * @param {string} defaultLocale - The language search falls back to
 * @returns {LanguageAlternate[]} One alternate per language, then x-default
 */
export function getLanguageAlternates(
  localePaths: LocalePath[],
  site: URL,
  defaultLocale: string,
): LanguageAlternate[] {
  const alternates = localePaths.map(({ locale, path }) => ({
    hreflang: locale,
    href: toAbsoluteUrl(path, site),
  }));
  const fallback = alternates.find((alternate) => alternate.hreflang === defaultLocale);

  // Without the default language there is no x-default
  if (!fallback) {
    return alternates;
  }

  // The default language also stands for every other one
  return [...alternates, { hreflang: SEO.X_DEFAULT, href: fallback.href }];
}

/**
 * The {@link getShareImage} helper
 * @description The picture a page's link preview shows: its own, or the site's share card at its known size
 * @param {PageSeo} seo - The page's settings
 * @param {URL} site - The site's public address
 * @param {string} shareImageAlt - The share card's description in the page's language
 * @returns {HeadSeo["image"]} The picture's full address, size when known, and description
 */
function getShareImage(seo: PageSeo, site: URL, shareImageAlt: string): HeadSeo["image"] {
  // A page with its own picture shows it
  if (seo.image) {
    return {
      url: toAbsoluteUrl(seo.image, site),
      width: null,
      height: null,
      type: null,
      alt: seo.imageAlt ?? shareImageAlt,
    };
  }

  // Any other page shows the site's share card
  return {
    url: toAbsoluteUrl(SHARE_IMAGE.SRC, site),
    width: SHARE_IMAGE.WIDTH,
    height: SHARE_IMAGE.HEIGHT,
    type: SHARE_IMAGE.TYPE,
    alt: shareImageAlt,
  };
}

/**
 * The {@link buildHeadSeo} helper
 * @description A page's canonical address, language versions, robots rule and link preview, from its own settings and the site's defaults
 * @param {HeadSeoInput} input - The page's address, language, paths in each language and settings
 * @returns {HeadSeo} The tags to render
 */
export function buildHeadSeo(input: HeadSeoInput): HeadSeo {
  const { site, pathname, locale, localePaths, defaultLocale, shareImageAlt, seo = {} } = input;
  const alternates = seo.alternates ?? getLanguageAlternates(localePaths, site, defaultLocale);
  const contentLocale = seo.contentLocale ?? locale;
  const otherLocales = alternates
    .map((alternate) => alternate.hreflang)
    .filter((hreflang) => hreflang !== contentLocale)
    .filter(isLocale);
  const isHidden = Boolean(seo.noindex) || isStagingSite(site);

  // Everything the head renders, with the address the page is read at as its canonical one
  return {
    canonical: seo.canonical ?? toAbsoluteUrl(pathname, site),
    alternates,
    robots: isHidden ? SEO.NOINDEX : null,
    ogType: seo.type ?? OG_TYPE.WEBSITE,
    ogLocale: OG_LOCALE[contentLocale],
    ogLocaleAlternates: otherLocales.map((language) => OG_LOCALE[language]),
    image: getShareImage(seo, site, shareImageAlt),
  };
}

/**
 * The {@link getEntryPageSeo} helper
 * @description A post's or event's search settings: its own language versions, the Dutch address as canonical when it is shown in Dutch at another language's address, the editor's description and photo first; the page fills its title in itself
 * @param {EntrySeoInput} input - The entry's language versions, language state, editor's settings and photo
 * @returns {PageSeo} The page's settings for the head
 */
export function getEntryPageSeo(input: EntrySeoInput): PageSeo {
  const { alternates, isDutchOnly, defaultLocale, seo, image, imageAlt } = input;
  const dutch = alternates.find((alternate) => alternate.hreflang === defaultLocale);

  // A Dutch post shown at another language's address points search at the Dutch one
  let canonical = seo?.canonical ?? undefined;
  if (!canonical && isDutchOnly && dutch) {
    canonical = dutch.href;
  }

  // The editor's settings win over the entry's own title, summary and photo
  return {
    description: seo?.description ?? undefined,
    canonical,
    alternates,
    noindex: Boolean(seo?.noIndex),
    image: seo?.image ?? image,
    imageAlt,
    type: OG_TYPE.ARTICLE,
    contentLocale: isDutchOnly ? defaultLocale : undefined,
  };
}
