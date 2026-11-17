// Dependencies
import { getSiteSettingsWithCacheHint } from "emdash";
import { cacheContentPage } from "../lib/content/helpers";
import { ROBOTS, SITEMAP } from "../lib/seo/constants";
import { toAbsoluteUrl } from "../lib/seo/helpers";
import { renderRobots, renderStagingRobots } from "../lib/seo/sitemap";

// Types
import type { APIRoute } from "astro";

// robots.txt follows the admin's Site Status (Staging or Live), so it renders per request
export const prerender = false;

/**
 * The {@link GET} endpoint
 * @description Serves robots.txt: while the site is in staging every search engine stays out of every page; once it is live, everyone may read the site except EmDash's admin and API, with the sitemap's address
 * @param {APIContext} context - The request
 * @returns {Promise<Response>} The file
 */
export const GET: APIRoute = async ({ site, url, cache }) => {
  const origin = new URL(site ?? url.origin);
  const { data: settings, cacheHint } = await getSiteSettingsWithCacheHint();

  // Keep it at the edge until the settings change
  cacheContentPage(cache, [cacheHint]);

  // A site in staging keeps every search engine out
  if (settings.staging) {
    return new Response(renderStagingRobots(), {
      headers: { "Content-Type": ROBOTS.CONTENT_TYPE },
    });
  }

  // A live site lists its sitemap and keeps only the admin out
  return new Response(renderRobots(toAbsoluteUrl(SITEMAP.INDEX, origin), ROBOTS.PRIVATE_PATH), {
    headers: { "Content-Type": ROBOTS.CONTENT_TYPE },
  });
};
