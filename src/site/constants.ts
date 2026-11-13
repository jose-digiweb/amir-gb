// Dependencies
import { siFacebook, siInstagram, siTiktok } from "simple-icons";

/**
 * The {@link ROUTE} constant
 * @description Each page's path in the default language; other languages get their prefix from Astro
 */
export const ROUTE = {
  HOME: "/",
  GET_HELP: "/get-help/",
  EVENTS: "/events/",
  NEWS: "/news/",
  ABOUT: "/about/",
  JOIN: "/join/",
  CONTACT: "/contact/",
  DONATE: "/donate/",
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
  KVK: "KvK 42120588",
  RSIN: "RSIN 869821118",
} as const;

/**
 * The {@link PENDING_LINK} constant
 * @description Where a link points until AMIR sends its real address
 */
export const PENDING_LINK = "#";

/**
 * The {@link SOCIAL_LINKS} constant
 * @description AMIR-GB's social profiles, with their Simple Icons mark; addresses still to come from AMIR
 */
export const SOCIAL_LINKS = [
  { name: siFacebook.title, href: PENDING_LINK, path: siFacebook.path },
  { name: siTiktok.title, href: PENDING_LINK, path: siTiktok.path },
  { name: siInstagram.title, href: PENDING_LINK, path: siInstagram.path },
] as const;
