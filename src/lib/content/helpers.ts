// Dependencies
import {
  CLOCK_TIME,
  CONTENT_CACHE,
  SITE_TIME_ZONE,
  WEEKDAYS,
  WEEKLY_TINTS,
  WHATS_ON_SLOTS,
  WHATS_ON_STATE,
} from "./constants";

// Types
import type { AstroGlobal } from "astro";
import type { Translations } from "../../i18n/types";
import type { CacheHint } from "emdash";
import type {
  EventDay,
  HomeEvent,
  Localised,
  MediaImage,
  TileColour,
  Translated,
  Weekday,
  WeeklyActivity,
  WhatsOnPlan,
} from "./types";

/**
 * The {@link mergeWithDutch} helper
 * @description Keeps every entry in the page's language and adds the Dutch ones that have no translation into it
 * @param {T[]} local - The entries in the page's language
 * @param {T[]} dutch - The entries in Dutch
 * @returns {Localised<T>[]} One entry per translation group, the Dutch-only ones marked
 */
export function mergeWithDutch<T extends Translated>(local: T[], dutch: T[]): Localised<T>[] {
  const groups = new Set(local.map((entry) => entry.data.translationGroup));
  const merged = local.map((entry) => ({ entry, isDutchOnly: false }));

  // A Dutch entry joins only when its group has no entry in the page's language
  for (const entry of dutch) {
    if (!groups.has(entry.data.translationGroup)) {
      merged.push({ entry, isDutchOnly: true });
    }
  }

  // Return the page's own entries first, then the Dutch-only ones
  return merged;
}

/**
 * The {@link isStripActive} helper
 * @description Whether an announcement should still show as the strip above the header
 * @param {boolean | undefined} urgent - Whether the post is marked for the strip
 * @param {string | undefined} text - The strip's sentence
 * @param {string | undefined} until - When the strip stops showing, if ever
 * @param {Date} now - The moment the page renders
 * @returns {boolean} True while the strip should show
 */
export function isStripActive(
  urgent: boolean | undefined,
  text: string | undefined,
  until: string | undefined,
  now: Date,
): boolean {
  // A strip needs the mark and its own sentence
  if (!urgent || !text) {
    return false;
  }

  // Without an end it shows until the board removes the mark
  if (!until) {
    return true;
  }

  // Otherwise it shows until its end
  return new Date(until) > now;
}

/**
 * The {@link compareWeekly} helper
 * @description Orders weekly activities by weekday, Monday first, then by start time
 * @param {object} a - The first activity's weekday and start time
 * @param {object} b - The second activity's weekday and start time
 * @returns {number} Negative when a comes first
 */
export function compareWeekly(
  a: { weekday: Weekday; startTime: string },
  b: { weekday: Weekday; startTime: string },
): number {
  const byDay = WEEKDAYS.indexOf(a.weekday) - WEEKDAYS.indexOf(b.weekday);

  // Different days follow the week
  if (byDay !== 0) {
    return byDay;
  }

  // The same day follows the clock
  return a.startTime.localeCompare(b.startTime);
}

/**
 * The {@link toClockTime} helper
 * @description Writes a time an editor typed, such as 9:30 or 10.00, the way the site shows it
 * @param {string} text - The time as the editor typed it
 * @returns {string} The time as HH:MM, or the text unchanged when it is not a time
 */
export function toClockTime(text: string): string {
  const match = CLOCK_TIME.PATTERN.exec(text.trim());

  // Anything else stays as written, so nothing an editor typed is lost
  if (!match) {
    return text;
  }

  // Pad the hour and join the parts with the site's separator
  return `${match[1].padStart(2, "0")}${CLOCK_TIME.SEPARATOR}${match[2]}`;
}

/**
 * The {@link getWeeklyTint} helper
 * @description The help tint a weekly activity tile takes from its place in the week
 * @param {number} index - The activity's place in the week, from zero
 * @returns {TileColour} The tint, the four taking turns
 */
export function getWeeklyTint(index: number): TileColour {
  return WEEKLY_TINTS[index % WEEKLY_TINTS.length];
}

/**
 * The {@link planWhatsOn} helper
 * @description Decides how What's on fills its places, so a band with few events never looks broken
 * @param {HomeEvent[]} events - The upcoming events
 * @param {WeeklyActivity[]} activities - The weekly activities, Monday first
 * @returns {WhatsOnPlan} The state to show and the weekly activities that fill the places left
 */
export function planWhatsOn(events: HomeEvent[], activities: WeeklyActivity[]): WhatsOnPlan {
  const besideWide = WHATS_ON_SLOTS.TOTAL - WHATS_ON_SLOTS.WIDE;

  // Four or more events fill the band on their own
  if (events.length >= WHATS_ON_SLOTS.RAIL_FROM) {
    return { state: WHATS_ON_STATE.RAIL, weekly: [], columns: WHATS_ON_SLOTS.TOTAL, wideSpan: 0 };
  }

  // Two or three events take a place each, weekly activities the rest
  if (events.length > 1) {
    const weekly = activities.slice(0, WHATS_ON_SLOTS.TOTAL - events.length);
    return {
      state: WHATS_ON_STATE.CARDS,
      weekly,
      columns: events.length + weekly.length,
      wideSpan: 0,
    };
  }

  // One event, or the message when there is none, spans two places beside the weekly activities
  const weekly = activities.slice(0, besideWide);
  const state = events.length === 1 ? WHATS_ON_STATE.FEATURED : WHATS_ON_STATE.NONE;

  // Alone, it spans the whole band
  if (weekly.length === 0) {
    return { state, weekly, columns: 1, wideSpan: 1 };
  }

  // Beside weekly activities it takes two places
  return {
    state,
    weekly,
    columns: WHATS_ON_SLOTS.WIDE + weekly.length,
    wideSpan: WHATS_ON_SLOTS.WIDE,
  };
}

/**
 * The {@link getEventDay} helper
 * @description An event's day number and short month in the page's language, in Dutch time
 * @param {Date} date - When the event starts
 * @param {string} locale - The page's language
 * @returns {EventDay} The day and month for the date badge
 */
export function getEventDay(date: Date, locale: string): EventDay {
  const day = new Intl.DateTimeFormat(locale, { day: "numeric", timeZone: SITE_TIME_ZONE });
  const month = new Intl.DateTimeFormat(locale, { month: "short", timeZone: SITE_TIME_ZONE });

  // Format both parts in the site's time zone
  return { day: day.format(date), month: month.format(date).replace(".", "") };
}

/**
 * The {@link getEventWhen} helper
 * @description An event's weekday, date and times in the page's language, in Dutch time
 * @param {Date} start - When the event starts
 * @param {Date | undefined} end - When it ends, if known
 * @param {string} locale - The page's language
 * @param {string} until - The word between the two times
 * @returns {string} For example "Saturday 21 November · 14:30 to 18:00"
 */
export function getEventWhen(
  start: Date,
  end: Date | undefined,
  locale: string,
  until: string,
): string {
  const day = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: SITE_TIME_ZONE,
  }).format(start);
  const time = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: SITE_TIME_ZONE,
  });

  // Without an end only the start time shows
  if (!end) {
    return `${capitalise(day)} · ${time.format(start)}`;
  }

  // With an end both times show
  return `${capitalise(day)} · ${time.format(start)} ${until} ${time.format(end)}`;
}

/**
 * The {@link getEventMeta} helper
 * @description An event's when and where in one line, in the page's language and in Dutch time
 * @param {Pick<HomeEvent, "startsAt" | "endsAt" | "placeName" | "isOnline">} event - The event
 * @param {string} locale - The page's date locale
 * @param {Translations} t - The page's copy
 * @returns {string} For example "Saturday 21 November · 14:30 to 18:00 · Rotterdam and online"
 */
export function getEventMeta(
  event: Pick<HomeEvent, "startsAt" | "endsAt" | "placeName" | "isOnline">,
  locale: string,
  t: Translations,
): string {
  const when = getEventWhen(event.startsAt, event.endsAt, locale, t["weekly.until"]);
  const places: string[] = [];

  // The place, then online when it can be joined there
  if (event.placeName) {
    places.push(event.placeName);
  }
  if (event.isOnline) {
    places.push(t["events.online"]);
  }

  // Join when and where, leaving out what is unknown
  return [when, places.join(` ${t["events.and"]} `)].filter(Boolean).join(" · ");
}

/**
 * The {@link capitalise} helper
 * @description Starts a phrase with a capital, as a date line does in every language
 * @param {string} text - The phrase
 * @returns {string} The phrase with a capital first letter
 */
function capitalise(text: string): string {
  return `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`;
}

/**
 * The {@link cacheContentPage} helper
 * @description Caches a page that shows CMS content at the edge for a while and tags it so publishing in EmDash purges it
 * @param {AstroGlobal["cache"]} cache - The page route's cache, set before rendering starts so the headers carry it
 * @param {CacheHint[]} hints - The cache hints from the page's queries
 * @returns {void}
 */
export function cacheContentPage(
  cache: Pick<AstroGlobal["cache"], "enabled" | "set">,
  hints: CacheHint[],
): void {
  // Without a cache provider, as in development, there is nothing to set
  if (!cache.enabled) {
    return;
  }

  // Keep the page for a while, then tag it with everything it read
  cache.set({ maxAge: CONTENT_CACHE.MAX_AGE, swr: CONTENT_CACHE.STALE_WHILE_REVALIDATE });
  for (const hint of hints) {
    cache.set(hint);
  }
}

/**
 * The {@link toOptionalDate} helper
 * @description Reads a date field that an editor may leave empty
 * @param {string | undefined} value - The stored date, if any
 * @returns {Date | undefined} The date, or undefined when the field is empty
 */
export function toOptionalDate(value: string | undefined): Date | undefined {
  // An empty field has no date
  if (!value) {
    return undefined;
  }

  // A stored date is read as one
  return new Date(value);
}

/**
 * The {@link getPhotoAlt} helper
 * @description The text alternative of a CMS photo: a page's own lead photo says what it shows, a photo in a list leaves it to the link's words
 * @param {MediaImage | undefined} image - The photo, if there is one
 * @param {boolean} isDescribed - Whether the photo is the page's own lead photo
 * @returns {string} The editor's description, or an empty alt
 */
export function getPhotoAlt(image: MediaImage | undefined, isDescribed: boolean): string {
  // Only a lead photo with a description says what it shows
  if (isDescribed && image?.alt) {
    return image.alt;
  }

  // Any other photo is described by the link around it
  return "";
}
