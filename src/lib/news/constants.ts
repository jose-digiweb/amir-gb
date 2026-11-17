// Dependencies
import { POST_TYPE } from "../content/constants";

/**
 * The {@link NEWS_PAGE} constant
 * @description How many posts the list shows: the newest and six more at first, then six more per older page, so two and three columns both fill
 */
export const NEWS_PAGE = {
  FIRST: 7,
  MORE: 6,
} as const;

/**
 * The {@link NEWS_READ_LIMIT} constant
 * @description How many posts one query reads, the most EmDash returns at once
 */
export const NEWS_READ_LIMIT = 100;

/**
 * The {@link NEWS_PARAM} constant
 * @description The query string the list reads: the type it is filtered to and how many pages it shows
 */
export const NEWS_PARAM = {
  TYPE: "type",
  PAGE: "page",
} as const;

/**
 * The {@link NEWS_LIST_STATE} constant
 * @description What the list shows: posts, the message for a type with none, or the message before the first post
 */
export const NEWS_LIST_STATE = {
  POSTS: "posts",
  EMPTY_TYPE: "empty-type",
  EMPTY: "empty",
} as const;

/**
 * The {@link NEWS_COUNT} constant
 * @description How many posts More from News shows
 */
export const NEWS_COUNT = {
  MORE: 3,
} as const;

/**
 * The {@link POST_TYPES} constant
 * @description The post types in the order the filter shows them
 */
export const POST_TYPES = [POST_TYPE.ANNOUNCEMENT, POST_TYPE.NEWS, POST_TYPE.STORY] as const;

/**
 * The {@link POST_TYPE_COPY} constant
 * @description The translation keys of each type's tag, filter chip, empty list message and Dutch-only note
 */
export const POST_TYPE_COPY = {
  [POST_TYPE.ANNOUNCEMENT]: {
    tag: "news.tagAnnouncement",
    filter: "news.filterAnnouncements",
    noneTitle: "news.noneAnnouncementsTitle",
    noneText: "news.noneAnnouncementsText",
    dutchOnly: "news.dutchOnlyAnnouncement",
  },
  [POST_TYPE.NEWS]: {
    tag: "news.tagNews",
    filter: "news.filterNews",
    noneTitle: "news.noneNewsTitle",
    noneText: "news.noneNewsText",
    dutchOnly: "news.dutchOnlyNews",
  },
  [POST_TYPE.STORY]: {
    tag: "news.tagStory",
    filter: "news.filterStories",
    noneTitle: "news.noneStoriesTitle",
    noneText: "news.noneStoriesText",
    dutchOnly: "news.dutchOnlyStory",
  },
} as const;

/**
 * The {@link OLDER_POSTS} constant
 * @description The hooks the Show older posts script finds: the list, the opening's prints, the footer, the link, and each post's id
 */
export const OLDER_POSTS = {
  LIST: "[data-news-list]",
  PRINTS: "[data-news-prints]",
  FOOTER: "[data-older-posts]",
  LINK: "[data-older-posts-link]",
  ITEM: "[data-post-id]",
  ITEM_ID: "data-post-id",
  ANCHOR: "a",
  BUSY: "data-busy",
  CLICK: "click",
  HTML: "text/html",
} as const;

/**
 * The {@link COPY_LINK} constant
 * @description The hooks of the Copy link button and how long it says the link was copied, in milliseconds
 */
export const COPY_LINK = {
  GROUP: "[data-copy-share]",
  BUTTON: "[data-copy-link]",
  CLICK: "click",
} as const;

/**
 * The {@link NEWS_PLACEHOLDER} constant
 * @description Where a post's title goes in the copy of its page title
 */
export const NEWS_PLACEHOLDER = {
  TITLE: "{title}",
} as const;

/**
 * The {@link NEWS_ARTICLE_READ} constant
 * @description What reading a post's address finds: the post, its translation at another address, or nothing
 */
export const NEWS_ARTICLE_READ = {
  ARTICLE: "article",
  MOVED: "moved",
  MISSING: "missing",
} as const;
