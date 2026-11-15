// Dependencies
import { LINE_BREAKS } from "./constants";

/**
 * The {@link toOneLine} helper
 * @description Folds line breaks into spaces, so a name or an address can never start a new line in an email's headers
 * @param {string} value - The typed value
 * @returns {string} The value on one line
 */
export function toOneLine(value: string): string {
  return value.replace(LINE_BREAKS, " ");
}

/**
 * The {@link formatList} helper
 * @description Joins a few words into a list in the page's language, such as "translation and events"
 * @param {string} locale - The page's language
 * @param {string[]} items - The words
 * @returns {string} The list, with "and" before the last word
 */
export function formatList(locale: string, items: string[]): string {
  return new Intl.ListFormat(locale, { type: "conjunction" }).format(items);
}

/**
 * The {@link listFieldNames} helper
 * @description The fields still to fix as one sentence in the page's language, such as "Your name and your email."
 * @param {string} locale - The page's language
 * @param {string[]} names - The fields' names as a sentence writes them
 * @returns {string} The sentence, starting with a capital and ending with a full stop
 */
export function listFieldNames(locale: string, names: string[]): string {
  const sentence = formatList(locale, names);
  return `${sentence.charAt(0).toLocaleUpperCase(locale)}${sentence.slice(1)}.`;
}
