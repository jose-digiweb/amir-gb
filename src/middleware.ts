// Dependencies
import { defineMiddleware } from "astro:middleware";
import { keepResizedImage } from "./lib/images/helpers";

/**
 * The {@link onRequest} middleware
 * @description Lets Cloudflare's edge keep every resized image, which the adapter would otherwise mark as never to keep
 */
export const onRequest = defineMiddleware(async (context, next) => {
  // Answer the request, then mark a resized image for the edge
  const response = await next();
  return keepResizedImage(context.url, response);
});
