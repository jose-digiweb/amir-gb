// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { getEmDashCollection } from "emdash";
import { DEFAULT_LOCALE } from "../../i18n/constants";
import { ROUTE } from "../../site/constants";
import {
  COLLECTION,
  CONTENT_STATUS,
  DAY_MS,
  EVENT_STATUS,
  EVENT_TYPE,
  FIELD,
  HOME_LIMIT,
  MEETING_READ,
  POST_TYPE,
  SORT,
} from "./constants";
import {
  compareWeekly,
  getWeeklyTint,
  isStripActive,
  mergeWithDutch,
  toClockTime,
  toOptionalDate,
} from "./helpers";

// Types
import type { CollectionFilter, EmDashCollections } from "emdash";
import type { Locale } from "../../i18n/types";
import type {
  ContentRead,
  Entry,
  GeneralMeeting,
  HomeAnnouncement,
  HomeContent,
  HomeEvent,
  HomeStory,
  Localised,
  SeoMeta,
  TranslationMeta,
  WeeklyActivity,
} from "./types";

/**
 * The {@link readLocalised} helper
 * @description Reads a collection in the page's language and, outside Dutch, the Dutch entries without a translation
 * @param {C} collection - The collection to read
 * @param {Locale} locale - The page's language
 * @param {CollectionFilter} filter - The filter both languages share
 * @returns {Promise<ContentRead<Localised<Entry<C>>>>} One entry per translation group, with the cache hints
 */
export async function readLocalised<C extends keyof EmDashCollections>(
  collection: C,
  locale: Locale,
  filter: CollectionFilter,
): Promise<ContentRead<Localised<Entry<C>>>> {
  const local = await getEmDashCollection<C, EmDashCollections[C] & TranslationMeta & SeoMeta>(
    collection,
    {
      ...filter,
      locale,
    },
  );

  // Dutch pages need nothing else
  if (locale === DEFAULT_LOCALE) {
    return {
      items: mergeWithDutch(local.entries, []),
      cacheHints: [local.cacheHint],
    };
  }

  // Other languages add the Dutch entries that have no translation yet
  const dutch = await getEmDashCollection<C, EmDashCollections[C] & TranslationMeta & SeoMeta>(
    collection,
    {
      ...filter,
      locale: DEFAULT_LOCALE,
    },
  );
  return {
    items: mergeWithDutch(local.entries, dutch.entries),
    cacheHints: [local.cacheHint, dutch.cacheHint],
  };
}

/**
 * The {@link getUpcomingEvents} helper
 * @description Reads the next events for What's on, soonest first
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @returns {Promise<ContentRead<HomeEvent>>} Up to four upcoming events
 */
export async function getUpcomingEvents(
  locale: Locale,
  now: Date,
): Promise<ContentRead<HomeEvent>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.EVENTS, locale, {
    status: CONTENT_STATUS.PUBLISHED,
    where: { [FIELD.STARTS_AT]: { gte: new Date(now.getTime() - DAY_MS).toISOString() } },
    orderBy: { [FIELD.STARTS_AT]: SORT.ASC },
    limit: HOME_LIMIT.EVENTS_READ,
  });

  // Shape each event for its card, keep the ones still to start and not cancelled, and the soonest four across both languages
  const events = items
    .filter(({ entry }) => entry.data.event_status !== EVENT_STATUS.CANCELLED)
    .map(({ entry, isDutchOnly }) => ({
      id: entry.data.id,
      href: getRelativeLocaleUrl(locale, `${ROUTE.EVENTS}${entry.data.slug ?? ""}/`),
      title: entry.data.title,
      type: entry.data.type,
      startsAt: new Date(entry.data.starts_at),
      endsAt: entry.data.ends_at ? new Date(entry.data.ends_at) : undefined,
      placeName: entry.data.place_name,
      isOnline: Boolean(entry.data.online_link),
      image: entry.data.image,
      isDutchOnly,
    }));
  const upcoming = events.filter((event) => event.startsAt >= now);
  upcoming.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  return { items: upcoming.slice(0, HOME_LIMIT.EVENTS), cacheHints };
}

/**
 * The {@link getGeneralMeeting} helper
 * @description Reads the next general meeting: the soonest upcoming community event marked as one
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @returns {Promise<ContentRead<GeneralMeeting>>} The meeting, or none when no meeting is planned
 */
export async function getGeneralMeeting(
  locale: Locale,
  now: Date,
): Promise<ContentRead<GeneralMeeting>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.EVENTS, locale, {
    status: CONTENT_STATUS.PUBLISHED,
    where: {
      [FIELD.TYPE]: EVENT_TYPE.COMMUNITY,
      [FIELD.STARTS_AT]: { gte: new Date(now.getTime() - DAY_MS).toISOString() },
    },
    orderBy: { [FIELD.STARTS_AT]: SORT.ASC },
    limit: MEETING_READ,
  });

  // Keep the marked meetings that are not cancelled and still to start, soonest first across both languages
  const meetings = items
    .filter(({ entry }) => entry.data.general_meeting)
    .filter(({ entry }) => entry.data.event_status !== EVENT_STATUS.CANCELLED)
    .map(({ entry, isDutchOnly }) => ({
      id: entry.data.id,
      href: getRelativeLocaleUrl(locale, `${ROUTE.EVENTS}${entry.data.slug ?? ""}/`),
      title: entry.data.title,
      startsAt: new Date(entry.data.starts_at),
      endsAt: toOptionalDate(entry.data.ends_at),
      place: entry.data.address ?? entry.data.place_name,
      isOnline: Boolean(entry.data.online_link),
      image: entry.data.image,
      isDutchOnly,
    }))
    .filter((meeting) => meeting.startsAt >= now);
  meetings.sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
  return { items: meetings.slice(0, 1), cacheHints };
}

/**
 * The {@link getWeeklyActivities} helper
 * @description Reads the weekly activities, Monday first
 * @param {Locale} locale - The page's language
 * @returns {Promise<ContentRead<WeeklyActivity>>} Every published weekly activity
 */
export async function getWeeklyActivities(locale: Locale): Promise<ContentRead<WeeklyActivity>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.ACTIVITIES, locale, {
    status: CONTENT_STATUS.PUBLISHED,
  });

  // Shape each activity for its tile, with its times as HH:MM, and order them through the week
  const activities = items.map(({ entry, isDutchOnly }) => ({
    id: entry.data.id,
    name: entry.data.name,
    weekday: entry.data.weekday,
    startTime: toClockTime(entry.data.start_time),
    endTime: toClockTime(entry.data.end_time),
    isDutchOnly,
  }));
  activities.sort(compareWeekly);

  // Each tile takes its tint from its place in the week
  const tinted = activities.map((activity, index) => ({
    ...activity,
    tileColour: getWeeklyTint(index),
  }));
  return { items: tinted, cacheHints };
}

/**
 * The {@link getRecentStories} helper
 * @description Reads the newest Story posts for Life at AMIR
 * @param {Locale} locale - The page's language
 * @returns {Promise<ContentRead<HomeStory>>} Up to seven stories, newest first, each with a photo
 */
export async function getRecentStories(locale: Locale): Promise<ContentRead<HomeStory>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.POSTS, locale, {
    status: CONTENT_STATUS.PUBLISHED,
    where: { [FIELD.TYPE]: POST_TYPE.STORY },
    orderBy: { [FIELD.PUBLISHED_AT]: SORT.DESC },
    limit: HOME_LIMIT.STORIES_READ,
  });

  // Order both languages by date, keep the stories that have a photo, and shape each for its tile
  const stories = items
    .toSorted(
      (a, b) =>
        (b.entry.data.publishedAt?.getTime() ?? 0) - (a.entry.data.publishedAt?.getTime() ?? 0),
    )
    .filter(({ entry }) => entry.data.featured_image)
    .map(({ entry, isDutchOnly }) => ({
      id: entry.data.id,
      href: getRelativeLocaleUrl(locale, `${ROUTE.NEWS}${entry.data.slug ?? ""}/`),
      title: entry.data.title,
      excerpt: entry.data.excerpt,
      image: entry.data.featured_image,
      isDutchOnly,
    }));
  return { items: stories.slice(0, HOME_LIMIT.STORIES), cacheHints };
}

/**
 * The {@link getUrgentAnnouncement} helper
 * @description Reads the newest announcement marked for the strip that has not ended
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @returns {Promise<ContentRead<HomeAnnouncement>>} The one announcement to show, or none
 */
export async function getUrgentAnnouncement(
  locale: Locale,
  now: Date,
): Promise<ContentRead<HomeAnnouncement>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.POSTS, locale, {
    status: CONTENT_STATUS.PUBLISHED,
    where: { [FIELD.TYPE]: POST_TYPE.ANNOUNCEMENT },
    orderBy: { [FIELD.PUBLISHED_AT]: SORT.DESC },
    limit: HOME_LIMIT.ANNOUNCEMENTS,
  });

  // The page's own language comes first, so its translation wins over a Dutch-only one
  const active = items.find(({ entry }) =>
    isStripActive(entry.data.urgent, entry.data.strip_text, entry.data.urgent_until, now),
  );

  // Nothing marked and current means no strip
  if (!active) {
    return { items: [], cacheHints };
  }

  // Shape the one announcement for the strip
  const { data } = active.entry;
  return {
    items: [
      {
        id: data.translationGroup ?? data.id,
        text: data.strip_text ?? "",
        linkLabel: data.strip_link_label,
        href: getRelativeLocaleUrl(locale, `${ROUTE.NEWS}${data.slug ?? ""}/`),
      },
    ],
    cacheHints,
  };
}

/**
 * The {@link getHomeContent} helper
 * @description Reads everything the home page shows from EmDash at once
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page renders
 * @returns {Promise<HomeContent>} The events, weekly activities, stories and announcement, with their cache hints
 */
export async function getHomeContent(locale: Locale, now: Date): Promise<HomeContent> {
  const [events, activities, stories, announcement] = await Promise.all([
    getUpcomingEvents(locale, now),
    getWeeklyActivities(locale),
    getRecentStories(locale),
    getUrgentAnnouncement(locale, now),
  ]);

  // Everything the page shows, and every hint that purges it when one of them changes
  return {
    events: events.items,
    activities: activities.items,
    stories: stories.items,
    announcement: announcement.items[0],
    cacheHints: [
      ...events.cacheHints,
      ...activities.cacheHints,
      ...stories.cacheHints,
      ...announcement.cacheHints,
    ],
  };
}
