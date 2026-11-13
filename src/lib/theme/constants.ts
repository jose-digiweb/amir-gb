/**
 * The {@link THEME} constant
 * @description The appearance choices: follow the device, or always light, or always dark
 */
export const THEME = {
  AUTO: "auto",
  LIGHT: "light",
  DARK: "dark",
} as const;

/**
 * The {@link THEME_OVERRIDES} constant
 * @description The choices that override the device and are stored and set on the page
 */
export const THEME_OVERRIDES = [THEME.LIGHT, THEME.DARK] as const;

/**
 * The {@link THEME_STORAGE_KEY} constant
 * @description Where this device remembers the choice
 */
export const THEME_STORAGE_KEY = "amir-gb-theme";

/**
 * The {@link COLOR_SCHEME_AUTO} constant
 * @description The color-scheme meta content that follows the device
 */
export const COLOR_SCHEME_AUTO = "light dark";

/**
 * The {@link THEME_DATA} constant
 * @description The dataset key on html that holds a Light or Dark choice
 */
export const THEME_DATA = {
  THEME: "theme",
} as const;

/**
 * The {@link THEME_SWITCHING_ATTRIBUTE} constant
 * @description The attribute on html that pauses transitions while the theme switches
 */
export const THEME_SWITCHING_ATTRIBUTE = "data-theme-switching";

/**
 * The {@link THEME_KEY} constant
 * @description The key that picks a row and closes the appearance card
 */
export const THEME_KEY = {
  ENTER: "Enter",
} as const;

/**
 * The {@link THEME_SELECTOR} constant
 * @description The elements the theme script reads and updates
 */
export const THEME_SELECTOR = {
  COLOR_SCHEME_META: 'meta[name="color-scheme"]',
  INPUT: "input[data-theme-input]",
  LIST_ROW: "[data-theme-list-row]",
  POPOVER: "[popover]",
  OPEN_POPOVER: ":popover-open",
} as const;

/**
 * The {@link THEME_EVENT} constant
 * @description The events the theme script listens to
 */
export const THEME_EVENT = {
  CHANGE: "change",
  CLICK: "click",
  KEYDOWN: "keydown",
  PAGESHOW: "pageshow",
  STORAGE: "storage",
} as const;
