/**
 * The {@link BROWSER_CACHE} constant
 * @description How long a visitor's browser may reuse a page the edge keeps, so a page prefetched a moment ago opens at once, in Safari too
 */
export const BROWSER_CACHE = {
  HEADER: "Cache-Control",
  VALUE: "public, max-age=60",
} as const;

/**
 * The {@link PRIVATE_PAGE} constant
 * @description The headers for a page that shows one donor's gift, so no cache keeps it and no search engine lists it
 */
export const PRIVATE_PAGE = {
  HEADER: "Cache-Control",
  VALUE: "private, no-store",
  ROBOTS_HEADER: "X-Robots-Tag",
  ROBOTS_VALUE: "noindex",
} as const;

/**
 * The {@link STALE_PAGE} constant
 * @description How a page kept from an earlier deploy finds that its own files are gone, and reloads once to get the current page
 */
export const STALE_PAGE = {
  ASSET_PATH: "/_astro/",
  STORAGE_KEY: "amir-gb-reloaded:",
  RELOAD_GAP_MS: 60_000,
  HYDRATION_ERROR_EVENT: "astro:hydration-error",
  IMPORT_ERRORS: ["dynamically imported module", "Importing a module script failed"],
} as const;
