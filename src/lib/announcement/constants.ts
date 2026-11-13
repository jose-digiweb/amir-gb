/**
 * The {@link ANNOUNCEMENT} constant
 * @description Where the strip's dismissal is remembered, and the strip's own id and data attributes
 */
export const ANNOUNCEMENT = {
  STORAGE_KEY: "amir-gb-announcement-dismissed",
  ELEMENT_ID: "announcement",
  ID_ATTRIBUTE: "data-announcement",
  DISMISS_SELECTOR: "[data-dismiss-announcement]",
  CLICK: "click",
} as const;
