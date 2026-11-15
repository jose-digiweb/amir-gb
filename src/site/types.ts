// Types
import type { Locale, TranslationKey } from "../i18n/types";
import type { ANSWER_LANGUAGE, VALUE } from "./constants";

/**
 * The {@link NavLink} type
 * @description A link to one of the site's pages, labelled from the interface copy
 */
export type NavLink = {
  label: TranslationKey;
  route: string;
};

/**
 * The {@link SocialLink} type
 * @description One of AMIR-GB's social profiles and the path of its brand mark
 */
export type SocialLink = {
  name: string;
  href: string;
  path: string;
};

/**
 * The {@link PageLink} type
 * @description A link ready to render: its label, address and whether it is the current page
 */
export type PageLink = {
  label: string;
  href: string;
  isCurrent: boolean;
};

/**
 * The {@link LanguageLink} type
 * @description A link to the same page in one language
 */
export type LanguageLink = {
  locale: Locale;
  name: string;
  code: string;
  href: string;
  isCurrent: boolean;
};

/**
 * The {@link Value} type
 * @description One of the {@link VALUE} values
 */
export type Value = (typeof VALUE)[keyof typeof VALUE];

/**
 * The {@link AnswerLanguage} type
 * @description One of the {@link ANSWER_LANGUAGE} values
 */
export type AnswerLanguage = (typeof ANSWER_LANGUAGE)[keyof typeof ANSWER_LANGUAGE];

/**
 * The {@link ValueChip} type
 * @description One of AMIR-GB's values as a starred chip in an opening's drawing, placed by its centre
 */
export type ValueChip = {
  value: Value;
  x: number;
  y: number;
};

/**
 * The {@link LabelledChip} type
 * @description A starred chip with its label in the page's language, placed by its centre
 */
export type LabelledChip = {
  key: string;
  label: string;
  x: number;
  y: number;
};
