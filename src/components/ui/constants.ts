/**
 * The {@link OPENER_TONE} constant
 * @description The grounds a section opener sits on: a light ground, or navy and photos
 */
export const OPENER_TONE = {
  LIGHT: "light",
  ON_BRAND: "on-brand",
} as const;

/**
 * The {@link BUTTON_TONE} constant
 * @description The main action in gold, the second action as an outline, and the outline on navy
 */
export const BUTTON_TONE = {
  PRIMARY: "primary",
  OUTLINE: "outline",
  OUTLINE_ON_BRAND: "outline-on-brand",
} as const;

/**
 * The {@link BUTTON_SIZE} constant
 * @description The main action's 56px height, or the 48px of a control in a bar
 */
export const BUTTON_SIZE = {
  LARGE: "large",
  COMPACT: "compact",
} as const;

/**
 * The {@link ICON_BUTTON_TONE} constant
 * @description A round icon control's ground: none, a quiet tint, the sunken surface, or navy
 */
export const ICON_BUTTON_TONE = {
  PLAIN: "plain",
  TINTED: "tinted",
  SUNKEN: "sunken",
  BRAND: "brand",
} as const;

/**
 * The {@link WOVEN_SHADE_TONE} constant
 * @description The grounds a section's woven corner sits on: a light section, or the navy band
 */
export const WOVEN_SHADE_TONE = {
  LIGHT: "light",
  ON_BRAND: "on-brand",
} as const;
