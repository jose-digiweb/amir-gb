// Dependencies
import { SITEMAP, XML_ESCAPES } from "./constants";
import { getLanguageAlternates, toAbsoluteUrl } from "./helpers";

// Types
import type { LanguageAlternate, LocalePath, SitemapEntry, SitemapUrl } from "./types";

/**
 * The {@link escapeXml} helper
 * @description Text written safely inside XML
 * @param {string} text - Any text
 * @returns {string} The text with XML's special characters as entities
 */
export function escapeXml(text: string): string {
  // Ampersands go first, so the entities written after them stay whole
  return Object.entries(XML_ESCAPES).reduce(
    (escaped, [character, entity]) => escaped.replaceAll(character, entity),
    text,
  );
}

/**
 * The {@link getPageSitemapUrls} helper
 * @description One sitemap address per page per language, each with all its language versions
 * @param {LocalePath[][]} pages - Each page's path in every language
 * @param {URL} site - The site's public address
 * @param {string} defaultLocale - The language search falls back to
 * @returns {SitemapUrl[]} Every page in every language
 */
export function getPageSitemapUrls(
  pages: LocalePath[][],
  site: URL,
  defaultLocale: string,
): SitemapUrl[] {
  return pages.flatMap((localePaths) => {
    const alternates = getLanguageAlternates(localePaths, site, defaultLocale);
    return localePaths.map(({ path }) => ({ loc: toAbsoluteUrl(path, site), alternates }));
  });
}

/**
 * The {@link getEntrySitemapUrls} helper
 * @description One sitemap address per published post or event in each of its languages, joined to its translations; entries an editor hid from search are left out
 * @param {SitemapEntry[]} entries - Every published entry in every language
 * @param {URL} site - The site's public address
 * @param {string} defaultLocale - The language search falls back to
 * @returns {SitemapUrl[]} The entries search may list
 */
export function getEntrySitemapUrls(
  entries: SitemapEntry[],
  site: URL,
  defaultLocale: string,
): SitemapUrl[] {
  const shown = entries.filter((entry) => !entry.isHidden);
  const groups = new Map<string, SitemapEntry[]>();

  // Gather each entry's translations by their shared group
  for (const entry of shown) {
    groups.set(entry.group, [...(groups.get(entry.group) ?? []), entry]);
  }

  // Each entry lists every translation in its group as its language versions
  return shown.map((entry) => {
    const translations = groups.get(entry.group) ?? [entry];
    const alternates = getLanguageAlternates(translations, site, defaultLocale);
    return { loc: toAbsoluteUrl(entry.path, site), lastmod: entry.lastmod, alternates };
  });
}

/**
 * The {@link renderAlternate} helper
 * @description One language version as a sitemap link
 * @param {LanguageAlternate} alternate - The language and its address
 * @returns {string} The xhtml:link line
 */
function renderAlternate(alternate: LanguageAlternate): string {
  return `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`;
}

/**
 * The {@link renderUrlset} helper
 * @description A sitemap of addresses, each with its language versions
 * @param {SitemapUrl[]} urls - The addresses
 * @returns {string} The sitemap's XML
 */
export function renderUrlset(urls: SitemapUrl[]): string {
  const lines = urls.flatMap((url) => [
    "  <url>",
    `    <loc>${escapeXml(url.loc)}</loc>`,
    ...(url.lastmod ? [`    <lastmod>${escapeXml(url.lastmod)}</lastmod>`] : []),
    ...url.alternates.map(renderAlternate),
    "  </url>",
  ]);

  // The urlset with the xhtml namespace the language links need
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="${SITEMAP.NAMESPACE}" xmlns:xhtml="${SITEMAP.XHTML_NAMESPACE}">`,
    ...lines,
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * The {@link renderSitemapIndex} helper
 * @description The index that points search engines at each of the site's sitemaps
 * @param {string[]} locations - Each sitemap's full address
 * @returns {string} The index's XML
 */
export function renderSitemapIndex(locations: string[]): string {
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="${SITEMAP.NAMESPACE}">`,
    ...locations.map((location) => `  <sitemap><loc>${escapeXml(location)}</loc></sitemap>`),
    "</sitemapindex>",
    "",
  ].join("\n");
}

/**
 * The {@link renderRobots} helper
 * @description robots.txt: everyone may read the site except EmDash's admin and API, with the sitemap's address
 * @param {string} sitemap - The sitemap index's full address
 * @param {string} privatePath - The path search engines stay out of
 * @returns {string} The file's text
 */
export function renderRobots(sitemap: string, privatePath: string): string {
  return [
    "User-agent: *",
    "Allow: /",
    `Disallow: ${privatePath}`,
    "",
    `Sitemap: ${sitemap}`,
    "",
  ].join("\n");
}
