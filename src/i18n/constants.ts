/**
 * The {@link LOCALE} constant
 * @description The site's languages, as Astro's i18n routing names them
 */
export const LOCALE = {
  NL: "nl",
  EN: "en",
  PT: "pt",
} as const;

/**
 * The {@link DEFAULT_LOCALE} constant
 * @description The language served at the root, without a prefix
 */
export const DEFAULT_LOCALE = LOCALE.NL;

/**
 * The {@link LOCALES} constant
 * @description Every language, in the order the language list shows them
 */
export const LOCALES = [LOCALE.NL, LOCALE.EN, LOCALE.PT] as const;

/**
 * The {@link LANGUAGES} constant
 * @description Each language's name in that language, and its short code
 */
export const LANGUAGES = {
  [LOCALE.NL]: { name: "Nederlands", code: "NL" },
  [LOCALE.EN]: { name: "English", code: "EN" },
  [LOCALE.PT]: { name: "Português", code: "PT" },
} as const;

/**
 * The {@link INTL_LOCALE} constant
 * @description Each language's locale for dates and numbers: British English and European Portuguese
 */
export const INTL_LOCALE = {
  [LOCALE.NL]: "nl-NL",
  [LOCALE.EN]: "en-GB",
  [LOCALE.PT]: "pt-PT",
} as const;
