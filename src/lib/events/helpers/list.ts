// Dependencies
import { capitalise, getMonthKey, getMonthName } from "./dates";

// Types
import type { EventItem, MonthGroup } from "../types";

/**
 * The {@link groupByMonth} helper
 * @description Groups the events after the next one by month; the next event's own month reads "Later in …"
 * @param {EventItem[]} events - The events after the next one, soonest first
 * @param {string} locale - The page's language
 * @param {string} laterIn - The heading for the rest of the next event's month, with {month} in it
 * @param {string | undefined} nextMonth - The next event's month, YYYY-MM
 * @returns {MonthGroup[]} One group per month, in order
 */
export function groupByMonth(
  events: EventItem[],
  locale: string,
  laterIn: string,
  nextMonth: string | undefined,
): MonthGroup[] {
  const groups = new Map<string, EventItem[]>();
  // Collect the events of each month, keeping their order
  for (const event of events) {
    const key = getMonthKey(event.dayKey);
    groups.set(key, [...(groups.get(key) ?? []), event]);
  }
  // Give each month its heading
  return [...groups].map(([key, items]) => ({
    key,
    title: getMonthTitle(key, locale, laterIn, nextMonth),
    events: items,
  }));
}

/**
 * The {@link getMonthTitle} helper
 * @description A month's heading in the list: its name, or "Later in …" for the next event's own month
 * @param {string} key - The month, YYYY-MM
 * @param {string} locale - The page's language
 * @param {string} laterIn - The heading for the rest of the next event's month, with {month} in it
 * @param {string | undefined} nextMonth - The next event's month, YYYY-MM
 * @returns {string} The heading
 */
function getMonthTitle(
  key: string,
  locale: string,
  laterIn: string,
  nextMonth: string | undefined,
): string {
  const name = getMonthName(Number(key.slice(0, 4)), Number(key.slice(5, 7)), locale);
  // The rest of the next event's month reads as later in it
  if (key === nextMonth) {
    return laterIn.replace("{month}", name);
  }
  // Any other month is its name
  return capitalise(name);
}

/**
 * The {@link getCountLabel} helper
 * @description How many events a month has, in the page's language
 * @param {number} count - The number of events
 * @param {string} locale - The page's language
 * @param {string} one - The phrase for one, with {count} in it
 * @param {string} other - The phrase for more, with {count} in it
 * @returns {string} For example "2 events"
 */
export function getCountLabel(count: number, locale: string, one: string, other: string): string {
  const phrase = new Intl.PluralRules(locale).select(count) === "one" ? one : other;
  // Put the number in the phrase
  return phrase.replace("{count}", String(count));
}

/**
 * The {@link getEventWhere} helper
 * @description Where an event happens in one line: its place, online, or both
 * @param {Pick<EventItem, "placeName" | "isOnline">} event - The event's place and whether it is online
 * @param {string} online - The word for online
 * @param {string} and - The word between the two
 * @returns {string} For example "Community centre and online", or empty
 */
export function getEventWhere(
  event: Pick<EventItem, "placeName" | "isOnline">,
  online: string,
  and: string,
): string {
  const parts = [event.placeName, event.isOnline ? online : undefined].filter(Boolean);
  // Join the place and online with the page's word for and
  return parts.join(` ${and} `);
}
