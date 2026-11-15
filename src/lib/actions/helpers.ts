// Dependencies
import { ORIGIN_HEADER } from "./constants";

/**
 * The {@link isForeignPost} helper
 * @description Whether a form was posted from another site, as the built Worker has no origin check of its own
 * @param {Request} request - The action's request
 * @param {URL} url - The action's own address
 * @returns {boolean} True when the request names another origin
 */
export function isForeignPost(request: Request, url: URL): boolean {
  const origin = request.headers.get(ORIGIN_HEADER);
  return Boolean(origin) && origin !== url.origin;
}
