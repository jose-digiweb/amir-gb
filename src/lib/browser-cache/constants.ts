/**
 * The {@link BROWSER_CACHE} constant
 * @description How long a visitor's browser may reuse a page the edge keeps, so a page prefetched a moment ago opens at once, in Safari too
 */
export const BROWSER_CACHE = {
  HEADER: "Cache-Control",
  VALUE: "public, max-age=60",
} as const;
