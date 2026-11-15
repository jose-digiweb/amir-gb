/**
 * The {@link HEADER_BAND} constant
 * @description How the header sits see-through over a page's navy opening: the attribute a page asks for it with, the attribute it wears while at the top, and how far the page scrolls before it turns solid
 */
export const HEADER_BAND = {
  SELECTOR: "[data-brand-band]",
  OVER_BRAND: "data-over-brand",
  SCROLL_LIMIT: 1,
} as const;
