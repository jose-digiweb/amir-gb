// Dependencies
import { RESIZED_IMAGE } from "./constants";

/**
 * The {@link keepResizedImage} helper
 * @description Lets the edge keep a resized image as long as the browser may, so each size is made once; a failed resize is never kept
 * @param {URL} url - The address that was asked for
 * @param {Response} response - The answer about to be sent
 * @returns {Response} The answer, with the edge header on a resized image that worked
 */
export function keepResizedImage(url: URL, response: Response): Response {
  // Only a resized image that worked is kept
  const cacheControl = response.headers.get(RESIZED_IMAGE.CACHE_CONTROL);
  if (url.pathname !== RESIZED_IMAGE.PATH || !response.ok || !cacheControl) {
    return response;
  }

  // Copy the answer, as one read from the cache cannot change, and give the edge the browser's rule
  const kept = new Response(response.body, response);
  kept.headers.set(RESIZED_IMAGE.EDGE_CACHE_CONTROL, cacheControl);
  return kept;
}
