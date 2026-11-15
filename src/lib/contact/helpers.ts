// Dependencies
import {
  CONTACT_ERROR,
  CONTACT_PLACEHOLDER,
  CONTACT_LIMIT,
  OPENING_HOURS,
  OPENING_STATUS,
  OPENING_TIME_ZONE,
  REACH_PATTERN,
} from "./constants";

// Types
import type { ContactError, ContactErrors, ContactValues, OpeningStatus } from "./types";

/**
 * The {@link WEEKDAY_INDEX} constant
 * @description The weekday names Intl writes in English, by their number (0 is Sunday)
 */
const WEEKDAY_INDEX: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

/**
 * The {@link MINUTES_PER_HOUR} constant
 * @description Minutes in an hour, to turn "08:00" into minutes after midnight
 */
const MINUTES_PER_HOUR = 60;

/**
 * The {@link DAYS_PER_WEEK} constant
 * @description The days a week of opening hours repeats over
 */
const DAYS_PER_WEEK = 7;

/**
 * The {@link isEmailLike} helper
 * @description Whether what the visitor typed to be reached at is meant as an email address
 * @param {string} reach - The email address or phone number
 * @returns {boolean} True when it holds an @
 */
export function isEmailLike(reach: string): boolean {
  return reach.includes(REACH_PATTERN.AT);
}

/**
 * The {@link checkReach} helper
 * @description What is wrong with an email address or phone number, if anything
 * @param {string} reach - The email address or phone number, trimmed
 * @returns {ContactError | undefined} The error, or undefined when it can be used
 */
export function checkReach(reach: string): ContactError | undefined {
  // Nothing typed
  if (!reach) {
    return CONTACT_ERROR.REACH_MISSING;
  }

  // An email address needs a name, an @ and a domain with a dot
  if (isEmailLike(reach)) {
    if (REACH_PATTERN.EMAIL.test(reach)) {
      return undefined;
    }
    return CONTACT_ERROR.EMAIL_INCOMPLETE;
  }

  // A phone number is digits with spaces, dashes, brackets or a plus, and enough digits
  const digits = reach.match(REACH_PATTERN.DIGIT)?.length ?? 0;
  if (REACH_PATTERN.PHONE.test(reach) && digits >= CONTACT_LIMIT.PHONE_DIGITS) {
    return undefined;
  }
  return CONTACT_ERROR.REACH_INVALID;
}

/**
 * The {@link checkContactValues} helper
 * @description Everything that keeps a message from being sent, by field
 * @param {ContactValues} values - The message as typed, trimmed
 * @returns {ContactErrors} The errors; empty when the message can be sent
 */
export function checkContactValues(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  // A name to answer
  if (!values.name) {
    errors.name = CONTACT_ERROR.NAME_MISSING;
  }

  // A way to answer
  const reachError = checkReach(values.reach);
  if (reachError) {
    errors.reach = reachError;
  }

  // Something to answer
  if (!values.message) {
    errors.message = CONTACT_ERROR.MESSAGE_MISSING;
  }

  // Leave to use the details
  if (!values.consent) {
    errors.consent = CONTACT_ERROR.CONSENT_MISSING;
  }

  // Every error found
  return errors;
}

/**
 * The {@link toMinutes} helper
 * @description Minutes after midnight for a time written as HH:MM
 * @param {string} time - The time, such as 08:00
 * @returns {number} Minutes after midnight
 */
function toMinutes(time: string): number {
  const [hours = 0, minutes = 0] = time.split(":").map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
}

/**
 * The {@link getHoursFor} helper
 * @description The opening hours of one weekday
 * @param {number} weekday - The weekday, 0 being Sunday
 * @returns {(typeof OPENING_HOURS)[number] | undefined} Its hours, or undefined when closed all day
 */
function getHoursFor(weekday: number): (typeof OPENING_HOURS)[number] | undefined {
  return OPENING_HOURS.find((hours) => hours.days.some((day) => day === weekday));
}

/**
 * The {@link getAmsterdamClock} helper
 * @description The weekday and the minutes after midnight at a moment, in the Netherlands
 * @param {Date} now - The moment
 * @returns {{ weekday: number; minutes: number }} The weekday (0 is Sunday) and the minutes
 */
function getAmsterdamClock(now: Date): { weekday: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: OPENING_TIME_ZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";

  // The weekday's number and the time of day
  return {
    weekday: WEEKDAY_INDEX[part("weekday")] ?? 0,
    minutes: toMinutes(`${part("hour")}:${part("minute")}`),
  };
}

/**
 * The {@link getOpeningStatus} helper
 * @description Whether AMIR-GB answers at a moment, and when it closes or next opens
 * @param {Date} now - The moment
 * @returns {OpeningStatus} Open or closed, with the time and day of the next change
 */
export function getOpeningStatus(now: Date): OpeningStatus {
  const { weekday, minutes } = getAmsterdamClock(now);
  const today = getHoursFor(weekday);

  // Open now: it closes later today
  if (today && minutes >= toMinutes(today.opens) && minutes < toMinutes(today.closes)) {
    return { isOpen: true, time: today.closes, weekday, daysAway: 0 };
  }

  // Closed but opening later today
  if (today && minutes < toMinutes(today.opens)) {
    return { isOpen: false, time: today.opens, weekday, daysAway: 0 };
  }

  // Closed for today: the next day with hours
  for (let daysAway = 1; daysAway <= DAYS_PER_WEEK; daysAway += 1) {
    const day = (weekday + daysAway) % DAYS_PER_WEEK;
    const hours = getHoursFor(day);
    if (hours) {
      return { isOpen: false, time: hours.opens, weekday: day, daysAway };
    }
  }

  // Never open, which the hours above never are
  return { isOpen: false, time: "", weekday, daysAway: 0 };
}

/**
 * The {@link enableOpeningStatus} helper
 * @description Shows whether AMIR-GB answers now on the opening hours card and marks today's row, in the visitor's own time
 * @returns {void}
 */
export function enableOpeningStatus(): void {
  const root = document.querySelector<HTMLElement>(OPENING_STATUS.ROOT);
  if (!root) {
    return;
  }

  // Work out the status once, when the page shows
  const status = getOpeningStatus(new Date());
  root.dataset[OPENING_STATUS.STATE] = status.isOpen ? OPENING_STATUS.OPEN : OPENING_STATUS.CLOSED;

  // Today's row is the one whose days hold today
  const today = getAmsterdamClock(new Date()).weekday;
  for (const row of root.querySelectorAll<HTMLElement>(OPENING_STATUS.ROW)) {
    const days = (row.dataset.openingDays ?? "").split(",").map(Number);
    row.toggleAttribute(`data-${OPENING_STATUS.TODAY}`, days.includes(today));
  }

  // Fill the line that says when it changes, from the copy the card carries
  const line = root.querySelector<HTMLElement>(OPENING_STATUS.STATUS);
  if (!line) {
    return;
  }
  line.textContent = describeChange(root, status);
  line.hidden = false;
}

/**
 * The {@link describeChange} helper
 * @description The sentence that says when AMIR-GB closes or next opens, in the page's language
 * @param {HTMLElement} root - The opening hours card, which carries the copy
 * @param {OpeningStatus} status - The status now
 * @returns {string} The sentence, such as "Closes at 20:00" or "Opens Monday at 08:00"
 */
function describeChange(root: HTMLElement, status: OpeningStatus): string {
  const copy = root.dataset;

  // Open: when it closes
  if (status.isOpen) {
    return (copy.closesAt ?? "").replace(CONTACT_PLACEHOLDER.TIME, status.time);
  }

  // Closed: later today, tomorrow, or on a named day
  if (status.daysAway === 0) {
    return (copy.opensToday ?? "").replace(CONTACT_PLACEHOLDER.TIME, status.time);
  }
  if (status.daysAway === 1) {
    return (copy.opensTomorrow ?? "").replace(CONTACT_PLACEHOLDER.TIME, status.time);
  }
  const day = getWeekdayName(document.documentElement.lang, status.weekday);
  return (copy.opensOn ?? "")
    .replace(CONTACT_PLACEHOLDER.DAY, day)
    .replace(CONTACT_PLACEHOLDER.TIME, status.time);
}

/**
 * The {@link getWeekdayName} helper
 * @description A weekday's name in the page's language
 * @param {string} locale - The page's language
 * @param {number} weekday - The weekday, 0 being Sunday
 * @returns {string} Its name, such as Monday or maandag
 */
function getWeekdayName(locale: string, weekday: number): string {
  // 4 January 1970 was a Sunday, so adding the weekday lands on that day
  const day = new Date(Date.UTC(1970, 0, 4 + weekday, 12));
  return new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(day);
}

/**
 * The {@link isContactError} helper
 * @description Whether a value is one of the message form's errors
 * @param {string | undefined} value - The value to check
 * @returns {boolean} True when it names a {@link CONTACT_ERROR}
 */
export function isContactError(value: string | undefined): value is ContactError {
  return Object.values(CONTACT_ERROR).some((error) => error === value);
}

/**
 * The {@link toOneLine} helper
 * @description Folds line breaks into spaces, so a name or an address can never start a new line in the email's headers
 * @param {string} value - The typed value
 * @returns {string} The value on one line
 */
export function toOneLine(value: string): string {
  return value.replace(REACH_PATTERN.LINE_BREAKS, " ");
}
