// Dependencies
import { RICH_TEXT_HEADING_LEVEL } from "./constants";

// Types
import type { RichTextHeadingLevel, RichTextHeadingStyle } from "./types";

/**
 * The {@link isRichTextHeadingStyle} helper
 * @description Whether a block style is one of the editor's headings
 * @param {string | undefined} style - The block's style
 * @returns {boolean} True for h1 to h6
 */
function isRichTextHeadingStyle(style: string | undefined): style is RichTextHeadingStyle {
  return style !== undefined && Object.hasOwn(RICH_TEXT_HEADING_LEVEL, style);
}

/**
 * The {@link getRichTextHeadingLevel} helper
 * @description The level a heading from the editor takes in the page, one under the page title
 * @param {string | undefined} style - The block's style, such as h1
 * @returns {RichTextHeadingLevel} The heading level, from 2 to 6
 */
export function getRichTextHeadingLevel(style: string | undefined): RichTextHeadingLevel {
  // A style that names no heading reads as the editor's first heading
  if (!isRichTextHeadingStyle(style)) {
    return RICH_TEXT_HEADING_LEVEL.h1;
  }

  // Every heading moves one level under the page title
  return RICH_TEXT_HEADING_LEVEL[style];
}
