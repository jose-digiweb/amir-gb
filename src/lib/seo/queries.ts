// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { getEmDashCollection, getHreflangAlternates } from "emdash";
import { LOCALES } from "../../i18n/constants";
import { CONTENT_STATUS } from "../content/constants";
import { SEO, SITEMAP } from "./constants";

// Types
import type { EmDashCollections } from "emdash";
import type { Locale } from "../../i18n/types";
import type { SeoMeta, TranslationMeta } from "../content/types";
import type { LanguageAlternate, SitemapEntry } from "./types";

/**
 * The {@link getEntryAlternates} helper
 * @description A post's or event's language versions as full addresses ending in a slash, with x-default; only translations that exist
 * @param {string} collection - The entry's content type
 * @param {string} entryId - The entry's ID, or its translation group
 * @param {URL} site - The site's public address
 * @returns {Promise<LanguageAlternate[]>} One alternate per translation, then x-default
 */
export async function getEntryAlternates(
  collection: string,
  entryId: string,
  site: URL,
): Promise<LanguageAlternate[]> {
  const alternates = await getHreflangAlternates(collection, entryId, {
    siteUrl: site.origin,
    trailingSlash: SEO.TRAILING_SLASH,
  });

  // Keep only the language and the address
  return alternates.map(({ hreflang, href }) => ({ hreflang, href }));
}

/**
 * The {@link readLocaleEntries} helper
 * @description Every published post or event in one language, a hundred at a time, as the sitemap needs them
 * @param {C} collection - The content type to read
 * @param {Locale} locale - The language to read
 * @param {string} route - The path its pages live under, such as /news/
 * @returns {Promise<SitemapEntry[]>} The language's entries
 */
async function readLocaleEntries<C extends keyof EmDashCollections>(
  collection: C,
  locale: Locale,
  route: string,
): Promise<SitemapEntry[]> {
  const entries: SitemapEntry[] = [];
  let cursor: string | undefined;

  // Follow EmDash's cursor until the last page
  do {
    const page = await getEmDashCollection<C, EmDashCollections[C] & TranslationMeta & SeoMeta>(
      collection,
      { status: CONTENT_STATUS.PUBLISHED, locale, limit: SITEMAP.READ_LIMIT, cursor },
    );

    // A failed read fails the sitemap, so search engines never get an empty one by mistake
    if (page.error) {
      throw page.error;
    }

    // Keep what the sitemap needs from each entry that has an address
    for (const { data } of page.entries) {
      if (!data.slug) {
        continue;
      }
      entries.push({
        group: data.translationGroup ?? data.id,
        locale,
        path: getRelativeLocaleUrl(locale, `${route}${data.slug}/`),
        lastmod: data.updatedAt.toISOString(),
        isHidden: Boolean(data.seo?.noIndex),
      });
    }
    cursor = page.nextCursor;
  } while (cursor);

  // Return the language's entries
  return entries;
}

/**
 * The {@link readSitemapEntries} helper
 * @description Every published post or event in every language, for its sitemap
 * @param {C} collection - The content type to read
 * @param {string} route - The path its pages live under, such as /news/
 * @returns {Promise<SitemapEntry[]>} The entries of every language
 */
export async function readSitemapEntries<C extends keyof EmDashCollections>(
  collection: C,
  route: string,
): Promise<SitemapEntry[]> {
  const languages = await Promise.all(
    LOCALES.map((locale) => readLocaleEntries(collection, locale, route)),
  );

  // One list across the languages
  return languages.flat();
}
