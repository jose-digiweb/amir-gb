// Dependencies
import { DEFAULT_LOCALE } from "../i18n/constants";
import { COLLECTION, CONTENT_CACHE } from "../lib/content/constants";
import { SITEMAP } from "../lib/seo/constants";
import { readSitemapEntries } from "../lib/seo/queries";
import { getEntrySitemapUrls, renderUrlset } from "../lib/seo/sitemap";
import { ROUTE } from "../site/constants";

// Types
import type { APIRoute } from "astro";

// The events come from the CMS, so their sitemap renders per request
export const prerender = false;

/**
 * The {@link GET} endpoint
 * @description Serves the sitemap of the published events, each in its languages, joined to its translations
 * @param {APIContext} context - The request
 * @returns {Promise<Response>} The sitemap
 */
export const GET: APIRoute = async ({ site, url, cache }) => {
  const origin = new URL(site ?? url.origin);
  const entries = await readSitemapEntries(COLLECTION.EVENTS, ROUTE.EVENTS);

  // Keep it at the edge as long as the CMS pages
  if (cache.enabled) {
    cache.set({ maxAge: CONTENT_CACHE.MAX_AGE, swr: CONTENT_CACHE.STALE_WHILE_REVALIDATE });
  }

  // Every published event in its languages
  return new Response(renderUrlset(getEntrySitemapUrls(entries, origin, DEFAULT_LOCALE)), {
    headers: { "Content-Type": SITEMAP.CONTENT_TYPE },
  });
};
