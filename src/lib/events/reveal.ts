// Dependencies
import { ONLINE_LINK } from "./constants";

/**
 * The {@link revealOnlineLinks} helper
 * @description Shows each online link from an hour before its event, also on a page the edge cached earlier, at that moment when the page stays open, and on coming back to a page a sleeping phone or a hidden tab paused
 * @returns {void}
 */
export function revealOnlineLinks(): void {
  // Check now, and set a timer for each link due while the page is open
  showDueLinks(true);

  // Timers stop while a phone sleeps or a tab is hidden, so check again when the page shows
  document.addEventListener(ONLINE_LINK.VISIBILITY_CHANGE, () => {
    if (document.visibilityState === ONLINE_LINK.VISIBLE) {
      showDueLinks(false);
    }
  });
  window.addEventListener(ONLINE_LINK.PAGE_SHOW, () => showDueLinks(false));
}

/**
 * The {@link showDueLinks} helper
 * @description Shows each online link whose moment has come, and can set a timer for those due while the page is open
 * @param {boolean} isFirstCheck - Whether to set the timers, which only the first check does
 * @returns {void}
 */
function showDueLinks(isFirstCheck: boolean): void {
  for (const link of document.querySelectorAll<HTMLElement>(ONLINE_LINK.SELECTOR)) {
    const wait = Number(link.dataset[ONLINE_LINK.DATA_FROM]) - Date.now();

    // A link whose moment has come shows now
    if (wait <= 0) {
      link.hidden = false;
      continue;
    }

    // On the first check, a link due while the page is open shows at its moment
    if (isFirstCheck && wait < ONLINE_LINK.LONGEST_WAIT) {
      window.setTimeout(() => {
        link.hidden = false;
      }, wait);
    }
  }
}
