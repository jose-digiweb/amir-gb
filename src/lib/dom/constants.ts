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
} as const;

/**
 * The {@link ATTRIBUTE} constant
 * @description The attributes an invoker button carries
 */
export const ATTRIBUTE = {
  COMMAND: "command",
  COMMAND_FOR: "commandfor",
} as const;
