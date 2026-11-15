// Dependencies
import { ARCHIVE_TIMELINE } from "../constants";
import { getDayKey, getMonthKey } from "./dates";
import { parseMonth, shiftMonth, toMonthKey } from "./params";

// Types
import type { EventItem, TimelineMonth, YearMonth } from "../types";

/**
 * The {@link buildTimeline} helper
 * @description The archive opening's recent months, up to the current one and never before the month after AMIR-GB was founded, each with its first few past events
 * @param {EventItem[]} past - Every past event
 * @param {Date} now - The moment the page renders
 * @returns {TimelineMonth[]} The months, oldest first
 */
export function buildTimeline(past: EventItem[], now: Date): TimelineMonth[] {
  const today = getDayKey(now);
  const current = parseMonth(getMonthKey(today), today);
  const first = toMonthKey(ARCHIVE_TIMELINE.FIRST_MONTH);
  const months: YearMonth[] = [];

  // Walk back from the current month until the timeline is full or reaches its first month
  for (let back = 0; back < ARCHIVE_TIMELINE.MONTHS; back += 1) {
    const candidate = shiftMonth(current, -back);
    if (toMonthKey(candidate) < first) {
      break;
    }
    months.unshift(candidate);
  }

  // Each month with its first events in date order
  return months.map((candidate) => {
    const key = toMonthKey(candidate);
    const events = past
      .filter((event) => getMonthKey(event.dayKey) === key)
      .toSorted((a, b) => a.startsAt.getTime() - b.startsAt.getTime())
      .slice(0, ARCHIVE_TIMELINE.KNOTS);
    return { key, year: candidate.year, month: candidate.month, events };
  });
}
