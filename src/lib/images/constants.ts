/**
 * The {@link RESIZED_IMAGE} constant
 * @description Where Astro serves resized images, and the header that lets Cloudflare's edge keep them
 */
export const RESIZED_IMAGE = {
  PATH: "/_image",
  CACHE_CONTROL: "Cache-Control",
  EDGE_CACHE_CONTROL: "Cloudflare-CDN-Cache-Control",
} as const;
