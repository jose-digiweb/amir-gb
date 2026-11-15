// Dependencies
import { EVENT_LANGUAGES } from "../constants";

// Types
import type { EventLanguage } from "../types";

/**
 * The {@link orderEventLanguages} helper
 * @description Puts an event's languages in the site's order (Dutch, English, Kriolu, Portuguese), whatever order the editor picked them in
 * @param {readonly EventLanguage[]} languages - The languages as stored
 * @returns {EventLanguage[]} The same languages in the site's order
 */
export function orderEventLanguages(languages: readonly EventLanguage[]): EventLanguage[] {
  // Keep the site's order, with only the languages the event has
  return EVENT_LANGUAGES.filter((language) => languages.includes(language));
}
