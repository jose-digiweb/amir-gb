// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { getEmDashCollection } from "emdash";
import { DEFAULT_LOCALE } from "../../i18n/constants";
import { ROUTE } from "../../site/constants";
import { COLLECTION, DAY_MS, FIELD, HOME_LIMIT, POST_TYPE, SORT } from "./constants";
import { compareWeekly, isStripActive, mergeWithDutch } from "./helpers";

// Types
import type { CacheHint, CollectionFilter, ContentEntry, EmDashCollections } from "emdash";
import type { Locale } from "../../i18n/types";
import type {
  HomeAnnouncement,
  HomeContent,
  HomeEvent,
  HomeStory,
  Localised,
  TranslationMeta,
  WeeklyActivity,
} from "./types";

/**
 * The {@link Read} type
 * @description What a home query returns: its items and the cache hints that purge the page when they change
 */
type Read<T> = {
  items: T[];
  cacheHints: CacheHint[];
};

/**
 * The {@link Entry} type
 * @description An entry of a collection with its language fields
 */
type Entry<C extends keyof EmDashCollections> = ContentEntry<
  EmDashCollections[C] & TranslationMeta
>;

/**
 * The {@link readLocalised} helper
 * @description Reads a collection in the page's language and, outside Dutch, the Dutch entries without a translation
 * @param {C} collection - The collection to read
 * @param {Locale} locale - The page's language
 * @param {CollectionFilter} filter - The filter both languages share
 * @returns {Promise<Read<Localised<Entry<C>>>>} One entry per translation group, with the cache hints
 */
async function readLocalised<C extends keyof EmDashCollections>(
  collection: C,
  locale: Locale,
  filter: CollectionFilter,
): Promise<Read<Localised<Entry<C>>>> {
  const local = await getEmDashCollection<C, EmDashCollections[C] & TranslationMeta>(collection, {
    ...filter,
    locale,
  });

  // Dutch pages need nothing else
  if (locale === DEFAULT_LOCALE) {
    return {
      items: mergeWithDutch(local.entries, []),
      cacheHints: [local.cacheHint],
    };
  }

  // Other languages add the Dutch entries that have no translation yet
  const dutch = await getEmDashCollection<C, EmDashCollections[C] & TranslationMeta>(collection, {
    ...filter,
    locale: DEFAULT_LOCALE,
  });
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
 * @returns {Promise<Read<HomeEvent>>} Up to four upcoming events
 */
export async function getUpcomingEvents(locale: Locale, now: Date): Promise<Read<HomeEvent>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.EVENTS, locale, {
    status: "published",
    where: { [FIELD.STARTS_AT]: { gte: new Date(now.getTime() - DAY_MS).toISOString() } },
    orderBy: { [FIELD.STARTS_AT]: SORT.ASC },
    limit: HOME_LIMIT.EVENTS_READ,
  });

  // Shape each event for its card, keep the ones still to start, and the soonest four across both languages
  const events = items.map(({ entry, isDutchOnly }) => ({
    id: entry.data.id,
    href: getRelativeLocaleUrl(locale, `${ROUTE.EVENTS}${entry.data.slug ?? ""}/`),
    title: entry.data.title,
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
 * The {@link getWeeklyActivities} helper
 * @description Reads the weekly activities, Monday first
 * @param {Locale} locale - The page's language
 * @returns {Promise<Read<WeeklyActivity>>} Every published weekly activity
 */
export async function getWeeklyActivities(locale: Locale): Promise<Read<WeeklyActivity>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.ACTIVITIES, locale, {
    status: "published",
  });

  // Shape each activity for its tile and order them through the week
  const activities = items.map(({ entry, isDutchOnly }) => ({
    id: entry.data.id,
    name: entry.data.name,
    weekday: entry.data.weekday,
    startTime: entry.data.start_time,
    endTime: entry.data.end_time,
    tileColour: entry.data.tile_colour,
    isDutchOnly,
  }));
  activities.sort(compareWeekly);
  return { items: activities, cacheHints };
}

/**
 * The {@link getRecentStories} helper
 * @description Reads the newest Story posts for Life at AMIR
 * @param {Locale} locale - The page's language
 * @returns {Promise<Read<HomeStory>>} Up to seven stories, newest first, each with a photo
 */
export async function getRecentStories(locale: Locale): Promise<Read<HomeStory>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.POSTS, locale, {
    status: "published",
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
 * @returns {Promise<Read<HomeAnnouncement>>} The one announcement to show, or none
 */
export async function getUrgentAnnouncement(
  locale: Locale,
  now: Date,
): Promise<Read<HomeAnnouncement>> {
  const { items, cacheHints } = await readLocalised(COLLECTION.POSTS, locale, {
    status: "published",
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
