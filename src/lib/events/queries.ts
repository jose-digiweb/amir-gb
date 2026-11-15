// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { getEmDashEntry, getEmDashReferences, isSafeHref } from "emdash";
import { DEFAULT_LOCALE, INTL_LOCALE } from "../../i18n/constants";
import { ROUTE } from "../../site/constants";
import {
  COLLECTION,
  CONTENT_STATUS,
  EVENT_STATUS,
  FIELD,
  POST_TYPE,
  SORT,
} from "../content/constants";
import { getWeeklyActivities, readLocalised } from "../content/queries";
import { EVENT_PHASE, EVENT_TIME, EVENTS_LIMIT, EVENTS_PARAM } from "./constants";
import {
  buildCalendarMonth,
  buildEventsHref,
  getDayKey,
  getEventPhase,
  getMonthKey,
  groupByMonth,
  shiftMonth,
  toMonthKey,
} from "./helpers";

// Types
import type { CacheHint, CollectionFilter } from "emdash";
import type { Event } from "../../../emdash-env";
import type { Locale } from "../../i18n/types";
import type { ContentRead, Entry, TranslationMeta } from "../content/types";
import type {
  ArchiveContent,
  EventDetail,
  EventItem,
  EventPageContent,
  EventsCalendarContent,
  EventsContent,
  EventsListContent,
  EventType,
  PastEvent,
  CalendarQuery,
  Story,
  YearMonth,
} from "./types";

/**
 * The {@link toOptionalDate} helper
 * @description Reads an optional date field
 * @param {string | undefined} text - The field's value
 * @returns {Date | undefined} The date, or none when the field is empty
 */
function toOptionalDate(text: string | undefined): Date | undefined {
  // An empty field has no date
  if (!text) {
    return undefined;
  }
  // Otherwise read it
  return new Date(text);
}

/**
 * The {@link toSafeLink} helper
 * @description Reads a link field, leaving out a link whose scheme is unsafe in an href, such as javascript:
 * @param {string | undefined} link - The field's value
 * @returns {string | undefined} The link, or none when it is empty or unsafe
 */
function toSafeLink(link: string | undefined): string | undefined {
  // An empty or unsafe link is left out, so its row or button does not show
  if (!link || !isSafeHref(link)) {
    return undefined;
  }
  // Otherwise it is used as written
  return link;
}

/**
 * The {@link toEventItem} helper
 * @description Shapes an EmDash event for the lists, the calendar and the archive
 * @param {Entry<"events">} entry - The event as EmDash returns it
 * @param {boolean} isDutchOnly - Whether it shows in Dutch on a page in another language
 * @param {Locale} locale - The page's language
 * @returns {EventItem} The event
 */
function toEventItem(entry: Entry<"events">, isDutchOnly: boolean, locale: Locale): EventItem {
  const { data } = entry;
  const slug = data.slug ?? data.id;
  const startsAt = new Date(data.starts_at);
  // Read the fields every view shows
  return {
    id: data.id,
    group: data.translationGroup ?? data.id,
    slug,
    href: getRelativeLocaleUrl(locale, `${ROUTE.EVENTS}${slug}/`),
    title: data.title,
    type: data.type,
    status: data.event_status,
    startsAt,
    endsAt: toOptionalDate(data.ends_at),
    dayKey: getDayKey(startsAt),
    placeName: data.place_name,
    isOnline: Boolean(toSafeLink(data.online_link)),
    image: data.image,
    summary: data.summary,
    isDutchOnly,
  };
}

/**
 * The {@link readEvents} helper
 * @description Reads events in the page's language and the Dutch ones without a translation, shaped and soonest first, without cancelled ones
 * @param {Locale} locale - The page's language
 * @param {CollectionFilter} filter - The filter both languages share
 * @returns {Promise<ContentRead<EventItem>>} The events, with their cache hints
 */
async function readEvents(
  locale: Locale,
  filter: CollectionFilter,
): Promise<ContentRead<EventItem>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.EVENTS, locale, {
    status: CONTENT_STATUS.PUBLISHED,
    ...filter,
  });
  const events = items
    .map(({ entry, isDutchOnly }) => toEventItem(entry, isDutchOnly, locale))
    .filter((event) => event.status !== EVENT_STATUS.CANCELLED);
  // Order both languages together by their start, leaving cancelled events to their own page
  events.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  return { items: events, cacheHints };
}

/**
 * The {@link byType} helper
 * @description The query filter for one kind of event, or none for All
 * @param {EventType | undefined} type - The kind of event
 * @returns {Record<string, string>} The filter to add to a query
 */
function byType(type: EventType | undefined): Record<string, string> {
  // All kinds need no filter
  if (!type) {
    return {};
  }
  // One kind filters on its stored value
  return { [FIELD.TYPE]: type };
}

/**
 * The {@link readUpcoming} helper
 * @description Reads the events still to come or running, soonest first
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @param {EventType} [type] - The kind of event, or all
 * @param {number} [limit] - How many to read per language
 * @returns {Promise<ContentRead<EventItem>>} The upcoming events
 */
async function readUpcoming(
  locale: Locale,
  now: Date,
  type?: EventType,
  limit: number = EVENTS_LIMIT.UPCOMING_READ,
): Promise<ContentRead<EventItem>> {
  const from = new Date(now.getTime() - EVENT_TIME.RUNNING_MARGIN).toISOString();
  const { items, cacheHints } = await readEvents(locale, {
    where: { [FIELD.STARTS_AT]: { gte: from }, ...byType(type) },
    orderBy: { [FIELD.STARTS_AT]: SORT.ASC },
    limit,
  });
  // Keep the ones that have not ended
  const upcoming = items.filter((event) => getEventPhase(event, now) === EVENT_PHASE.UPCOMING);
  return { items: upcoming, cacheHints };
}

/**
 * The {@link readPast} helper
 * @description Reads the events that have ended, newest first
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @param {number} limit - How many to read per language
 * @returns {Promise<ContentRead<EventItem>>} The past events
 */
async function readPast(locale: Locale, now: Date, limit: number): Promise<ContentRead<EventItem>> {
  const { items, cacheHints } = await readEvents(locale, {
    where: { [FIELD.STARTS_AT]: { lt: now.toISOString() } },
    orderBy: { [FIELD.STARTS_AT]: SORT.DESC },
    limit,
  });
  // Keep the ones that have ended, newest first
  const past = items
    .filter((event) => getEventPhase(event, now) === EVENT_PHASE.ENDED)
    .toReversed();
  return { items: past, cacheHints };
}

/**
 * The {@link getEventsShared} helper
 * @description Reads what the list and the calendar share: the weekly activities and the latest past events
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @returns {Promise<EventsContent>} The weekly activities and up to three past events
 */
async function getEventsShared(locale: Locale, now: Date): Promise<EventsContent> {
  const [activities, past] = await Promise.all([
    getWeeklyActivities(locale),
    readPast(locale, now, EVENTS_LIMIT.PAST_PREVIEW_READ),
  ]);
  // Both parts with every hint that purges the page
  return {
    activities: activities.items,
    past: past.items.slice(0, EVENTS_LIMIT.PAST_PREVIEW),
    cacheHints: [...activities.cacheHints, ...past.cacheHints],
  };
}

/**
 * The {@link getEventsListContent} helper
 * @description Reads what the list shows: the next event, the rest by month, the weekly activities and the latest past events
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @param {string} laterIn - The heading for the rest of the next event's month, with {month} in it
 * @param {EventType} [type] - The kind of event to show, or all
 * @returns {Promise<EventsListContent>} The list's content and its cache hints
 */
export async function getEventsListContent(
  locale: Locale,
  now: Date,
  laterIn: string,
  type?: EventType,
): Promise<EventsListContent> {
  const [upcoming, shared] = await Promise.all([
    readUpcoming(locale, now, type),
    getEventsShared(locale, now),
  ]);
  const [next, ...rest] = upcoming.items;
  const nextMonth = next ? getMonthKey(next.dayKey) : undefined;
  // The next event leads, the rest follow by month
  return {
    ...shared,
    next,
    months: groupByMonth(rest, INTL_LOCALE[locale], laterIn, nextMonth),
    cacheHints: [...upcoming.cacheHints, ...shared.cacheHints],
  };
}

/**
 * The {@link getEventsCalendarContent} helper
 * @description Reads what the calendar shows: the month's events laid out by day, the picked day, and the shared parts
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @param {CalendarQuery} query - The month, the picked day, the filter and the page's path
 * @returns {Promise<EventsCalendarContent>} The calendar's content and its cache hints
 */
export async function getEventsCalendarContent(
  locale: Locale,
  now: Date,
  query: CalendarQuery,
): Promise<EventsCalendarContent> {
  const { month, picked, type, path } = query;
  const monthKey = toMonthKey(month);
  const from = new Date(Date.UTC(month.year, month.month - 1, 0)).toISOString();
  const until = new Date(Date.UTC(month.year, month.month, 2)).toISOString();
  const [read, shared] = await Promise.all([
    readEvents(locale, {
      where: { [FIELD.STARTS_AT]: { gte: from, lt: until }, ...byType(type) },
      orderBy: { [FIELD.STARTS_AT]: SORT.ASC },
      limit: EVENTS_LIMIT.MONTH_READ,
    }),
    getEventsShared(locale, now),
  ]);
  // Keep the events that fall in the month in Dutch time
  const events = read.items.filter((event) => getMonthKey(event.dayKey) === monthKey);
  const calendar = buildCalendarMonth({
    month,
    events,
    activities: shared.activities,
    today: getDayKey(now),
    picked,
    locale: INTL_LOCALE[locale],
    path,
    type,
  });
  const cacheHints = [...read.cacheHints, ...shared.cacheHints];
  // A month with events opens on its picked day
  if (events.length > 0) {
    return {
      ...shared,
      month: calendar,
      picked: calendar.days.find((day) => day.isPicked),
      hasMonthEvents: true,
      cacheHints,
    };
  }
  // An empty month points at the next event after it
  const after = await readUpcoming(locale, firstMoment(shiftMonth(month, 1), now), type);
  return {
    ...shared,
    month: calendar,
    nextAfter: after.items[0],
    hasMonthEvents: false,
    cacheHints: [...cacheHints, ...after.cacheHints],
  };
}

/**
 * The {@link firstMoment} helper
 * @description The start of a month, or now when that is later, so an empty month never points at a past event
 * @param {YearMonth} month - The month
 * @param {Date} now - The moment the page renders
 * @returns {Date} The moment to look from
 */
function firstMoment(month: YearMonth, now: Date): Date {
  const start = new Date(Date.UTC(month.year, month.month - 1, 1));
  // Never look back before now
  if (start < now) {
    return now;
  }
  // Otherwise look from the month's start
  return start;
}

/**
 * The {@link toEventDetail} helper
 * @description Shapes an EmDash event for its own page
 * @param {Entry<"events">} entry - The event as EmDash returns it
 * @param {Locale} locale - The page's language
 * @returns {EventDetail} The event with every field its page shows
 */
function toEventDetail(entry: Entry<"events">, locale: Locale): EventDetail {
  const { data } = entry;
  // The shared fields, plus what only the page shows
  return {
    ...toEventItem(entry, data.locale !== locale, locale),
    originalStartsAt: toOptionalDate(data.original_starts_at),
    forWhom: data.for_whom,
    address: data.address,
    onlineLink: toSafeLink(data.online_link),
    registrationLink: toSafeLink(data.registration_link),
    languages: data.languages ?? [],
    content: data.content,
  };
}

/**
 * The {@link readEventEntry} helper
 * @description Reads one event by its address, in the page's language or, failing that, in Dutch
 * @param {Locale} locale - The page's language
 * @param {string} slug - The event's address
 * @returns {Promise<ContentRead<EventDetail>>} The event, or none, with the cache hints
 */
export async function readEventEntry(
  locale: Locale,
  slug: string,
): Promise<ContentRead<EventDetail>> {
  const local = await getEmDashEntry<"events", Event & TranslationMeta>(COLLECTION.EVENTS, slug, {
    locale,
  });
  // The page's own language comes first
  if (local.entry) {
    return { items: [toEventDetail(local.entry, locale)], cacheHints: [local.cacheHint] };
  }
  // Dutch pages have nothing to fall back on
  if (locale === DEFAULT_LOCALE) {
    return { items: [], cacheHints: [local.cacheHint] };
  }
  // Other languages show the Dutch original
  const dutch = await getEmDashEntry<"events", Event & TranslationMeta>(COLLECTION.EVENTS, slug, {
    locale: DEFAULT_LOCALE,
  });
  const items = dutch.entry ? [toEventDetail(dutch.entry, locale)] : [];
  return { items, cacheHints: [local.cacheHint, dutch.cacheHint] };
}

/**
 * The {@link getStories} helper
 * @description Reads the Story posts that point at an event, so a past event can link its photos
 * @param {Locale} locale - The page's language
 * @returns {Promise<ContentRead<Story>>} One story per event, by the event's translation group
 */
async function getStories(locale: Locale): Promise<ContentRead<Story>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.POSTS, locale, {
    status: CONTENT_STATUS.PUBLISHED,
    where: { [FIELD.TYPE]: POST_TYPE.STORY },
    orderBy: { [FIELD.PUBLISHED_AT]: SORT.DESC },
    limit: EVENTS_LIMIT.STORIES_READ,
  });
  // Read the event each story points at, all at once
  const references = await Promise.all(
    items.map(({ entry }) =>
      getEmDashReferences<Event & TranslationMeta>(COLLECTION.POSTS, entry.data.id, FIELD.EVENT, {
        limit: 1,
      }),
    ),
  );
  const stories: Story[] = [];
  const hints: CacheHint[] = [...cacheHints];
  // Keep the stories that point at an event, by that event's group
  for (const [index, reference] of references.entries()) {
    const event = reference.entries[0];
    if (reference.cacheHint) {
      hints.push(reference.cacheHint);
    }
    if (event) {
      const slug = items[index].entry.data.slug ?? "";
      stories.push({
        group: event.data.translationGroup ?? event.data.id,
        href: getRelativeLocaleUrl(locale, `${ROUTE.NEWS}${slug}/`),
      });
    }
  }
  return { items: stories, cacheHints: hints };
}

/**
 * The {@link getEventPageContent} helper
 * @description Reads what an event page shows: the event, whether it has ended, its story, and the events after it
 * @param {Locale} locale - The page's language
 * @param {string} slug - The event's address
 * @param {Date} now - The moment the page renders
 * @returns {Promise<EventPageContent | undefined>} The page's content, or none when the event does not exist
 */
export async function getEventPageContent(
  locale: Locale,
  slug: string,
  now: Date,
): Promise<EventPageContent | undefined> {
  const [read, upcoming] = await Promise.all([
    readEventEntry(locale, slug),
    readUpcoming(locale, now, undefined, EVENTS_LIMIT.OTHER_READ),
  ]);
  const event = read.items[0];
  // An address without an event is not found
  if (!event) {
    return undefined;
  }
  const phase = getEventPhase(event, now);
  const others = upcoming.items
    .filter((other) => other.group !== event.group)
    .slice(0, EVENTS_LIMIT.OTHER);
  const cacheHints = [...read.cacheHints, ...upcoming.cacheHints];
  // An event still to come needs no story
  if (phase === EVENT_PHASE.UPCOMING) {
    return { event, phase, others, cacheHints };
  }
  // An ended event links the story of the day when one exists
  const stories = await getStories(locale);
  return {
    event,
    phase,
    storyHref: stories.items.find((story) => story.group === event.group)?.href,
    others,
    cacheHints: [...cacheHints, ...stories.cacheHints],
  };
}

/**
 * The {@link getArchiveContent} helper
 * @description Reads the archive: the years with past events and the picked year's events, each with its story when one exists
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @param {string | undefined} year - The year in the address, if any
 * @param {string} path - The archive's path in its language
 * @returns {Promise<ArchiveContent>} The archive's content and its cache hints
 */
export async function getArchiveContent(
  locale: Locale,
  now: Date,
  year: string | undefined,
  path: string,
): Promise<ArchiveContent> {
  const [past, stories] = await Promise.all([
    readPast(locale, now, EVENTS_LIMIT.PAST_READ),
    getStories(locale),
  ]);
  const years = [...new Set(past.items.map((event) => event.dayKey.slice(0, 4)))];
  const picked = years.find((candidate) => candidate === year) ?? years[0];
  const storyByGroup = new Map(stories.items.map((story) => [story.group, story.href]));
  // The picked year's events, each with its story when one exists
  const events: PastEvent[] = past.items
    .filter((event) => event.dayKey.startsWith(picked ?? ""))
    .map((event) => ({ ...event, storyHref: storyByGroup.get(event.group) }));
  return {
    years: years.map((candidate) => ({
      year: candidate,
      href: buildEventsHref(path, { [EVENTS_PARAM.YEAR]: candidate }),
      isPicked: candidate === picked,
    })),
    year: picked,
    events,
    cacheHints: [...past.cacheHints, ...stories.cacheHints],
  };
}
