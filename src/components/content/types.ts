// Types
import type { RICH_TEXT_HEADING_LEVEL } from "./constants";

/**
 * The {@link RichTextHeadingStyle} type
 * @description A heading style the editor writes, h1 to h6
 */
export type RichTextHeadingStyle = keyof typeof RICH_TEXT_HEADING_LEVEL;

/**
 * The {@link RichTextHeadingLevel} type
 * @description The level a heading takes in the page, 2 to 6
 */
export type RichTextHeadingLevel = (typeof RICH_TEXT_HEADING_LEVEL)[RichTextHeadingStyle];
