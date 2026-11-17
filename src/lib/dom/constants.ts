/**
 * The {@link COMMAND} constant
 * @description The invoker commands the site's dialogs use
 */
export const COMMAND = {
  SHOW_MODAL: "show-modal",
  CLOSE: "close",
} as const;

/**
 * The {@link FEATURE} constant
 * @description The properties that tell whether a browser has invoker commands and closedby
 */
export const FEATURE = {
  COMMAND: "command",
  CLOSED_BY: "closedBy",
} as const;

/**
 * The {@link SELECTOR} constant
 * @description The elements the dialog fallbacks look for
 */
export const SELECTOR = {
  COMMAND_BUTTON: "button[commandfor]",
  LIGHT_DISMISS_DIALOG: 'dialog[closedby="any"]',
  OPEN_DIALOG: "dialog[open]",
  OPEN_POPOVER: ":popover-open",
} as const;

/**
 * The {@link PAGE_EVENT} constant
 * @description The events a page's open layers and fallbacks listen for
 */
export const PAGE_EVENT = {
  CLICK: "click",
  CLOSE: "close",
  PAGE_HIDE: "pagehide",
} as const;

/**
 * The {@link ATTRIBUTE} constant
 * @description The attributes an invoker button carries
 */
export const ATTRIBUTE = {
  COMMAND: "command",
  COMMAND_FOR: "commandfor",
  EXPANDED: "aria-expanded",
} as const;

/**
 * The {@link ARIA_STATE} constant
 * @description The values an expanded state takes
 */
export const ARIA_STATE = {
  TRUE: "true",
  FALSE: "false",
} as const;

/**
 * The {@link COPY_OUTCOME} constant
 * @description How a copy button shows what happened: the data mark on its group, the status line screen readers hear, the words that line takes, and how long the mark stays
 */
export const COPY_OUTCOME = {
  COPIED: "copied",
  FAILED: "failed",
  STATUS: "[data-copy-status]",
  COPIED_TEXT: "copiedText",
  FAILED_TEXT: "failedText",
  RESET_MS: 3000,
} as const;
