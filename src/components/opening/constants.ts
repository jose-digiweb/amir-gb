/**
 * The {@link CHIP_BOX} constant
 * @description The box a starred chip is centred in, wide enough for the longest label in any language
 */
export const CHIP_BOX = {
  WIDTH: 280,
  HEIGHT: 56,
} as const;

/**
 * The {@link STITCH_REVEAL} constant
 * @description How each gold thread sews itself in: its mask's stroke is this many times the thread's width, so the round caps are covered
 */
export const STITCH_REVEAL = {
  WIDTH_SCALE: 4,
} as const;

/**
 * The {@link JOINED_HANDS_WIDTHS} constant
 * @description The widths the joined hands are made in; every copy on a page shares them and one sizes value, so the page fetches one photo
 */
export const JOINED_HANDS_WIDTHS = [200, 300, 400, 480, 600] as const;

/**
 * The {@link LABEL_BOX} constant
 * @description The box a drawing's small label is centred in, wide enough for the longest founding date in any language
 */
export const LABEL_BOX = {
  WIDTH: 400,
  HEIGHT: 24,
} as const;
