// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { LANGUAGES, LOCALES } from "../i18n/constants";
import { getPagePath, getTranslations } from "../i18n/helpers";

// Types
import type { Locale } from "../i18n/types";
import type { LanguageLink, NavLink, PageLink } from "./types";

/**
 * The {@link getPageLinks} helper
 * @description Labels and addresses for a list of page links in the page's language
 * @param {readonly NavLink[]} links - The links to prepare
 * @param {Locale} locale - The page's language
 * @param {string} pathname - The current URL's pathname
 * @returns {PageLink[]} The links, with the current page marked
 */
export function getPageLinks(
  links: readonly NavLink[],
  locale: Locale,
  pathname: string,
): PageLink[] {
  const t = getTranslations(locale);
  const pagePath = withTrailingSlash(getPagePath(pathname));

  // Each link gets its copy, its address in this language and its current state
  return links.map((link) => ({
    label: t[link.label],
    href: getRelativeLocaleUrl(locale, link.route),
    isCurrent: pagePath === link.route,
  }));
}

/**
 * The {@link getLanguageLinks} helper
 * @description The current page in each of the site's languages
 * @param {Locale} locale - The page's language
 * @param {string} pathname - The current URL's pathname
 * @returns {LanguageLink[]} One link per language, the current one marked
 */
export function getLanguageLinks(locale: Locale, pathname: string): LanguageLink[] {
  const pagePath = getPagePath(pathname);

  // Each language links to the same page in that language
  return LOCALES.map((language) => ({
    locale: language,
    name: LANGUAGES[language].name,
    code: LANGUAGES[language].code,
    href: getRelativeLocaleUrl(language, pagePath),
    isCurrent: language === locale,
  }));
}

/**
 * The {@link withTrailingSlash} helper
 * @description A path ending in a slash, so it compares with the routes
 * @param {string} path - A pathname
 * @returns {string} The same path with one trailing slash
 */
function withTrailingSlash(path: string): string {
  // A path that already ends in a slash stays as it is
  if (path.endsWith("/")) {
    return path;
  }

  // Any other path gets one
  return `${path}/`;
}
