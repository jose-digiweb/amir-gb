// Dependencies
import { HEADER_BAND } from "./constants";

/**
 * The {@link followBrandBand} helper
 * @description Keeps the header see-through over a navy opening while the page is at the top, and solid once it scrolls
 * @returns {void}
 */
export function followBrandBand(): void {
  const header = document.querySelector<HTMLElement>(HEADER_BAND.SELECTOR);

  // Only a page that opens on navy asks for it
  if (!header) {
    return;
  }

  // Wear the attribute at the top of the page and drop it once the page scrolls
  const update = (): void => {
    const isAtTop = window.scrollY < HEADER_BAND.SCROLL_LIMIT;
    if (header.hasAttribute(HEADER_BAND.OVER_BRAND) !== isAtTop) {
      header.toggleAttribute(HEADER_BAND.OVER_BRAND, isAtTop);
    }
  };

  // Check now, for a page restored mid-way, and on every scroll
  update();
  window.addEventListener("scroll", update, { passive: true });
}
