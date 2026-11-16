// Types
import type { CacheHint, ContentSeo, PortableTextBlock } from "emdash";
import type { MediaImage, WeeklyActivity } from "../content/types";
import type { EVENT_STATUS, EVENT_TYPE, FOR_WHOM } from "../content/constants";
import type {
  EVENT_LANGUAGES,
  EVENT_PHASE,
  EVENTS_PARAM,
  EVENTS_VIEW,
  WEEKDAY_STYLE,
} from "./constants";

/**
 * The {@link EventType} type
 * @description One of the {@link EVENT_TYPE} values
 */
export type EventType = (typeof EVENT_TYPE)[keyof typeof EVENT_TYPE];

/**
 * The {@link EventStatus} type
 * @description One of the {@link EVENT_STATUS} values
 */
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

/**
 * The {@link ForWhom} type
 * @description One of the {@link FOR_WHOM} values
 */
export type ForWhom = (typeof FOR_WHOM)[keyof typeof FOR_WHOM];

/**
 * The {@link EventLanguage} type
 * @description One of the {@link EVENT_LANGUAGES}
 */
export type EventLanguage = (typeof EVENT_LANGUAGES)[number];

/**
 * The {@link EventsView} type
 * @description One of the {@link EVENTS_VIEW} values
 */
export type EventsView = (typeof EVENTS_VIEW)[keyof typeof EVENTS_VIEW];

/**
 * The {@link EventsParam} type
 * @description One of the {@link EVENTS_PARAM} values
 */
export type EventsParam = (typeof EVENTS_PARAM)[keyof typeof EVENTS_PARAM];

/**
 * The {@link EventPhase} type
 * @description One of the {@link EVENT_PHASE} values
 */
export type EventPhase = (typeof EVENT_PHASE)[keyof typeof EVENT_PHASE];

/**
 * The {@link EventItem} type
 * @description An event as the lists, the calendar and the archive show it
 */
export type EventItem = {
  id: string;
  group: string;
  slug: string;
  href: string;
  title: string;
  type: EventType;
  status: EventStatus;
  startsAt: Date;
  endsAt?: Date;
  dayKey: string;
  placeName?: string;
  isOnline: boolean;
  image?: MediaImage;
  summary?: string;
  isDutchOnly: boolean;
};

/**
 * The {@link EventDetail} type
 * @description An event as its own page shows it
 */
export type EventDetail = EventItem & {
  originalStartsAt?: Date;
  forWhom: ForWhom;
  address?: string;
  onlineLink?: string;
  registrationLink?: string;
  languages: EventLanguage[];
  content?: PortableTextBlock[];
  seo?: ContentSeo;
};

/**
 * The {@link MonthGroup} type
 * @description The events of one month in the list, with the month's heading
 */
export type MonthGroup = {
  key: string;
  title: string;
  events: EventItem[];
};

/**
 * The {@link CalendarDay} type
 * @description One day of the month grid, with its events and the weekly activities on its weekday
 */
export type CalendarDay = {
  key: string;
  day: number;
  label: string;
  href: string;
  isPast: boolean;
  isToday: boolean;
  isPicked: boolean;
  events: EventItem[];
  weekly: WeeklyActivity[];
};

/**
 * The {@link CalendarMonth} type
 * @description The month grid: its title, the empty places before the first, its days and the way to the months around it
 */
export type CalendarMonth = {
  key: string;
  title: string;
  name: string;
  leading: number;
  days: CalendarDay[];
  previousHref: string;
  nextHref: string;
};

/**
 * The {@link Story} type
 * @description A Story post with photos from an event, as the archive and the ended event page link it
 */
export type Story = {
  group: string;
  href: string;
};

/**
 * The {@link PastEvent} type
 * @description An event that has ended, with the story of the day when one exists
 */
export type PastEvent = EventItem & {
  storyHref?: string;
};

/**
 * The {@link ArchiveYear} type
 * @description A year of the archive and whether it is the one shown
 */
export type ArchiveYear = {
  year: string;
  href: string;
  isPicked: boolean;
};

/**
 * The {@link EventsContent} type
 * @description What the list and the calendar share: the weekly activities, the next few events of every kind for the opening, and the latest past events
 */
export type EventsContent = {
  activities: WeeklyActivity[];
  orbit: EventItem[];
  past: EventItem[];
  cacheHints: CacheHint[];
};

/**
 * The {@link EventsListContent} type
 * @description What the list shows: the next event, the rest by month, and the shared parts
 */
export type EventsListContent = EventsContent & {
  next?: EventItem;
  months: MonthGroup[];
};

/**
 * The {@link EventsCalendarContent} type
 * @description What the calendar shows: the month grid, the picked day's events, the next event after an empty month, and the shared parts
 */
export type EventsCalendarContent = EventsContent & {
  month: CalendarMonth;
  picked?: CalendarDay;
  nextAfter?: EventItem;
  hasMonthEvents: boolean;
};

/**
 * The {@link EventPageContent} type
 * @description What an event page shows: the event, its story when it has ended, and the events after it
 */
export type EventPageContent = {
  event: EventDetail;
  phase: EventPhase;
  storyHref?: string;
  others: EventItem[];
  cacheHints: CacheHint[];
};

/**
 * The {@link ArchiveContent} type
 * @description What the archive shows: the years, the picked year's events and the opening's timeline of recent months
 */
export type ArchiveContent = {
  years: ArchiveYear[];
  year?: string;
  events: PastEvent[];
  timeline: TimelineMonth[];
  cacheHints: CacheHint[];
};

/**
 * The {@link YearMonth} type
 * @description A month of a year, the month counted from 1
 */
export type YearMonth = {
  year: number;
  month: number;
};

/**
 * The {@link EventsQuery} type
 * @description The query parameters an events link carries; an empty one is left out
 */
export type EventsQuery = Partial<Record<EventsParam, string>>;

/**
 * The {@link TypeChip} type
 * @description One filter chip: a kind of event, or none for All, with its link and whether it is the current filter
 */
export type TypeChip = {
  type?: EventType;
  href: string;
  isCurrent: boolean;
};

/**
 * The {@link CalendarQuery} type
 * @description What the calendar page asks for
 */
export type CalendarQuery = {
  /** The month to show. */
  month: YearMonth;
  /** The day picked in the address, if any. */
  picked?: string;
  /** The kind of event to show, or all. */
  type?: EventType;
  /** The calendar page's path in its language. */
  path: string;
};

/**
 * The {@link CalendarInput} type
 * @description What the month grid is built from
 */
export type CalendarInput = {
  /** The month to show. */
  month: YearMonth;
  /** The month's events, soonest first. */
  events: EventItem[];
  /** The weekly activities, Monday first. */
  activities: WeeklyActivity[];
  /** Today, YYYY-MM-DD in Dutch time. */
  today: string;
  /** The day picked in the address, if any. */
  picked?: string;
  /** The page's language. */
  locale: string;
  /** The calendar page's path in its language. */
  path: string;
  /** The type filter, carried on every link. */
  type?: EventType;
};

/**
 * The {@link CalendarFileInput} type
 * @description What the calendar file says about an event
 */
export type CalendarFileInput = {
  /** The event. */
  event: Pick<
    EventDetail,
    "group" | "title" | "summary" | "startsAt" | "endsAt" | "placeName" | "address" | "onlineLink"
  >;
  /** The event page's full address. */
  url: string;
  /** The moment the file is made. */
  now: Date;
};

/**
 * The {@link TimelineMonth} type
 * @description One month on the archive opening's timeline, with the events that hang from it
 */
export type TimelineMonth = {
  key: string;
  year: number;
  month: number;
  events: EventItem[];
};

/**
 * The {@link WeekdayStyle} type
 * @description One of the {@link WEEKDAY_STYLE} values
 */
export type WeekdayStyle = (typeof WEEKDAY_STYLE)[keyof typeof WEEKDAY_STYLE];
