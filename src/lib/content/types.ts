// Types
import type { CacheHint } from "emdash";
import type { Post } from "../../../emdash-env";
import type { POST_TYPE, TILE_COLOUR, WEEKDAYS, WHATS_ON_STATE } from "./constants";

/**
 * The {@link TranslationMeta} type
 * @description The language fields EmDash adds to every entry's data
 */
export type TranslationMeta = {
  locale: string | null;
  translationGroup: string | null;
};

/**
 * The {@link Translated} type
 * @description An entry, or anything carrying entry data, with its language fields
 */
export type Translated = {
  data: TranslationMeta;
};

/**
 * The {@link MediaImage} type
 * @description An image field as EmDash returns it
 */
export type MediaImage = NonNullable<Post["featured_image"]>;

/**
 * The {@link PostType} type
 * @description One of the {@link POST_TYPE} values
 */
export type PostType = (typeof POST_TYPE)[keyof typeof POST_TYPE];

/**
 * The {@link TileColour} type
 * @description One of the {@link TILE_COLOUR} values
 */
export type TileColour = (typeof TILE_COLOUR)[keyof typeof TILE_COLOUR];

/**
 * The {@link Weekday} type
 * @description One of the {@link WEEKDAYS}
 */
export type Weekday = (typeof WEEKDAYS)[number];

/**
 * The {@link Localised} type
 * @description An entry with whether it exists only in Dutch on a page in another language
 */
export type Localised<T> = {
  entry: T;
  isDutchOnly: boolean;
};

/**
 * The {@link HomeEvent} type
 * @description An upcoming event as What's on shows it
 */
export type HomeEvent = {
  id: string;
  href: string;
  title: string;
  startsAt: Date;
  endsAt?: Date;
  placeName?: string;
  isOnline: boolean;
  image?: MediaImage;
  isDutchOnly: boolean;
};

/**
 * The {@link WeeklyActivity} type
 * @description A weekly activity as its tile shows it
 */
export type WeeklyActivity = {
  id: string;
  name: string;
  weekday: Weekday;
  startTime: string;
  endTime: string;
  tileColour: TileColour;
  isDutchOnly: boolean;
};

/**
 * The {@link HomeStory} type
 * @description A Story post as Life at AMIR shows it
 */
export type HomeStory = {
  id: string;
  href: string;
  title: string;
  excerpt?: string;
  image?: MediaImage;
  isDutchOnly: boolean;
};

/**
 * The {@link HomeAnnouncement} type
 * @description The urgent announcement the strip above the header shows
 */
export type HomeAnnouncement = {
  id: string;
  text: string;
  linkLabel?: string;
  href: string;
};

/**
 * The {@link WhatsOnState} type
 * @description One of the {@link WHATS_ON_STATE} values
 */
export type WhatsOnState = (typeof WHATS_ON_STATE)[keyof typeof WHATS_ON_STATE];

/**
 * The {@link WhatsOnPlan} type
 * @description How What's on fills its places, the weekly activities that fill the rest, and the desktop columns they use
 */
export type WhatsOnPlan = {
  state: WhatsOnState;
  weekly: WeeklyActivity[];
  columns: number;
  wideSpan: number;
};

/**
 * The {@link EventDay} type
 * @description An event's day as the date badge shows it
 */
export type EventDay = {
  day: string;
  month: string;
};

/**
 * The {@link HomeContent} type
 * @description Everything the home page reads from EmDash, with the hints that purge the cached page
 */
export type HomeContent = {
  events: HomeEvent[];
  activities: WeeklyActivity[];
  stories: HomeStory[];
  announcement?: HomeAnnouncement;
  cacheHints: CacheHint[];
};
