// Dependencies
import { INTL_LOCALE } from "../../i18n/constants";
import { getTranslations } from "../../i18n/helpers";
import {
  CONTENTS_HEADING_DEPTH,
  ISO_DAY_LENGTH,
  PRIVACY_PROMISES,
  UPDATED_DATE_FORMAT,
} from "./constants";

// Types
import type { MarkdownHeading } from "astro";
import type { Locale } from "../../i18n/types";
import type { ContentsLink, PrivacyPromiseView } from "./types";

/**
 * The {@link getPromiseViews} helper
 * @description The opening's three promises with their copy in the page's language
 * @param {Locale} locale - The page's language
 * @returns {PrivacyPromiseView[]} The promises in order
 */
export function getPromiseViews(locale: Locale): PrivacyPromiseView[] {
  // Read each promise's title and text in the page's language
  const t = getTranslations(locale);
  return PRIVACY_PROMISES.map(({ promise, title, text }) => ({
    promise,
    title: t[title],
    text: t[text],
  }));
}

/**
 * The {@link getContentsLinks} helper
 * @description The links of On this page: one per section heading of the text, in order
 * @param {MarkdownHeading[]} headings - Every heading Astro found in the Markdown
 * @returns {ContentsLink[]} The anchor and heading of each section
 */
export function getContentsLinks(headings: MarkdownHeading[]): ContentsLink[] {
  // Keep only the headings that start a section
  return headings
    .filter((heading) => heading.depth === CONTENTS_HEADING_DEPTH)
    .map(({ slug, text }) => ({ slug, text }));
}

/**
 * The {@link formatUpdatedDate} helper
 * @description The date the text was last approved, written out in the page's language
 * @param {Date} date - The date from the Markdown file
 * @param {Locale} locale - The page's language
 * @returns {string} The day, month and year in words
 */
export function formatUpdatedDate(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], UPDATED_DATE_FORMAT).format(date);
}

/**
 * The {@link toIsoDay} helper
 * @description A date as year, month and day, for a `<time>` element's datetime
 * @param {Date} date - The date from the Markdown file
 * @returns {string} The date as YYYY-MM-DD
 */
export function toIsoDay(date: Date): string {
  return date.toISOString().slice(0, ISO_DAY_LENGTH);
}
