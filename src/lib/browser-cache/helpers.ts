// Dependencies
import { BROWSER_CACHE, PRIVATE_PAGE } from "./constants";

// Types
import type { AstroGlobal } from "astro";

/**
 * The {@link letBrowserKeepPage} helper
 * @description Lets the visitor's browser reuse a page for a minute when the edge keeps it, so a prefetched page opens without asking again
 * @param {Pick<AstroGlobal["cache"], "enabled" | "options">} cache - The route's cache, as the page left it
 * @param {Response} response - The answer about to be sent
 * @returns {Response} The answer, with the browser rule on a page the edge keeps
 */
export function letBrowserKeepPage(
  cache: Pick<AstroGlobal["cache"], "enabled" | "options">,
  response: Response,
): Response {
  // Only a page the edge keeps, that worked and set no rule of its own, gets one
  const isKeptAtEdge = cache.enabled && cache.options.maxAge !== undefined;
  if (!isKeptAtEdge || !response.ok || response.headers.has(BROWSER_CACHE.HEADER)) {
    return response;
  }

  // Copy the answer, as one read from a cache cannot change, and add the rule
  const kept = new Response(response.body, response);
  kept.headers.set(BROWSER_CACHE.HEADER, BROWSER_CACHE.VALUE);
  return kept;
}

/**
 * The {@link keepPagePrivate} helper
 * @description Tells browsers and Cloudflare not to keep a page that shows one visitor's own result (a gift, a sent message or sign-up), and search engines not to list it
 * @param {Headers} headers - The page's response headers
 * @returns {void}
 */
export function keepPagePrivate(headers: Headers): void {
  // No cache keeps the page, and no search engine lists it
  headers.set(PRIVATE_PAGE.HEADER, PRIVATE_PAGE.VALUE);
  headers.set(PRIVATE_PAGE.ROBOTS_HEADER, PRIVATE_PAGE.ROBOTS_VALUE);
}
