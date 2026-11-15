// Dependencies
import { WEEKDAYS } from "../../content/constants";
import { CALENDAR_ANCHOR } from "../constants";
import { capitalise } from "./dates";
import { buildEventsHref, shiftMonth, toMonthKey } from "./params";

// Types
import type { CalendarInput, CalendarMonth } from "../types";

/**
 * The {@link buildCalendarMonth} helper
 * @description Lays out a month Monday first, with each day's events, weekly activities and link
 * @param {CalendarInput} input - The month, its events and the page's context
 * @returns {CalendarMonth} The month grid
 */
export function buildCalendarMonth(input: CalendarInput): CalendarMonth {
  const { month, events, activities, today, locale, path, type } = input;
  const first = new Date(Date.UTC(month.year, month.month - 1, 1));
  const length = new Date(Date.UTC(month.year, month.month, 0)).getUTCDate();
  const monthKey = toMonthKey(month);
  const dayLabel = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const picked = getPickedDay(input, monthKey, length);
  // Build every day of the month with what happens on it
  const days = Array.from({ length }, (_, index) => {
    const date = new Date(Date.UTC(month.year, month.month - 1, index + 1));
    const key = `${monthKey}-${String(index + 1).padStart(2, "0")}`;
    const weekday = WEEKDAYS[getMondayIndex(date)];
    return {
      key,
      day: index + 1,
      label: dayLabel.format(date),
      href: buildEventsHref(path, { type, day: key }, CALENDAR_ANCHOR),
      isPast: key < today,
      isToday: key === today,
      isPicked: key === picked,
      events: events.filter((event) => event.dayKey === key),
      weekly: activities.filter((activity) => activity.weekday === weekday),
    };
  });
  const title = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(first);
  const name = new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(first);
  // Return the grid with the empty places before the first and the links to the months around it
  return {
    key: monthKey,
    title: capitalise(title),
    name,
    leading: getMondayIndex(first),
    days,
    previousHref: buildEventsHref(
      path,
      { type, month: toMonthKey(shiftMonth(month, -1)) },
      CALENDAR_ANCHOR,
    ),
    nextHref: buildEventsHref(
      path,
      { type, month: toMonthKey(shiftMonth(month, 1)) },
      CALENDAR_ANCHOR,
    ),
  };
}

/**
 * The {@link getMondayIndex} helper
 * @description A date's place in a week that starts on Monday
 * @param {Date} date - A date at midnight UTC
 * @returns {number} 0 for Monday to 6 for Sunday
 */
export function getMondayIndex(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

/**
 * The {@link getPickedDay} helper
 * @description The day the calendar opens on: the one in the address, else the next day with an event, else the month's first day with one
 * @param {CalendarInput} input - The month, its events and the page's context
 * @param {string} monthKey - The month, YYYY-MM
 * @param {number} length - How many days the month has
 * @returns {string | undefined} The picked day, YYYY-MM-DD, or none in a month without events
 */
function getPickedDay(input: CalendarInput, monthKey: string, length: number): string | undefined {
  const { picked, events, today } = input;
  // A day in the address that belongs to this month wins
  if (picked && picked.startsWith(monthKey) && Number(picked.slice(8)) <= length) {
    return picked;
  }
  // Otherwise the next day with an event, then the month's first day with one
  const next = events.find((event) => event.dayKey >= today);
  return next?.dayKey ?? events[0]?.dayKey;
}

/**
 * The {@link getWeekdayNames} helper
 * @description The weekday names Monday first, for the calendar's header row
 * @param {string} locale - The page's language
 * @param {"narrow" | "short"} width - One letter, or the short name
 * @returns {string[]} Seven names, Monday first
 */
export function getWeekdayNames(locale: string, width: "narrow" | "short"): string[] {
  const format = new Intl.DateTimeFormat(locale, { weekday: width, timeZone: "UTC" });
  // 5 January 2026 is a Monday
  return Array.from({ length: 7 }, (_, index) =>
    format.format(new Date(Date.UTC(2026, 0, 5 + index))).replace(".", ""),
  );
}
