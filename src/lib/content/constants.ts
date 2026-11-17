/**
 * The {@link COLLECTION} constant
 * @description The EmDash collections the site reads
 */
export const COLLECTION = {
  POSTS: "posts",
  EVENTS: "events",
  ACTIVITIES: "activities",
} as const;

/**
 * The {@link CONTENT_STATUS} constant
 * @description The state of an entry the site shows: only what is published
 */
export const CONTENT_STATUS = {
  PUBLISHED: "published",
} as const;

/**
 * The {@link POST_TYPE} constant
 * @description The kinds of News post: a board announcement, news, or a story for Life at AMIR
 */
export const POST_TYPE = {
  ANNOUNCEMENT: "aankondiging",
  NEWS: "nieuws",
  STORY: "verhaal",
} as const;

/**
 * The {@link TILE_COLOUR} constant
 * @description The four help tints a weekly activity tile can wear
 */
export const TILE_COLOUR = {
  GOLD: "gold",
  FOREST: "forest",
  BRICK: "brick",
  NAVY: "navy",
} as const;

/**
 * The {@link WEEKDAYS} constant
 * @description The weekdays as EmDash stores them, in Dutch so editors pick a Dutch day, Monday first
 */
export const WEEKDAYS = [
  "maandag",
  "dinsdag",
  "woensdag",
  "donderdag",
  "vrijdag",
  "zaterdag",
  "zondag",
] as const;

/**
 * The {@link WEEKLY_TINTS} constant
 * @description The help tints weekly activity tiles take in turn, through the week
 */
export const WEEKLY_TINTS = [
  TILE_COLOUR.FOREST,
  TILE_COLOUR.GOLD,
  TILE_COLOUR.BRICK,
  TILE_COLOUR.NAVY,
] as const;

/**
 * The {@link CLOCK_TIME} constant
 * @description How an editor may write a time of day, 9:30 or 10.00, and the separator the site shows
 */
export const CLOCK_TIME = {
  PATTERN: /^(\d{1,2})[:.](\d{2})$/,
  SEPARATOR: ":",
} as const;

/**
 * The {@link FIELD} constant
 * @description The content fields the site filters, sorts and follows references on
 */
export const FIELD = {
  STARTS_AT: "starts_at",
  PUBLISHED_AT: "published_at",
  TYPE: "type",
  EVENT: "event",
} as const;

/**
 * The {@link EVENT_TYPE} constant
 * @description The kinds of event, as EmDash stores them, in Dutch so editors pick a Dutch word
 */
export const EVENT_TYPE = {
  YOUTH: "jeugd",
  HELP: "hulp",
  CULTURE: "cultuur",
  COMMUNITY: "gemeenschap",
} as const;

/**
 * The {@link EVENT_STATUS} constant
 * @description Whether an event goes ahead, moved to a new date or is cancelled, stored in Dutch as EmDash's select shows them to editors
 */
export const EVENT_STATUS = {
  ON: "gaat door",
  MOVED: "verplaatst",
  CANCELLED: "afgelast",
} as const;

/**
 * The {@link FOR_WHOM} constant
 * @description Who an event is for, stored in Dutch as EmDash's select shows it to editors
 */
export const FOR_WHOM = {
  EVERYONE: "iedereen",
  MEMBERS: "leden",
} as const;

/**
 * The {@link MEETING_READ} constant
 * @description How many upcoming community events to read per language when looking for the next general meeting; EmDash cannot filter on a tick, so this reads well past any month of events
 */
export const MEETING_READ = 50;

/**
 * The {@link SORT} constant
 * @description The directions a query can sort in
 */
export const SORT = {
  ASC: "asc",
  DESC: "desc",
} as const;

/**
 * The {@link HOME_LIMIT} constant
 * @description How many events and stories the home page shows at most, and how many to read per language before filtering
 */
export const HOME_LIMIT = {
  EVENTS: 4,
  EVENTS_READ: 8,
  STORIES: 7,
  STORIES_READ: 14,
  ANNOUNCEMENTS: 10,
} as const;

/**
 * The {@link CONTENT_CACHE} constant
 * @description How long the edge keeps a page that shows CMS content fresh, in seconds, then for how long it still serves it at once while a fresh copy renders in the background; publishing in EmDash purges it, and so does a deploy
 */
export const CONTENT_CACHE = {
  MAX_AGE: 3600,
  STALE_WHILE_REVALIDATE: 31_536_000,
} as const;

/**
 * The {@link DAY_MS} constant
 * @description One day in milliseconds, the margin the event query reads back so time zone offsets never hide an event
 */
export const DAY_MS = 86_400_000;

/**
 * The {@link SITE_TIME_ZONE} constant
 * @description The time zone every date on the site is shown in
 */
export const SITE_TIME_ZONE = "Europe/Amsterdam";

/**
 * The {@link WHATS_ON_STATE} constant
 * @description How What's on fills its places: a rail of events, two or three event cards, one featured event, or none yet
 */
export const WHATS_ON_STATE = {
  RAIL: "rail",
  CARDS: "cards",
  FEATURED: "featured",
  NONE: "none",
} as const;

/**
 * The {@link WHATS_ON_SLOTS} constant
 * @description The places What's on fills on desktop; weekly activities take the ones events leave
 */
export const WHATS_ON_SLOTS = {
  TOTAL: 4,
  WIDE: 2,
  RAIL_FROM: 4,
} as const;

/**
 * The {@link PHONE_ROW} constant
 * @description How the phone's What's on row fills: from three events the events fill it alone, and it needs two cards to be a row
 */
export const PHONE_ROW = {
  EVENTS_ALONE_FROM: 3,
  MIN_CARDS: 2,
} as const;
