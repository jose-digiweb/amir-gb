/**
 * The {@link RAIL} constant
 * @description How a phone swipe row and its page dots find each other, and the value that marks the current dot
 */
export const RAIL = {
  ROW_SELECTOR: "[data-rail]",
  ROW_ATTRIBUTE: "data-rail",
  DOTS_ATTRIBUTE: "data-rail-dots",
  CURRENT_ATTRIBUTE: "data-current",
  CURRENT: "true",
  SCROLL: "scroll",
} as const;
