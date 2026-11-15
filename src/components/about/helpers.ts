// Dependencies
import { getTranslations } from "../../i18n/helpers";
import { LEGAL } from "../../site/constants";
import { AIM_NUMBER_DIGITS, TAX_PLACEHOLDER } from "./constants";

// Types
import type { Locale } from "../../i18n/types";

/**
 * The {@link getAimNumber} helper
 * @description An aim's number as the list shows it, with a leading zero
 * @param {number} index - The aim's place in the list, from zero
 * @returns {string} For example "01"
 */
export function getAimNumber(index: number): string {
  return String(index + 1).padStart(AIM_NUMBER_DIGITS, "0");
}

/**
 * The {@link getInitials} helper
 * @description A person's initials for their portrait placeholder: the first letters of their first and last names
 * @param {string} name - Their full name
 * @returns {string} For example "CR" for Cesaltina Pereira dos Reis
 */
export function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  const first = words.at(0) ?? "";
  const last = words.at(-1) ?? "";

  // One name gives one letter, more give the first and the last
  if (words.length < 2) {
    return first.charAt(0);
  }
  return `${first.charAt(0)}${last.charAt(0)}`;
}

/**
 * The {@link getTaxStatusText} helper
 * @description The legal and tax status sentence in the page's language, with AMIR-GB's registration numbers
 * @param {Locale} locale - The page's language
 * @returns {string} The sentence
 */
export function getTaxStatusText(locale: Locale): string {
  return getTranslations(locale)
    ["about.taxText"].replace(TAX_PLACEHOLDER.KVK, LEGAL.KVK_NUMBER)
    .replace(TAX_PLACEHOLDER.RSIN, LEGAL.RSIN_NUMBER);
}
