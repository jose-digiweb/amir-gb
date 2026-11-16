// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { DEFAULT_LOCALE, LOCALES } from "../i18n/constants";
import { SITEMAP, SITEMAP_PAGES } from "../lib/seo/constants";
import { getPageSitemapUrls, renderUrlset } from "../lib/seo/sitemap";

// Types
import type { APIRoute } from "astro";

// The site's own pages only change with a deploy, so their sitemap is built once
export const prerender = true;

/**
 * The {@link GET} endpoint
 * @description Serves the sitemap of the site's own pages, each in every language with its language versions
 * @param {APIContext} context - The request
 * @returns {Response} The sitemap
 */
export const GET: APIRoute = ({ site, url }) => {
  const origin = new URL(site ?? url.origin);
  const pages = SITEMAP_PAGES.map((route) =>
    LOCALES.map((locale) => ({ locale, path: getRelativeLocaleUrl(locale, route) })),
  );
  return new Response(renderUrlset(getPageSitemapUrls(pages, origin, DEFAULT_LOCALE)), {
    headers: { "Content-Type": SITEMAP.CONTENT_TYPE },
  });
};
