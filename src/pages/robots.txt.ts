// Dependencies
import { ROBOTS, SITEMAP } from "../lib/seo/constants";
import { toAbsoluteUrl } from "../lib/seo/helpers";
import { renderRobots } from "../lib/seo/sitemap";

// Types
import type { APIRoute } from "astro";

// robots.txt is the same for every visitor, so it is built once
export const prerender = true;

/**
 * The {@link GET} endpoint
 * @description Serves robots.txt: everyone may read the site except EmDash's admin and API, and the sitemap's address
 * @param {APIContext} context - The request
 * @returns {Response} The file
 */
export const GET: APIRoute = ({ site, url }) => {
  const origin = new URL(site ?? url.origin);
  return new Response(renderRobots(toAbsoluteUrl(SITEMAP.INDEX, origin), ROBOTS.PRIVATE_PATH), {
    headers: { "Content-Type": ROBOTS.CONTENT_TYPE },
  });
};
