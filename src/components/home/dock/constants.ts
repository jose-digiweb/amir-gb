/**
 * The {@link HOME_DOCK} constant
 * @description How the phone's dock finds itself, the first screen and the footer's own WhatsApp and Call, and the attribute that shows it
 */
export const HOME_DOCK = {
  SELECTOR: "[data-home-dock]",
  OPENING_SELECTOR: "[data-home-opening]",
  FOOTER_SELECTOR: "[data-footer-talk]",
  SHOWN_ATTRIBUTE: "data-shown",
  FOCUS_IN: "focusin",
  FOCUS_OUT: "focusout",
} as const;

/**
 * The {@link KEYBOARDLESS_INPUTS} constant
 * @description The input types that open no keyboard on a phone, so the dock can stay while one has focus
 */
export const KEYBOARDLESS_INPUTS = ["radio", "checkbox", "button", "submit", "reset"] as const;
