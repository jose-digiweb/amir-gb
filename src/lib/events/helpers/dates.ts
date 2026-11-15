// Dependencies
import { SITE_TIME_ZONE } from "../../content/constants";
import { EVENT_STATUS } from "../../content/constants";
import { EVENT_PHASE } from "../constants";

// Types
import type { EventDetail, EventItem, EventPhase } from "../types";

/**
 * The {@link DAY_KEY_FORMAT} constant
 * @description Writes a moment as its calendar day in Dutch time, YYYY-MM-DD
 */
const DAY_KEY_FORMAT = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: SITE_TIME_ZONE,
});

/**
 * The {@link getDayKey} helper
 * @description The calendar day a moment falls on in Dutch time
 * @param {Date} date - The moment
 * @returns {string} The day as YYYY-MM-DD
 */
export function getDayKey(date: Date): string {
  return DAY_KEY_FORMAT.format(date);
}

/**
 * The {@link getMonthKey} helper
 * @description The month a day belongs to
 * @param {string} dayKey - The day as YYYY-MM-DD
 * @returns {string} The month as YYYY-MM
 */
export function getMonthKey(dayKey: string): string {
  return dayKey.slice(0, 7);
}

/**
 * The {@link capitalise} helper
 * @description Starts a phrase with a capital, as a heading or a date line does in every language
 * @param {string} text - The phrase
 * @returns {string} The phrase with a capital first letter
 */
export function capitalise(text: string): string {
  return `${text.charAt(0).toLocaleUpperCase()}${text.slice(1)}`;
}

/**
 * The {@link getEventPhase} helper
 * @description Whether an event is still to come or running, or has ended; one without an end ends when it starts
 * @param {Pick<EventItem, "startsAt" | "endsAt">} event - The event's start and end
 * @param {Date} now - The moment the page renders
 * @returns {EventPhase} Upcoming or ended
 */
export function getEventPhase(
  event: Pick<EventItem, "startsAt" | "endsAt">,
  now: Date,
): EventPhase {
  const end = event.endsAt ?? event.startsAt;
  // An event whose end has passed is over
  if (end < now) {
    return EVENT_PHASE.ENDED;
  }
  // Anything else is still to come, or running
  return EVENT_PHASE.UPCOMING;
}

/**
 * The {@link formatInSiteTime} helper
 * @description Formats a moment in Dutch time in the page's language
 * @param {Date} date - The moment
 * @param {string} locale - The page's language
 * @param {Intl.DateTimeFormatOptions} options - What to show
 * @returns {string} The formatted moment
 */
function formatInSiteTime(date: Date, locale: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: SITE_TIME_ZONE }).format(date);
}

/**
 * The {@link getLongDate} helper
 * @description An event's weekday and full date, for its facts card
 * @param {Date} date - When the event starts
 * @param {string} locale - The page's language
 * @returns {string} For example "Saturday 21 November 2026"
 */
export function getLongDate(date: Date, locale: string): string {
  const text = formatInSiteTime(date, locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Drop the comma English puts after the weekday, and lead with a capital
  return capitalise(text.replace(",", ""));
}

/**
 * The {@link getDayHeading} helper
 * @description A picked day as the calendar's label shows it, in capitals
 * @param {Date} date - A moment on that day
 * @param {string} locale - The page's language
 * @returns {string} For example "SATURDAY 21 NOVEMBER"
 */
export function getDayHeading(date: Date, locale: string): string {
  const text = formatInSiteTime(date, locale, { weekday: "long", day: "numeric", month: "long" });
  // Labels are written in capitals, without the comma some languages add
  return text.replace(",", "").toLocaleUpperCase(locale);
}

/**
 * The {@link getShortDate} helper
 * @description A day and short month, for a row that already shows the time
 * @param {Date} date - When the event starts
 * @param {string} locale - The page's language
 * @returns {string} For example "27 Nov"
 */
export function getShortDate(date: Date, locale: string): string {
  return formatInSiteTime(date, locale, { day: "numeric", month: "short" }).replace(".", "");
}

/**
 * The {@link getArchiveDate} helper
 * @description A past event's short weekday and date with the year
 * @param {Date} date - When the event started
 * @param {string} locale - The page's language
 * @returns {string} For example "Fri 30 Oct 2026"
 */
export function getArchiveDate(date: Date, locale: string): string {
  const text = formatInSiteTime(date, locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  // Drop the commas and dots some languages add, and lead with a capital
  return capitalise(text.replaceAll(",", "").replaceAll(".", ""));
}

/**
 * The {@link getShortWeekday} helper
 * @description An event's short weekday, for the list's meta line
 * @param {Date} date - When the event starts
 * @param {string} locale - The page's language
 * @returns {string} For example "Fri"
 */
export function getShortWeekday(date: Date, locale: string): string {
  const text = formatInSiteTime(date, locale, { weekday: "short" });
  // Drop the dot some languages add, and lead with a capital
  return capitalise(text.replace(".", ""));
}

/**
 * The {@link getClockTime} helper
 * @description A moment's time of day in Dutch time
 * @param {Date} date - The moment
 * @param {string} locale - The page's language
 * @returns {string} For example "14:30"
 */
export function getClockTime(date: Date, locale: string): string {
  return formatInSiteTime(date, locale, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

/**
 * The {@link getEventTimes} helper
 * @description An event's start and end times, or only its start when it has no end
 * @param {Pick<EventItem, "startsAt" | "endsAt">} event - The event's start and end
 * @param {string} locale - The page's language
 * @param {string} until - The word between the two times
 * @param {string} from - The phrase for a start alone, with {time} in it
 * @returns {string} For example "14:30 to 18:00", or "From 18:00"
 */
export function getEventTimes(
  event: Pick<EventItem, "startsAt" | "endsAt">,
  locale: string,
  until: string,
  from: string,
): string {
  const start = getClockTime(event.startsAt, locale);
  // Without an end only the start shows
  if (!event.endsAt) {
    return from.replace("{time}", start);
  }
  // With an end both times show
  return `${start} ${until} ${getClockTime(event.endsAt, locale)}`;
}

/**
 * The {@link getMonthName} helper
 * @description A month's name in the page's language, as it reads inside a sentence
 * @param {number} year - The year
 * @param {number} month - The month, from 1
 * @param {string} locale - The page's language
 * @returns {string} For example "november" in Dutch, "November" in English
 */
export function getMonthName(year: number, month: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
}

/**
 * The {@link getMonthMark} helper
 * @description A month's short name in capitals in the page's language, as the archive's timeline marks it
 * @param {number} year - The year
 * @param {number} month - The month, from 1
 * @param {string} locale - The page's language
 * @returns {string} For example "OKT" in Dutch, "OCT" in English
 */
export function getMonthMark(year: number, month: number, locale: string): string {
  const name = new Intl.DateTimeFormat(locale, { month: "short", timeZone: "UTC" }).format(
    new Date(Date.UTC(year, month - 1, 1)),
  );
  return name.replace(".", "").toLocaleUpperCase(locale);
}

/**
 * The {@link getMovedFromDate} helper
 * @description The date an event moved away from, written long, shown struck next to its new date
 * @param {Pick<EventDetail, "status" | "originalStartsAt">} event - The event's status and old start
 * @param {string} locale - The page's language
 * @returns {string | undefined} The old date, or none when the event did not move or the editor left it empty
 */
export function getMovedFromDate(
  event: Pick<EventDetail, "status" | "originalStartsAt">,
  locale: string,
): string | undefined {
  // Only a moved event with its old date has one to strike
  if (event.status !== EVENT_STATUS.MOVED || !event.originalStartsAt) {
    return undefined;
  }
  // Write it as the new date is written
  return getLongDate(event.originalStartsAt, locale);
}
