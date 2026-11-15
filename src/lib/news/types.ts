// Types
import type { CacheHint, PortableTextBlock } from "emdash";
import type { MediaImage, PostType } from "../content/types";
import type { NEWS_ARTICLE_READ, NEWS_LIST_STATE } from "./constants";

/**
 * The {@link NewsPost} type
 * @description A post as the list, its cards and More from News show it
 */
export type NewsPost = {
  id: string;
  href: string;
  type: PostType;
  title: string;
  excerpt?: string;
  image?: MediaImage;
  publishedAt: Date;
  isDutchOnly: boolean;
};

/**
 * The {@link NewsFilter} type
 * @description The type the list is filtered to, or null for every post
 */
export type NewsFilter = PostType | null;

/**
 * The {@link NewsListState} type
 * @description One of the {@link NEWS_LIST_STATE} values
 */
export type NewsListState = (typeof NEWS_LIST_STATE)[keyof typeof NEWS_LIST_STATE];

/**
 * The {@link NewsListPlan} type
 * @description What the list page shows: its state, the newest post, the rest, the story prints and whether older posts remain
 */
export type NewsListPlan = {
  state: NewsListState;
  featured?: NewsPost;
  posts: NewsPost[];
  pinned: MediaImage[];
  page: number;
  hasMore: boolean;
};

/**
 * The {@link NewsList} type
 * @description The list page's plan with the filter it shows and the hints that purge the cached page
 */
export type NewsList = NewsListPlan & {
  filter: NewsFilter;
  cacheHints: CacheHint[];
};

/**
 * The {@link NewsEvent} type
 * @description The event an announcement is about, as its link card shows it
 */
export type NewsEvent = {
  href: string;
  title: string;
  startsAt: Date;
  endsAt?: Date;
  placeName?: string;
  isOnline: boolean;
  image?: MediaImage;
};

/**
 * The {@link NewsArticle} type
 * @description Everything a post's page shows, with the hints that purge the cached page
 */
export type NewsArticle = {
  post: NewsPost;
  content?: PortableTextBlock[];
  gallery: MediaImage[];
  boardNames?: string;
  event?: NewsEvent;
  more: NewsPost[];
  cacheHints: CacheHint[];
};

/**
 * The {@link NewsArticleRead} type
 * @description What reading a post's address finds: the article, the address of its translation in the page's language, or nothing
 */
export type NewsArticleRead =
  | { kind: typeof NEWS_ARTICLE_READ.ARTICLE; article: NewsArticle }
  | { kind: typeof NEWS_ARTICLE_READ.MOVED; href: string }
  | { kind: typeof NEWS_ARTICLE_READ.MISSING };
