// Dependencies
import { LOCALE } from "../constants";
import { en } from "./en";
import { nl } from "./nl";
import { pt } from "./pt";

// Types
import type { Locale, Translations } from "../types";

/**
 * The {@link TRANSLATIONS} constant
 * @description The interface copy of every language, by language
 */
export const TRANSLATIONS = {
  [LOCALE.NL]: nl,
  [LOCALE.EN]: en,
  [LOCALE.PT]: pt,
} as const satisfies Record<Locale, Translations>;
