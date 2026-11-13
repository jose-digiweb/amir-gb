// Types
import type { Locale, TranslationKey } from "../i18n/types";

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
