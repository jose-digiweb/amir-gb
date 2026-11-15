// Dependencies
import { ONLINE_LINK } from "./constants";

/**
 * The {@link revealOnlineLinks} helper
 * @description Shows each online link from an hour before its event, also on a page the edge cached earlier, and at that moment when the page stays open
 * @returns {void}
 */
export function revealOnlineLinks(): void {
  for (const link of document.querySelectorAll<HTMLElement>(ONLINE_LINK.SELECTOR)) {
    const wait = Number(link.dataset[ONLINE_LINK.DATA_FROM]) - Date.now();
    // A link whose moment has come shows now
    if (wait <= 0) {
      link.hidden = false;
      continue;
    }
    // A link due while the page is open shows at its moment
    if (wait < ONLINE_LINK.LONGEST_WAIT) {
      window.setTimeout(() => {
        link.hidden = false;
      }, wait);
    }
  }
}
