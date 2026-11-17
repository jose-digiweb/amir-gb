/**
 * The {@link OPENER_SEPARATOR} constant
 * @description What separates the items of an opener label that lists several, such as its languages
 */
export const OPENER_SEPARATOR = " · ";

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

/**
 * The {@link WOVEN_DEFS} constant
 * @description The ids of the woven beads that a page's drawings reuse
 */
export const WOVEN_DEFS = {
  SOLID: "woven-bead-solid",
  RINGED: "woven-bead-ringed",
  NESTED_LOZENGE: "woven-nested-lozenge",
} as const;

/**
 * The {@link NESTED_LOZENGE_HREF} constant
 * @description Where a drawing points to reuse the nested lozenge, drawn once per page
 */
export const NESTED_LOZENGE_HREF = `#${WOVEN_DEFS.NESTED_LOZENGE}`;

/**
 * The {@link DECOR_TONE} constant
 * @description The grounds a scattered decoration sits on: a light section, or the navy band
 */
export const DECOR_TONE = {
  LIGHT: "light",
  ON_BRAND: "on-brand",
} as const;

/**
 * The {@link DOT_PATCH} constant
 * @description The faint dot patch behind a section's content: the dot's radius and the grid step in SVG units, and where its fade starts
 */
export const DOT_PATCH = {
  RADIUS: 1.6,
  STEP: 14,
  FADE_FROM: 0.3,
} as const;
