// Dependencies
import { getEntry } from "astro:content";
import { PRIVACY_COLLECTION, PRIVACY_ERROR } from "./constants";

// Types
import type { CollectionEntry } from "astro:content";
import type { Locale } from "../../i18n/types";

/**
 * The {@link getPrivacyEntry} query
 * @description The privacy text in the page's language, from its Markdown file; the build stops when one is missing
 * @param {Locale} locale - The page's language
 * @returns {Promise<CollectionEntry<"privacy">>} The entry, with its date and text
 */
export async function getPrivacyEntry(locale: Locale): Promise<CollectionEntry<"privacy">> {
  // Read the file named after the language
  const entry = await getEntry(PRIVACY_COLLECTION, locale);

  // A missing language is a mistake in the repo, so the build fails on it
  if (!entry) {
    throw new Error(`${PRIVACY_ERROR.MISSING_TEXT} ${locale}`);
  }

  // The text for this language
  return entry;
}
