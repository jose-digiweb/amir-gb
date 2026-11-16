// Dependencies
import { siFacebook, siInstagram, siTiktok } from "simple-icons";
import { LOCALE } from "../i18n/constants";

// Types
import type { Locale } from "../i18n/types";

/**
 * The {@link ROUTE} constant
 * @description Each page's path in the default language; other languages get their prefix from Astro
 */
export const ROUTE = {
  HOME: "/",
  GET_HELP: "/get-help/",
  EVENTS: "/events/",
  EVENTS_CALENDAR: "/events/calendar/",
  EVENTS_ARCHIVE: "/events/archive/",
  NEWS: "/news/",
  ABOUT: "/about/",
  JOIN: "/join/",
  CONTACT: "/contact/",
  DONATE: "/donate/",
  PRIVACY: "/privacy/",
} as const;

/**
 * The {@link PREFETCH_ON_HOVER} constant
 * @description The prefetch strategy for links that are on every page (header, footer, languages), so they load only when hovered instead of whenever they show
 */
export const PREFETCH_ON_HOVER = "hover";

/**
 * The {@link SPECULATION_RULES} constant
 * @description Lets Chrome render a page of the site in full once a visitor shows intent to open it, so the tap shows it at once; never the admin or a calendar file
 */
export const SPECULATION_RULES = {
  prerender: [
    {
      where: {
        and: [
          { href_matches: "/*" },
          { not: { href_matches: "/_emdash/*" } },
          { not: { href_matches: "/*.ics" } },
        ],
      },
      eagerness: "moderate",
    },
  ],
} as const;

/**
 * The {@link MAIN_NAV} constant
 * @description The header and menu links, in order
 */
export const MAIN_NAV = [
  { label: "nav.getHelp", route: ROUTE.GET_HELP },
  { label: "nav.events", route: ROUTE.EVENTS },
  { label: "nav.news", route: ROUTE.NEWS },
  { label: "nav.about", route: ROUTE.ABOUT },
  { label: "nav.join", route: ROUTE.JOIN },
  { label: "nav.contact", route: ROUTE.CONTACT },
] as const;

/**
 * The {@link FOOTER_NAV} constant
 * @description The footer's page links, in order; Donate follows them as the action
 */
export const FOOTER_NAV = [
  { label: "nav.getHelp", route: ROUTE.GET_HELP },
  { label: "nav.events", route: ROUTE.EVENTS },
  { label: "nav.news", route: ROUTE.NEWS },
  { label: "nav.about", route: ROUTE.ABOUT },
  { label: "nav.contact", route: ROUTE.CONTACT },
] as const;

/**
 * The {@link ERROR_PAGE_LINKS} constant
 * @description The four ways back in that the 404 page offers
 */
export const ERROR_PAGE_LINKS = [
  { label: "nav.getHelp", route: ROUTE.GET_HELP },
  { label: "nav.events", route: ROUTE.EVENTS },
  { label: "nav.news", route: ROUTE.NEWS },
  { label: "nav.contact", route: ROUTE.CONTACT },
] as const;

/**
 * The {@link CONTACT} constant
 * @description How to reach AMIR-GB, from its own fact sheet
 */
export const CONTACT = {
  PHONE: "+31 6 15 18 87 45",
  PHONE_HREF: "tel:+31615188745",
  WHATSAPP_HREF: "https://wa.me/31615188745",
  EMAIL: "amirgbnederland@gmail.com",
  EMAIL_HREF: "mailto:amirgbnederland@gmail.com",
} as const;

/**
 * The {@link LEGAL} constant
 * @description The registered address and numbers shown in the footer's small print
 */
export const LEGAL = {
  STREET: "Willem van Kesselstraat 21",
  POSTCODE_CITY: "4827 LJ Breda",
  POSTCODE: "4827 LJ",
  CITY: "Breda",
  COUNTRY: "NL",
  COUNTRY_NAME: "Nederland",
  FOUNDED: "2026-07-20",
  KVK: "KvK 42120588",
  RSIN: "RSIN 869821118",
  KVK_NUMBER: "42120588",
  RSIN_NUMBER: "869821118",
  MAPS_HREF:
    "https://www.google.com/maps/search/?api=1&query=Willem%20van%20Kesselstraat%2021%2C%204827%20LJ%20Breda",
} as const;

/**
 * The {@link PENDING_LINK} constant
 * @description Where a link points until AMIR sends its real address
 */
export const PENDING_LINK = "#";

/**
 * The {@link SOCIAL_PROFILE} constant
 * @description AMIR-GB's social profiles by network, with their Simple Icons mark; addresses still to come from AMIR
 */
export const SOCIAL_PROFILE = {
  FACEBOOK: { name: siFacebook.title, href: PENDING_LINK, path: siFacebook.path },
  TIKTOK: { name: siTiktok.title, href: PENDING_LINK, path: siTiktok.path },
  INSTAGRAM: { name: siInstagram.title, href: PENDING_LINK, path: siInstagram.path },
} as const;

/**
 * The {@link SOCIAL_LINKS} constant
 * @description AMIR-GB's social profiles in the order the site lists them
 */
export const SOCIAL_LINKS = [
  SOCIAL_PROFILE.FACEBOOK,
  SOCIAL_PROFILE.TIKTOK,
  SOCIAL_PROFILE.INSTAGRAM,
] as const;

/**
 * The {@link VALUE} constant
 * @description AMIR-GB's motto, as the motto chips and the home opening show it
 */
export const VALUE = {
  SOLIDARITY: "solidarity",
  WELCOME: "welcome",
  UNITY: "unity",
  DIGNITY: "dignity",
} as const;

/**
 * The {@link VALUE_LABEL} constant
 * @description The translation key of each value's name
 */
export const VALUE_LABEL = {
  [VALUE.SOLIDARITY]: "values.solidarity",
  [VALUE.WELCOME]: "values.welcome",
  [VALUE.UNITY]: "values.unity",
  [VALUE.DIGNITY]: "values.dignity",
} as const;

/**
 * The {@link MOTTO_STACKED_LOCALES} constant
 * @description The languages whose motto pairs are wider than a phone or tablet column, so below desktop the motto lists one label per row
 */
export const MOTTO_STACKED_LOCALES: readonly Locale[] = [LOCALE.NL, LOCALE.PT];

/**
 * The {@link ANSWER_LANGUAGE} constant
 * @description The languages AMIR-GB can answer in
 */
export const ANSWER_LANGUAGE = {
  NL: "nl",
  EN: "en",
  PT: "pt",
  KRIOL: "kriol",
} as const;

/**
 * The {@link ANSWER_LANGUAGES} constant
 * @description The answer languages in the order the forms show them
 */
export const ANSWER_LANGUAGES = [
  ANSWER_LANGUAGE.NL,
  ANSWER_LANGUAGE.EN,
  ANSWER_LANGUAGE.KRIOL,
  ANSWER_LANGUAGE.PT,
] as const;

/**
 * The {@link ANSWER_LANGUAGE_LABEL} constant
 * @description The translation key of each answer language's name, in that language
 */
export const ANSWER_LANGUAGE_LABEL = {
  [ANSWER_LANGUAGE.NL]: "answerLanguage.nl",
  [ANSWER_LANGUAGE.EN]: "answerLanguage.en",
  [ANSWER_LANGUAGE.PT]: "answerLanguage.pt",
  [ANSWER_LANGUAGE.KRIOL]: "answerLanguage.kriol",
} as const;

/**
 * The {@link ANSWER_LANGUAGE_IN_SENTENCE} constant
 * @description The translation key of each answer language as a sentence names it ("in Portuguese")
 */
export const ANSWER_LANGUAGE_IN_SENTENCE = {
  [ANSWER_LANGUAGE.NL]: "answerLanguageInSentence.nl",
  [ANSWER_LANGUAGE.EN]: "answerLanguageInSentence.en",
  [ANSWER_LANGUAGE.PT]: "answerLanguageInSentence.pt",
  [ANSWER_LANGUAGE.KRIOL]: "answerLanguageInSentence.kriol",
} as const;
