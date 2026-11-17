// Dependencies
import { LINE_BREAKS, SUMMARY_SENTENCE } from "./constants";

// Types
import type { SummaryField, SummaryPart } from "./types";

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
 * The {@link listFieldLinks} helper
 * @description The fields still to fix as one sentence in the page's language, each name a link to its field, such as "Your name and your email."
 * @param {string} locale - The page's language
 * @param {SummaryField[]} fields - The fields, with their ids and their names as a sentence writes them
 * @returns {SummaryPart[]} The sentence's pieces, starting with a capital and ending with a full stop
 */
export function listFieldLinks(locale: string, fields: SummaryField[]): SummaryPart[] {
  const parts = new Intl.ListFormat(locale, { type: "conjunction" }).formatToParts(
    fields.map((field) => field.name),
  );
  const pieces: SummaryPart[] = [];
  let next = 0;

  for (const part of parts) {
    // A name links to its field, in order
    if (part.type === "element") {
      pieces.push({
        text: part.value,
        href: `${SUMMARY_SENTENCE.FRAGMENT}${fields[next]?.id ?? ""}`,
      });
      next += 1;
      // The words between stay plain
    } else {
      pieces.push({ text: part.value });
    }
  }

  // The sentence starts with a capital and ends with a full stop
  const first = pieces[0];
  if (first) {
    pieces[0] = {
      ...first,
      text: `${first.text.charAt(0).toLocaleUpperCase(locale)}${first.text.slice(1)}`,
    };
  }
  pieces.push({ text: SUMMARY_SENTENCE.FULL_STOP });
  return pieces;
}
