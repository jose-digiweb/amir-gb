// Dependencies
import { defineMiddleware } from "astro:middleware";
import { letBrowserKeepPage } from "./lib/browser-cache/helpers";
import { keepResizedImage } from "./lib/images/helpers";

/**
 * The {@link onRequest} middleware
 * @description Lets Cloudflare's edge keep every resized image, which the adapter would otherwise mark as never to keep, and lets the browser reuse a page the edge keeps for a minute
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Answer the request, then add the cache rules for the edge and the browser
  const response = await next();
  return letBrowserKeepPage(context.cache, keepResizedImage(context.url, response));
});
