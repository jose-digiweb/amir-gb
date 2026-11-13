// Types
import type { LOCALES } from "./constants";
import type { en } from "./translations/en";

/**
 * The {@link Locale} type
 * @description One of the site's languages
 */
export type Locale = (typeof LOCALES)[number];

/**
 * The {@link TranslationKey} type
 * @description The name of one piece of interface copy
 */
export type TranslationKey = keyof typeof en;

/**
 * The {@link Translations} type
 * @description Every piece of interface copy in one language
 */
export type Translations = Record<TranslationKey, string>;
