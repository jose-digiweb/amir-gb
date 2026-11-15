// Dependencies
import { DAY_MS, SITE_TIME_ZONE, WEEKDAYS } from "../../content/constants";
import { WEEKLY_NEXT } from "../constants";

// Types
import type { Weekday } from "../../content/types";

/**
 * The {@link getSiteNow} helper
 * @description Today's date and time of day in Dutch time
 * @param {Date} now - The moment the page renders
 * @returns {{ year: number; month: number; day: number; time: string }} The date's parts and the time as HH:MM
 */
function getSiteNow(now: Date): { year: number; month: number; day: number; time: string } {
  const parts = new Intl.DateTimeFormat(WEEKLY_NEXT.CLOCK_LOCALE, {
    timeZone: SITE_TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  // The date as numbers, and the time as HH:MM so it compares with a schedule's times
  return {
    year: Number(read("year")),
    month: Number(read("month")),
    day: Number(read("day")),
    time: `${read("hour")}:${read("minute")}`,
  };
}

/**
 * The {@link getNextWeeklyDay} helper
 * @description The next day a weekly activity takes place: today while today's session has not ended, otherwise its next weekday
 * @param {Weekday} weekday - The activity's day, as EmDash stores it
 * @param {string} endTime - When the activity ends, as HH:MM
 * @param {Date} now - The moment the page renders
 * @returns {Date} Noon on that day, so it reads as the same date in Dutch time
 */
export function getNextWeeklyDay(weekday: Weekday, endTime: string, now: Date): Date {
  const today = getSiteNow(now);
  const todayNoon = Date.UTC(today.year, today.month - 1, today.day, WEEKLY_NEXT.NOON_HOUR);
  const todayIndex =
    (new Date(todayNoon).getUTCDay() + WEEKLY_NEXT.DAYS_IN_WEEK - 1) % WEEKLY_NEXT.DAYS_IN_WEEK;
  const ahead =
    (WEEKDAYS.indexOf(weekday) - todayIndex + WEEKLY_NEXT.DAYS_IN_WEEK) % WEEKLY_NEXT.DAYS_IN_WEEK;

  // Today's session that has ended moves to the same day next week
  if (ahead === 0 && today.time >= endTime) {
    return new Date(todayNoon + WEEKLY_NEXT.DAYS_IN_WEEK * DAY_MS);
  }

  // Any other day is this many days from today
  return new Date(todayNoon + ahead * DAY_MS);
}
