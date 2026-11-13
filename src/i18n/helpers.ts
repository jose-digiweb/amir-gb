// Dependencies
import { DEFAULT_LOCALE, LOCALES } from "./constants";
import { TRANSLATIONS } from "./translations/constants";

// Types
import type { Locale, Translations } from "./types";

/**
 * The {@link isLocale} helper
 * @description Whether a value is one of the site's languages
 * @param {string | undefined} value - The value to check
 * @returns {boolean} True when the value is a language the site has
 */
export function isLocale(value: string | undefined): value is Locale {
  return LOCALES.some((locale) => locale === value);
}

/**
 * The {@link getLocale} helper
 * @description The page's language, from what Astro reports for the current route
 * @param {string | undefined} currentLocale - Astro.currentLocale
 * @returns {Locale} The page's language, or the default language when Astro reports none
 */
export function getLocale(currentLocale: string | undefined): Locale {
  // A language the site has is used as it is
  if (isLocale(currentLocale)) {
    return currentLocale;
  }

  // Anything else falls back to the default language
  return DEFAULT_LOCALE;
}

/**
 * The {@link getTranslations} helper
 * @description The interface copy for one language
 * @param {Locale} locale - The page's language
 * @returns {Translations} Every piece of interface copy in that language
 */
export function getTranslations(locale: Locale): Translations {
  return TRANSLATIONS[locale];
}

/**
 * The {@link getPagePath} helper
 * @description A page's path without its language prefix, so it can be linked in another language
 * @param {string} pathname - The current URL's pathname
 * @returns {string} The path as the default language serves it
 */
export function getPagePath(pathname: string): string {
  // Split the path into its segments
  const [first, ...rest] = pathname.split("/").filter(Boolean);

  // A prefixed language is dropped from the front
  if (isLocale(first) && first !== DEFAULT_LOCALE) {
    return `/${rest.join("/")}`;
  }

  // Any other path is already the default language's path
  return pathname;
}
