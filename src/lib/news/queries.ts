// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { getEmDashCollection, getEmDashEntry } from "emdash";
import { DEFAULT_LOCALE, LOCALES } from "../../i18n/constants";
import { ROUTE } from "../../site/constants";
import { COLLECTION, CONTENT_STATUS, FIELD, SORT } from "../content/constants";
import { mergeWithDutch } from "../content/helpers";
import { NEWS_ARTICLE_READ, NEWS_READ_LIMIT } from "./constants";
import { compareNewest, getGalleryImages, getMorePosts, planNewsList } from "./helpers";

// Types
import type { CacheHint, EntryResult, SelectedReferences } from "emdash";
import type { Event, Post } from "../../../emdash-env";
import type { Locale } from "../../i18n/types";
import type { ContentRead, Entry, TranslationMeta } from "../content/types";
import type { NewsArticleRead, NewsEvent, NewsFilter, NewsList, NewsPost } from "./types";

/**
 * The {@link EMPTY_READ} constant
 * @description A read with no posts, for a page that needs no Dutch posts besides its own
 */
const EMPTY_READ: ContentRead<Entry<"posts">> = { items: [], cacheHints: [] };

/**
 * The {@link readEveryPost} helper
 * @description Reads every published post in one language, a hundred at a time
 * @param {Locale} locale - The language to read
 * @returns {Promise<ContentRead<Entry<"posts">>>} The posts, with the cache hint of each read
 */
async function readEveryPost(locale: Locale): Promise<ContentRead<Entry<"posts">>> {
  const items: Entry<"posts">[] = [];
  const cacheHints: CacheHint[] = [];
  let cursor: string | undefined;

  // Follow EmDash's cursor until the last page
  do {
    const page = await getEmDashCollection<"posts", Post & TranslationMeta>(COLLECTION.POSTS, {
      status: CONTENT_STATUS.PUBLISHED,
      locale,
      orderBy: { [FIELD.PUBLISHED_AT]: SORT.DESC },
      limit: NEWS_READ_LIMIT,
      cursor,
    });

    // A failed read fails the page, so an empty list is never shown or cached by mistake
    if (page.error) {
      throw page.error;
    }
    items.push(...page.entries);
    cacheHints.push(page.cacheHint);
    cursor = page.nextCursor;
  } while (cursor);

  // Return everything read, with what purges it
  return { items, cacheHints };
}

/**
 * The {@link toNewsPost} helper
 * @description Shapes a post entry for the list and its cards
 * @param {Post & TranslationMeta} data - The entry's data
 * @param {Locale} locale - The page's language
 * @param {boolean} isDutchOnly - Whether it exists only in Dutch on a page in another language
 * @returns {NewsPost} The post as the cards show it
 */
function toNewsPost(data: Post & TranslationMeta, locale: Locale, isDutchOnly: boolean): NewsPost {
  return {
    id: data.translationGroup ?? data.id,
    href: getRelativeLocaleUrl(locale, `${ROUTE.NEWS}${data.slug ?? ""}/`),
    type: data.type,
    title: data.title,
    excerpt: data.excerpt,
    image: data.featured_image,
    publishedAt: data.publishedAt ?? data.createdAt,
    isDutchOnly,
  };
}

/**
 * The {@link readDutchPosts} helper
 * @description Reads the Dutch posts a page in another language adds to its own
 * @param {Locale} locale - The page's language
 * @returns {Promise<ContentRead<Entry<"posts">>>} Every Dutch post, or none on a Dutch page
 */
async function readDutchPosts(locale: Locale): Promise<ContentRead<Entry<"posts">>> {
  // A Dutch page has them already
  if (locale === DEFAULT_LOCALE) {
    return EMPTY_READ;
  }

  // Any other page reads them
  return readEveryPost(DEFAULT_LOCALE);
}

/**
 * The {@link readNewsPosts} helper
 * @description Reads every post in the page's language and, outside Dutch, the Dutch posts without a translation
 * @param {Locale} locale - The page's language
 * @returns {Promise<ContentRead<NewsPost>>} One post per translation group, newest first
 */
async function readNewsPosts(locale: Locale): Promise<ContentRead<NewsPost>> {
  // Read the page's language and, outside Dutch, the Dutch posts at the same time
  const [local, dutch] = await Promise.all([readEveryPost(locale), readDutchPosts(locale)]);

  // Shape both languages and order them by date together
  const posts = mergeWithDutch(local.items, dutch.items)
    .map(({ entry, isDutchOnly }) => toNewsPost(entry.data, locale, isDutchOnly))
    .toSorted(compareNewest);
  return { items: posts, cacheHints: [...local.cacheHints, ...dutch.cacheHints] };
}

/**
 * The {@link getNewsList} helper
 * @description Reads what the News list shows for a filter and a number of pages
 * @param {Locale} locale - The page's language
 * @param {NewsFilter} filter - The type the list is filtered to, or null
 * @param {number} page - How many pages the address asks for
 * @returns {Promise<NewsList>} The list's plan, its filter and its cache hints
 */
export async function getNewsList(
  locale: Locale,
  filter: NewsFilter,
  page: number,
): Promise<NewsList> {
  const { items, cacheHints } = await readNewsPosts(locale);

  // Plan the page from every post
  return { ...planNewsList(items, filter, page), filter, cacheHints };
}

/**
 * The {@link toNewsEvent} helper
 * @description Shapes the event an announcement is about for its link card
 * @param {Event} data - The event's data
 * @param {Locale} locale - The page's language
 * @returns {NewsEvent} The event as the card shows it
 */
function toNewsEvent(data: Event, locale: Locale): NewsEvent {
  return {
    href: getRelativeLocaleUrl(locale, `${ROUTE.EVENTS}${data.slug ?? ""}/`),
    title: data.title,
    startsAt: new Date(data.starts_at),
    endsAt: data.ends_at ? new Date(data.ends_at) : undefined,
    placeName: data.place_name,
    isOnline: Boolean(data.online_link),
    image: data.image,
  };
}

/**
 * The {@link PostEntryResult} type
 * @description A post read on its own, with the event it is about
 */
type PostEntryResult = EntryResult<
  Post & TranslationMeta,
  SelectedReferences<"posts", { event: true }>
>;

/**
 * The {@link readPostEntry} helper
 * @description Reads one post with its event in a language
 * @param {string} slug - The post's address name
 * @param {Locale} locale - The language to read
 * @returns {Promise<PostEntryResult>} The entry, or null when the language has none, with its cache hint
 */
async function readPostEntry(slug: string, locale: Locale): Promise<PostEntryResult> {
  const result = await getEmDashEntry<"posts", Post & TranslationMeta, { event: true }>(
    COLLECTION.POSTS,
    slug,
    { locale, references: { event: true } },
  );

  // A failed read fails the page, rather than answering Not found
  if (result.error) {
    throw result.error;
  }

  // Return the entry, or null when the language has none
  return result;
}

/**
 * The {@link readOtherLanguageEntry} helper
 * @description Reads a post by its address name in the site's other languages, Dutch first
 * @param {string} slug - The post's address name
 * @param {Locale} locale - The page's language, already read
 * @returns {Promise<PostEntryResult | null>} The first language that has it, or null
 */
async function readOtherLanguageEntry(
  slug: string,
  locale: Locale,
): Promise<PostEntryResult | null> {
  // Try each other language in the language list's order
  for (const other of LOCALES) {
    if (other === locale) {
      continue;
    }
    const result = await readPostEntry(slug, other);
    if (result.entry) {
      return result;
    }
  }

  // No language has the address
  return null;
}

/**
 * The {@link getNewsArticle} helper
 * @description Reads everything a post's page shows: the post in the page's language or in Dutch, its event and More from News
 * @param {Locale} locale - The page's language
 * @param {string} slug - The post's address name
 * @returns {Promise<NewsArticleRead>} The article, the address of its translation in the page's language, or nothing
 */
export async function getNewsArticle(locale: Locale, slug: string): Promise<NewsArticleRead> {
  const [local, list] = await Promise.all([readPostEntry(slug, locale), readNewsPosts(locale)]);
  let result: PostEntryResult | null = local;
  let isDutchOnly = Boolean(local.fallbackLocale && local.fallbackLocale !== locale);

  // An address from another language leads to the translation in this one, or shows the Dutch post
  if (!local.entry) {
    result = await readOtherLanguageEntry(slug, locale);
    const found = result?.entry;
    if (!found) {
      return { kind: NEWS_ARTICLE_READ.MISSING };
    }
    const group = found.data.translationGroup ?? found.data.id;
    const translation = list.items.find((post) => post.id === group && !post.isDutchOnly);
    if (translation) {
      return { kind: NEWS_ARTICLE_READ.MOVED, href: translation.href };
    }
    if (found.data.locale !== DEFAULT_LOCALE) {
      return { kind: NEWS_ARTICLE_READ.MISSING };
    }
    isDutchOnly = true;
  }

  // No post in either language is a missing page
  const entry = result?.entry;
  if (!result || !entry) {
    return { kind: NEWS_ARTICLE_READ.MISSING };
  }

  // The event an announcement is about, when it has one
  const eventEntry = entry.references?.event?.entries[0];
  let event: NewsEvent | undefined;
  if (eventEntry) {
    event = toNewsEvent(eventEntry.data, locale);
  }

  // Shape the post, its photos and the posts to read next
  const post = toNewsPost(entry.data, locale, isDutchOnly);
  return {
    kind: NEWS_ARTICLE_READ.ARTICLE,
    article: {
      post,
      content: entry.data.content,
      gallery: getGalleryImages(entry.data.gallery, entry.data.featured_image),
      boardNames: entry.data.board_names,
      event,
      more: getMorePosts(list.items, post.id),
      cacheHints: [local.cacheHint, result.cacheHint, ...list.cacheHints],
    },
  };
}
