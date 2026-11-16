// Dependencies
import { SITEMAP } from "../lib/seo/constants";
import { toAbsoluteUrl } from "../lib/seo/helpers";
import { renderSitemapIndex } from "../lib/seo/sitemap";

// Types
import type { APIRoute } from "astro";

// The index only names the sitemaps, so it is built once
export const prerender = true;

/**
 * The {@link GET} endpoint
 * @description Serves the sitemap index, pointing at the site's pages, its news and its events
 * @param {APIContext} context - The request
 * @returns {Response} The index
 */
export const GET: APIRoute = ({ site, url }) => {
  const origin = new URL(site ?? url.origin);
  const sitemaps = [SITEMAP.PAGES, SITEMAP.NEWS, SITEMAP.EVENTS].map((path) =>
    toAbsoluteUrl(path, origin),
  );
  return new Response(renderSitemapIndex(sitemaps), {
    headers: { "Content-Type": SITEMAP.CONTENT_TYPE },
  });
};
