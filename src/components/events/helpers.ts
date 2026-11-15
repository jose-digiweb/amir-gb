// Dependencies
import { DAY_MS, WEEKDAYS } from "../../lib/content/constants";
import { getEventDay } from "../../lib/content/helpers";
import { WEEKDAY_STYLE } from "../../lib/events/constants";
import { getNextWeeklyDay, getShortWeekday, getWeekdayDate } from "../../lib/events/helpers";
import { EVENTS_PLACEHOLDER, WEEK_REFERENCE_MONDAY, WEEK_STOP_LETTERS } from "./constants";

// Types
import type { Translations } from "../../i18n/types";
import type { WeeklyActivity } from "../../lib/content/types";
import type { EventItem } from "../../lib/events/types";
import type { Point } from "../opening/types";
import type { Orbit, OrbitBadgeSpot, WeekStopSpot } from "./types";

/**
 * The {@link getOrbitPath} helper
 * @description Draws a tilted orbit as one closed path of two arcs, so a stitched thread can sew along it
 * @param {Orbit} orbit - The orbit's centre, radii and tilt
 * @returns {string} The SVG path, starting and ending at the orbit's left end
 */
export function getOrbitPath(orbit: Orbit): string {
  const angle = (orbit.turn * Math.PI) / 180;
  const dx = Math.round(orbit.radiusX * Math.cos(angle) * 100) / 100;
  const dy = Math.round(orbit.radiusX * Math.sin(angle) * 100) / 100;
  const start = `${orbit.centreX - dx} ${orbit.centreY - dy}`;
  const end = `${orbit.centreX + dx} ${orbit.centreY + dy}`;
  const arc = `A${orbit.radiusX} ${orbit.radiusY} ${orbit.turn} 1 1`;

  // Over the top to the right end, then back under to the left end
  return `M${start} ${arc} ${end} ${arc} ${start}`;
}

/**
 * The {@link getOrbitBadges} helper
 * @description Puts the next events on the orbit's places in date order; with fewer events the later places stay empty
 * @param {EventItem[]} events - The next events, soonest first
 * @param {readonly Point[]} slots - The places on the orbit, in date order
 * @param {string} locale - The page's language
 * @returns {OrbitBadgeSpot[]} One badge per event that has a place
 */
export function getOrbitBadges(
  events: EventItem[],
  slots: readonly Point[],
  locale: string,
): OrbitBadgeSpot[] {
  return events.slice(0, slots.length).flatMap((event, index) => {
    const slot = slots[index];

    // An event without a place is left out
    if (!slot) {
      return [];
    }

    // The badge at its place, with its day, month and kind
    const { day, month } = getEventDay(event.startsAt, locale);
    return [{ key: event.id, x: slot.x, y: slot.y, day, month, type: event.type }];
  });
}

/**
 * The {@link getWeekStops} helper
 * @description Puts the days of the week on the orbit from Monday, each with its short name and the first weekly activity it holds
 * @param {WeeklyActivity[]} activities - The weekly activities, Monday first
 * @param {readonly Point[]} stops - The places on the orbit, Monday first
 * @param {string} locale - The page's language
 * @param {Translations} t - The page's copy
 * @returns {WeekStopSpot[]} One stop per day that has a place
 */
export function getWeekStops(
  activities: WeeklyActivity[],
  stops: readonly Point[],
  locale: string,
  t: Translations,
): WeekStopSpot[] {
  return WEEKDAYS.flatMap((weekday, index) => {
    const stop = stops[index];

    // A day without a place is left out
    if (!stop) {
      return [];
    }

    // The day's first letters, and its first activity as a tinted disc
    const label = getShortWeekday(new Date(WEEK_REFERENCE_MONDAY + index * DAY_MS), locale).slice(
      0,
      WEEK_STOP_LETTERS,
    );
    const activity = activities.find((item) => item.weekday === weekday);
    const spot = { key: weekday, x: stop.x, y: stop.y, label };

    // A day without an activity is a quiet stop
    if (!activity) {
      return [spot];
    }

    // A day with one carries it
    return [
      {
        ...spot,
        activity: {
          name: activity.name,
          tileColour: activity.tileColour,
          days: t[`weekly.plural.${weekday}`],
          isDutchOnly: activity.isDutchOnly,
        },
      },
    ];
  });
}

/**
 * The {@link getWeeklyNextTexts} helper
 * @description A weekly activity's next date as the page says it: the weekday in full, and short for a phone
 * @param {WeeklyActivity} activity - The weekly activity
 * @param {Date} now - The moment the page renders
 * @param {string} locale - The page's language
 * @param {Translations} t - The page's copy
 * @returns {{ long: string; short: string }} For example "Next: Tuesday 17 November" and "Next: Tue 17 November"
 */
export function getWeeklyNextTexts(
  activity: WeeklyActivity,
  now: Date,
  locale: string,
  t: Translations,
): { long: string; short: string } {
  const next = getNextWeeklyDay(activity.weekday, activity.endTime, now);
  const template = t["eventsPage.nextDate"];

  // The same date, with its weekday written out and short
  return {
    long: template.replace(
      EVENTS_PLACEHOLDER.DATE,
      getWeekdayDate(next, locale, WEEKDAY_STYLE.LONG),
    ),
    short: template.replace(
      EVENTS_PLACEHOLDER.DATE,
      getWeekdayDate(next, locale, WEEKDAY_STYLE.SHORT),
    ),
  };
}
