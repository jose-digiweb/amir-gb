/**
 * The {@link RICH_TEXT_HEADING_LEVEL} constant
 * @description The level each editor heading takes in the page: one under the page's own h1, never past h6
 */
export const RICH_TEXT_HEADING_LEVEL = {
  h1: 2,
  h2: 3,
  h3: 4,
  h4: 5,
  h5: 6,
  h6: 6,
} as const;

/**
 * The {@link TEXT_ALIGN} constant
 * @description The alignments the editor can give a heading besides the default left
 */
export const TEXT_ALIGN = {
  CENTER: "center",
  RIGHT: "right",
} as const;
