// Dependencies
import { EVENT_TYPE, TILE_COLOUR } from "../content/constants";

/**
 * The {@link EVENT_TYPES} constant
 * @description The kinds of event in the order the filter chips and the legend show them
 */
export const EVENT_TYPES = [
  EVENT_TYPE.YOUTH,
  EVENT_TYPE.HELP,
  EVENT_TYPE.CULTURE,
  EVENT_TYPE.COMMUNITY,
] as const;

/**
 * The {@link EVENT_LANGUAGES} constant
 * @description The languages an event can be held in, stored in Dutch as EmDash's choices show them
 */
export const EVENT_LANGUAGES = ["nederlands", "engels", "kriol", "portugees"] as const;

/**
 * The {@link EVENTS_PARAM} constant
 * @description The query parameters the events pages read
 */
export const EVENTS_PARAM = {
  TYPE: "type",
  MONTH: "month",
  DAY: "day",
  YEAR: "year",
} as const;

/**
 * The {@link EVENTS_VIEW} constant
 * @description The two ways the events page shows what is coming: a list or a month calendar
 */
export const EVENTS_VIEW = {
  LIST: "list",
  CALENDAR: "calendar",
} as const;

/**
 * The {@link CALENDAR_ANCHOR} constant
 * @description The id of the month card, so a day or month link lands on the calendar, not the opening
 */
export const CALENDAR_ANCHOR = "calendar";

/**
 * The {@link DATE_PATTERN} constant
 * @description How a month, a day and a year are written in the address
 */
export const DATE_PATTERN = {
  MONTH: /^(\d{4})-(\d{2})$/,
  DAY: /^(\d{4})-(\d{2})-(\d{2})$/,
  YEAR: /^\d{4}$/,
} as const;

/**
 * The {@link EVENTS_LIMIT} constant
 * @description How many entries the events pages read and show
 */
export const EVENTS_LIMIT = {
  UPCOMING_READ: 100,
  MONTH_READ: 100,
  PAST_PREVIEW: 3,
  PAST_PREVIEW_READ: 6,
  PAST_READ: 200,
  OTHER: 3,
  OTHER_READ: 8,
  STORIES_READ: 24,
  ORBIT: 6,
  DAY_CHIPS: 3,
} as const;

/**
 * The {@link EVENT_TIME} constant
 * @description Time spans the events pages work with, in milliseconds
 */
export const EVENT_TIME = {
  ONLINE_LINK_LEAD: 3_600_000,
  RUNNING_MARGIN: 7 * 86_400_000,
} as const;

/**
 * The {@link SHARE_URL} constant
 * @description Where Open in maps and Share on WhatsApp send the visitor
 */
export const SHARE_URL = {
  MAPS: "https://www.google.com/maps/search/?api=1&query=",
  WHATSAPP: "https://wa.me/?text=",
} as const;

/**
 * The {@link ICS} constant
 * @description The parts of a calendar file (RFC 5545) the Add to calendar link serves
 */
export const ICS = {
  CONTENT_TYPE: "text/calendar; charset=utf-8",
  EXTENSION: ".ics",
  PRODUCT: "-//AMIR-GB//Events//NL",
  UID_DOMAIN: "amir-gb",
  LINE_BREAK: "\r\n",
  LINE_OCTETS: 75,
} as const;

/**
 * The {@link EVENT_PHASE} constant
 * @description Whether an event is still to come or running, or has ended
 */
export const EVENT_PHASE = {
  UPCOMING: "upcoming",
  ENDED: "ended",
} as const;

/**
 * The {@link ONLINE_LINK} constant
 * @description How the page finds an online link waiting to show, and how long a page may wait for it
 */
export const ONLINE_LINK = {
  SELECTOR: "[data-online-from]",
  DATA_FROM: "onlineFrom",
  LONGEST_WAIT: 86_400_000,
} as const;

/**
 * The {@link EVENT_TYPE_TINT} constant
 * @description The tile tint of each kind of event, for the pictogram discs in the openings
 */
export const EVENT_TYPE_TINT = {
  [EVENT_TYPE.YOUTH]: TILE_COLOUR.NAVY,
  [EVENT_TYPE.HELP]: TILE_COLOUR.FOREST,
  [EVENT_TYPE.CULTURE]: TILE_COLOUR.BRICK,
  [EVENT_TYPE.COMMUNITY]: TILE_COLOUR.GOLD,
} as const;

/**
 * The {@link ARCHIVE_TIMELINE} constant
 * @description The archive opening's timeline: its first month, the one after AMIR-GB was founded in July 2026, how many recent months it shows and how many events hang from a month
 */
export const ARCHIVE_TIMELINE = {
  FIRST_MONTH: { year: 2026, month: 8 },
  MONTHS: 4,
  KNOTS: 5,
} as const;

/**
 * The {@link WEEKLY_NEXT} constant
 * @description How a weekly activity's next date is worked out: read at noon so the time zone never moves it to another day, and the clock format today's time is compared in
 */
export const WEEKLY_NEXT = {
  NOON_HOUR: 12,
  CLOCK_LOCALE: "en-GB",
  DAYS_IN_WEEK: 7,
} as const;

/**
 * The {@link WEEKDAY_STYLE} constant
 * @description How a weekly activity's next date writes its weekday: in full, or short on a phone
 */
export const WEEKDAY_STYLE = {
  LONG: "long",
  SHORT: "short",
} as const;
