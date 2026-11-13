// Dependencies
import { ANNOUNCEMENT } from "./constants";

/**
 * The {@link enableAnnouncementDismiss} helper
 * @description Lets the close button hide the strip and remember that this announcement was closed
 * @returns {void}
 */
export function enableAnnouncementDismiss(): void {
  const strip = document.getElementById(ANNOUNCEMENT.ELEMENT_ID);
  const button = strip?.querySelector<HTMLButtonElement>(ANNOUNCEMENT.DISMISS_SELECTOR);

  // Without a strip there is nothing to close
  if (!strip || !button) {
    return;
  }

  // Closing hides the strip now and remembers its announcement
  button.addEventListener(ANNOUNCEMENT.CLICK, () => {
    strip.hidden = true;
    rememberDismissal(strip.getAttribute(ANNOUNCEMENT.ID_ATTRIBUTE) ?? "");
  });
}

/**
 * The {@link rememberDismissal} helper
 * @description Stores the closed announcement's id; blocked storage only means it shows again next time
 * @param {string} id - The announcement's id
 * @returns {void}
 */
function rememberDismissal(id: string): void {
  // Storage can be blocked; the strip stays hidden on this page anyway
  try {
    localStorage.setItem(ANNOUNCEMENT.STORAGE_KEY, id);
  } catch {
    return;
  }
}
