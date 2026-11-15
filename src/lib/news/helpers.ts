// Dependencies
import { SITE_TIME_ZONE } from "../content/constants";
import {
  COPY_LINK,
  NEWS_COUNT,
  NEWS_LIST_STATE,
  NEWS_PAGE,
  NEWS_PARAM,
  NEWS_PLACEHOLDER,
  OLDER_POSTS,
  POST_TYPES,
} from "./constants";

// Types
import type { MediaImage, PostType } from "../content/types";
import type { NewsFilter, NewsListPlan, NewsPost } from "./types";

/**
 * The {@link isPostType} helper
 * @description Whether a value is one of the post types
 * @param {string | null} value - The value to check
 * @returns {boolean} True for a post type
 */
export function isPostType(value: string | null): value is PostType {
  return POST_TYPES.some((type) => type === value);
}

/**
 * The {@link readNewsFilter} helper
 * @description The type the list is filtered to, from the address
 * @param {URLSearchParams} params - The address's query string
 * @returns {NewsFilter} The post type, or null for every post
 */
export function readNewsFilter(params: URLSearchParams): NewsFilter {
  const type = params.get(NEWS_PARAM.TYPE);

  // Anything that is not a post type shows every post
  if (!isPostType(type)) {
    return null;
  }

  // A post type filters the list
  return type;
}

/**
 * The {@link readNewsPage} helper
 * @description How many pages of posts the list shows, from the address
 * @param {URLSearchParams} params - The address's query string
 * @returns {number} A whole number from one
 */
export function readNewsPage(params: URLSearchParams): number {
  const page = Number(params.get(NEWS_PARAM.PAGE));

  // A missing, broken or too small number shows the first page
  if (!Number.isInteger(page) || page < 1) {
    return 1;
  }

  // Any other number is the page asked for
  return page;
}

/**
 * The {@link getNewsQuery} helper
 * @description The query string of the list filtered to a type and showing a number of pages
 * @param {NewsFilter} filter - The type, or null for every post
 * @param {number} page - How many pages it shows
 * @returns {string} The query string with its question mark, or nothing for the first page of every post
 */
export function getNewsQuery(filter: NewsFilter, page: number): string {
  const params = new URLSearchParams();

  // Only a filter and a later page go into the address
  if (filter) {
    params.set(NEWS_PARAM.TYPE, filter);
  }
  if (page > 1) {
    params.set(NEWS_PARAM.PAGE, String(page));
  }

  // The first page of every post is the plain address
  const query = params.toString();
  if (!query) {
    return "";
  }

  // Any other list carries its query
  return `?${query}`;
}

/**
 * The {@link getShownCount} helper
 * @description How many posts a number of pages shows
 * @param {number} page - How many pages the list shows
 * @returns {number} The newest post and the posts under it
 */
export function getShownCount(page: number): number {
  return NEWS_PAGE.FIRST + (page - 1) * NEWS_PAGE.MORE;
}

/**
 * The {@link getLastPage} helper
 * @description The page that shows the last post
 * @param {number} total - How many posts there are
 * @returns {number} The last page, at least one
 */
export function getLastPage(total: number): number {
  // Everything fits on the first page
  if (total <= NEWS_PAGE.FIRST) {
    return 1;
  }

  // Each older page adds its share
  return 1 + Math.ceil((total - NEWS_PAGE.FIRST) / NEWS_PAGE.MORE);
}

/**
 * The {@link compareNewest} helper
 * @description Orders posts newest first
 * @param {NewsPost} a - The first post
 * @param {NewsPost} b - The second post
 * @returns {number} Negative when a is newer
 */
export function compareNewest(a: NewsPost, b: NewsPost): number {
  return b.publishedAt.getTime() - a.publishedAt.getTime();
}

/**
 * The {@link planNewsList} helper
 * @description Decides what the list page shows for a filter and a number of pages
 * @param {NewsPost[]} posts - Every post, newest first
 * @param {NewsFilter} filter - The type the list is filtered to, or null
 * @param {number} page - How many pages the address asks for
 * @returns {NewsListPlan} The state, the newest post, the rest and whether older posts remain
 */
export function planNewsList(posts: NewsPost[], filter: NewsFilter, page: number): NewsListPlan {
  // Before the first post there is only the message
  if (posts.length === 0) {
    return { state: NEWS_LIST_STATE.EMPTY, posts: [], page: 1, hasMore: false };
  }

  // A type with no posts shows its own message
  const matching = posts.filter((post) => !filter || post.type === filter);
  if (matching.length === 0) {
    return { state: NEWS_LIST_STATE.EMPTY_TYPE, posts: [], page: 1, hasMore: false };
  }

  // Show up to the page asked for, never past the last one
  const shownPage = Math.min(page, getLastPage(matching.length));
  const shown = matching.slice(0, getShownCount(shownPage));
  const [featured, ...rest] = shown;
  return {
    state: NEWS_LIST_STATE.POSTS,
    featured,
    posts: rest,
    page: shownPage,
    hasMore: matching.length > shown.length,
  };
}

/**
 * The {@link getMorePosts} helper
 * @description The newest posts other than the one being read, for More from News
 * @param {NewsPost[]} posts - Every post, newest first
 * @param {string} id - The post being read
 * @returns {NewsPost[]} Up to three posts
 */
export function getMorePosts(posts: NewsPost[], id: string): NewsPost[] {
  return posts.filter((post) => post.id !== id).slice(0, NEWS_COUNT.MORE);
}

/**
 * The {@link getGalleryImages} helper
 * @description The photos from the day that have an image, without the post's own photo
 * @param {Array<{ image?: MediaImage }> | undefined} rows - The gallery's rows
 * @param {MediaImage | undefined} featured - The post's own photo
 * @returns {MediaImage[]} The photos to show, in the editor's order
 */
export function getGalleryImages(
  rows: Array<{ image?: MediaImage }> | undefined,
  featured: MediaImage | undefined,
): MediaImage[] {
  const images: MediaImage[] = [];

  // Keep each row with a photo that is not already the post's own
  for (const row of rows ?? []) {
    if (row.image && row.image.id !== featured?.id) {
      images.push(row.image);
    }
  }

  // Return them in order
  return images;
}

/**
 * The {@link getPostDay} helper
 * @description A post's day and month in the page's language, with the year only when it is not this year
 * @param {Date} date - When the post was published
 * @param {string} locale - The page's date locale
 * @param {Date} now - The moment the page renders
 * @returns {string} For example "14 November"
 */
export function getPostDay(date: Date, locale: string, now: Date): string {
  const year = new Intl.DateTimeFormat(locale, { year: "numeric", timeZone: SITE_TIME_ZONE });

  // A post from an earlier year says which year
  if (year.format(date) !== year.format(now)) {
    return getPostDate(date, locale);
  }

  // A post from this year shows its day and month
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: SITE_TIME_ZONE,
  }).format(date);
}

/**
 * The {@link getPostDate} helper
 * @description A post's full date in the page's language, in Dutch time
 * @param {Date} date - When the post was published
 * @param {string} locale - The page's date locale
 * @returns {string} For example "8 November 2026"
 */
export function getPostDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: SITE_TIME_ZONE,
  }).format(date);
}

/**
 * The {@link fillPostTitle} helper
 * @description Puts a post's title into the copy of its page title
 * @param {string} template - The copy with the title placeholder
 * @param {string} title - The post's title
 * @returns {string} For example "Independence Day in Rotterdam · AMIR-GB"
 */
export function fillPostTitle(template: string, title: string): string {
  return template.replace(NEWS_PLACEHOLDER.TITLE, title);
}

/**
 * The {@link enableOlderPosts} helper
 * @description Makes Show older posts add the next posts in place, resting as Loading older posts until they arrive
 * @returns {void}
 */
export function enableOlderPosts(): void {
  const list = document.querySelector<HTMLElement>(OLDER_POSTS.LIST);
  const footer = document.querySelector<HTMLElement>(OLDER_POSTS.FOOTER);

  // A page without older posts has nothing to enhance
  if (!list || !footer) {
    return;
  }

  // Each press on the link loads the next page in place
  footer.addEventListener(OLDER_POSTS.CLICK, (event) => {
    // A press anywhere else in the footer is not for the script
    if (!(event.target instanceof Element)) {
      return;
    }
    const link = event.target.closest<HTMLAnchorElement>(OLDER_POSTS.LINK);
    if (!link) {
      return;
    }

    // A press while the next page loads does nothing more
    event.preventDefault();
    if (footer.hasAttribute(OLDER_POSTS.BUSY)) {
      return;
    }

    // Any other press loads the next page
    void loadOlderPosts(list, footer, link.href);
  });
}

/**
 * The {@link loadOlderPosts} helper
 * @description Fetches the next page, adds the posts the list does not have yet and takes over its footer
 * @param {HTMLElement} list - The list of posts
 * @param {HTMLElement} footer - The footer with Show older posts
 * @param {string} href - The next page's address
 * @returns {Promise<void>}
 */
async function loadOlderPosts(list: HTMLElement, footer: HTMLElement, href: string): Promise<void> {
  footer.setAttribute(OLDER_POSTS.BUSY, "");

  // Add the next page's new posts, take its footer and prints, move focus on and keep the address
  try {
    const response = await fetch(href);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const page = new DOMParser().parseFromString(await response.text(), OLDER_POSTS.HTML);
    const shown = new Set(
      [...list.querySelectorAll(OLDER_POSTS.ITEM)].map((item) =>
        item.getAttribute(OLDER_POSTS.ITEM_ID),
      ),
    );
    const added = [
      ...page.querySelectorAll<HTMLElement>(`${OLDER_POSTS.LIST} ${OLDER_POSTS.ITEM}`),
    ].filter((item) => !shown.has(item.getAttribute(OLDER_POSTS.ITEM_ID)));
    for (const item of added) {
      list.appendChild(item);
    }
    footer.replaceChildren(...(page.querySelector(OLDER_POSTS.FOOTER)?.childNodes ?? []));
    document
      .querySelector(OLDER_POSTS.PRINTS)
      ?.replaceChildren(...(page.querySelector(OLDER_POSTS.PRINTS)?.childNodes ?? []));
    focusAfterLoad(added, footer);
    history.replaceState(history.state, "", href);
  } catch {
    // A failed load opens the next page itself, which works without the script too
    window.location.assign(href);
  }

  // The footer rests again with what the next page offers
  footer.removeAttribute(OLDER_POSTS.BUSY);
}

/**
 * The {@link focusAfterLoad} helper
 * @description Moves focus to the first post just added, or back to the footer's link when none was new
 * @param {HTMLElement[]} added - The posts just added
 * @param {HTMLElement} footer - The footer with its new content
 * @returns {void}
 */
function focusAfterLoad(added: HTMLElement[], footer: HTMLElement): void {
  const first = added[0]?.querySelector<HTMLAnchorElement>(OLDER_POSTS.ANCHOR);

  // The first new post takes focus, where reading carries on
  if (first) {
    first.focus();
    return;
  }

  // Without new posts the footer's link keeps it, so focus never drops to the page
  footer.querySelector<HTMLAnchorElement>(OLDER_POSTS.LINK)?.focus();
}

/**
 * The {@link enableCopyLink} helper
 * @description Makes Copy link copy the page's address and say so for a few seconds
 * @returns {void}
 */
export function enableCopyLink(): void {
  for (const button of document.querySelectorAll<HTMLButtonElement>(COPY_LINK.BUTTON)) {
    button.addEventListener(COPY_LINK.CLICK, () => copyLink(button));
  }
}

/**
 * The {@link copyLink} helper
 * @description Copies the page's address and marks the button copied until the reset
 * @param {HTMLButtonElement} button - The Copy link button
 * @returns {Promise<void>}
 */
async function copyLink(button: HTMLButtonElement): Promise<void> {
  // A blocked clipboard leaves the button as it was; the address bar still has the link
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch {
    return;
  }

  // Say it was copied, then rest again
  button.setAttribute(COPY_LINK.COPIED, "");
  window.setTimeout(() => button.removeAttribute(COPY_LINK.COPIED), COPY_LINK.RESET_MS);
}
