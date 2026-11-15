// Dependencies
import { DATE_PATTERN, EVENT_TYPES, EVENTS_PARAM } from "../constants";

// Types
import type { EventsQuery, EventType, TypeChip, YearMonth } from "../types";

/**
 * The {@link parseEventType} helper
 * @description Reads the type filter from the address, ignoring anything that is not a kind of event
 * @param {string | null} value - The parameter's value
 * @returns {EventType | undefined} The kind of event, or none for All
 */
export function parseEventType(value: string | null): EventType | undefined {
  return EVENT_TYPES.find((type) => type === value);
}

/**
 * The {@link parseMonth} helper
 * @description Reads a month from the address, falling back to the month of the given day
 * @param {string | null} value - The parameter's value, YYYY-MM
 * @param {string} fallbackDay - The day to fall back on, YYYY-MM-DD
 * @returns {YearMonth} The month to show
 */
export function parseMonth(value: string | null, fallbackDay: string): YearMonth {
  const match = DATE_PATTERN.MONTH.exec(value ?? "");
  const month = Number(match?.[2]);
  // A well formed month is used as it is
  if (match && month >= 1 && month <= 12) {
    return { year: Number(match[1]), month };
  }
  // Anything else shows the fallback day's month
  return { year: Number(fallbackDay.slice(0, 4)), month: Number(fallbackDay.slice(5, 7)) };
}

/**
 * The {@link parseDay} helper
 * @description Reads a picked day from the address, ignoring anything that is not a real date
 * @param {string | null} value - The parameter's value, YYYY-MM-DD
 * @returns {string | undefined} The day as YYYY-MM-DD, or none
 */
export function parseDay(value: string | null): string | undefined {
  const match = DATE_PATTERN.DAY.exec(value ?? "");
  // Anything that is not shaped like a day is ignored
  if (!match) {
    return undefined;
  }
  // A day that does not exist, such as 31 November, is ignored too
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (date.getUTCDate() !== Number(match[3])) {
    return undefined;
  }
  // Return the day as written
  return match[0];
}

/**
 * The {@link parseYear} helper
 * @description Reads the archive's year from the address
 * @param {string | null} value - The parameter's value
 * @returns {string | undefined} The year, or none
 */
export function parseYear(value: string | null): string | undefined {
  // Only four digits make a year
  if (!value || !DATE_PATTERN.YEAR.test(value)) {
    return undefined;
  }
  // Return the year as written
  return value;
}

/**
 * The {@link toMonthKey} helper
 * @description Writes a month as the address carries it
 * @param {YearMonth} month - The month
 * @returns {string} The month as YYYY-MM
 */
export function toMonthKey({ year, month }: YearMonth): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/**
 * The {@link shiftMonth} helper
 * @description The month before or after another
 * @param {YearMonth} month - The month to start from
 * @param {number} by - How many months to move, negative to go back
 * @returns {YearMonth} The month moved to
 */
export function shiftMonth({ year, month }: YearMonth, by: number): YearMonth {
  const date = new Date(Date.UTC(year, month - 1 + by, 1));
  // Read the year and month back from the moved date
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

/**
 * The {@link buildEventsHref} helper
 * @description A link to an events page with its query, leaving out empty parameters
 * @param {string} path - The page's path in its language
 * @param {EventsQuery} query - The parameters to carry
 * @param {string} [anchor] - Where on the page to land
 * @returns {string} The link
 */
export function buildEventsHref(path: string, query: EventsQuery, anchor?: string): string {
  const search = new URLSearchParams();
  // Carry only the parameters that have a value
  for (const [key, value] of Object.entries(query)) {
    if (value) {
      search.set(key, value);
    }
  }
  const text = search.toString();
  const hash = anchor ? `#${anchor}` : "";
  // A link without parameters is just the path
  if (!text) {
    return `${path}${hash}`;
  }
  // Otherwise the path carries its query
  return `${path}?${text}${hash}`;
}

/**
 * The {@link getTypeChips} helper
 * @description The filter chips: All, then each kind of event, each linking to the same view filtered
 * @param {string} path - The view's path in its language
 * @param {EventType | undefined} current - The current filter, or none for All
 * @param {EventsQuery} [keep] - What the view keeps when the filter changes, such as the calendar's month
 * @returns {TypeChip[]} The chips in order
 */
export function getTypeChips(
  path: string,
  current: EventType | undefined,
  keep: EventsQuery = {},
): TypeChip[] {
  const all = { type: undefined, href: buildEventsHref(path, keep), isCurrent: !current };
  // Each kind links to the view filtered on it
  const kinds = EVENT_TYPES.map((type) => ({
    type,
    href: buildEventsHref(path, { ...keep, [EVENTS_PARAM.TYPE]: type }),
    isCurrent: type === current,
  }));
  return [all, ...kinds];
}
