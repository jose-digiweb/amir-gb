// Dependencies
import { LOCALE } from "../../i18n/constants";
import { CONTACT, LEGAL, ROUTE } from "../../site/constants";
import { EVENT_STATUS } from "../content/constants";
import { SCHEMA, SEO } from "./constants";
import { toAbsoluteUrl } from "./helpers";

// Types
import type {
  ArticleSchemaInput,
  BreadcrumbStep,
  EventSchemaInput,
  JsonLdNode,
  SiteSchemaInput,
} from "./types";

/**
 * The {@link getOrganizationId} helper
 * @description The anchor every page's structured data uses to point at AMIR-GB
 * @param {URL} site - The site's public address
 * @returns {string} AMIR-GB's node ID
 */
export function getOrganizationId(site: URL): string {
  return toAbsoluteUrl(SCHEMA.ORGANIZATION_ANCHOR, site);
}

/**
 * The {@link getSiteSchemas} helper
 * @description AMIR-GB as a non-profit in Breda serving the whole of the Netherlands, and the website it runs; on every page
 * @param {SiteSchemaInput} input - The site's address, the page's language, the legal name, the logo and the social profiles
 * @returns {JsonLdNode[]} The organisation and the website
 */
export function getSiteSchemas(input: SiteSchemaInput): JsonLdNode[] {
  const { site, locale, legalName, logo, sameAs } = input;
  const organization: JsonLdNode = {
    "@type": SCHEMA.TYPE.NGO,
    "@id": getOrganizationId(site),
    name: SEO.SITE_NAME,
    legalName,
    url: toAbsoluteUrl(ROUTE.HOME, site),
    logo: toAbsoluteUrl(logo, site),
    email: CONTACT.EMAIL,
    telephone: CONTACT.PHONE,
    foundingDate: LEGAL.FOUNDED,
    address: {
      "@type": SCHEMA.TYPE.POSTAL_ADDRESS,
      streetAddress: LEGAL.STREET,
      postalCode: LEGAL.POSTCODE,
      addressLocality: LEGAL.CITY,
      addressCountry: LEGAL.COUNTRY,
    },
    areaServed: { "@type": SCHEMA.TYPE.COUNTRY, name: LEGAL.COUNTRY_NAME },
    identifier: {
      "@type": SCHEMA.TYPE.PROPERTY_VALUE,
      propertyID: SCHEMA.KVK_PROPERTY,
      value: LEGAL.KVK_NUMBER,
    },
    contactPoint: {
      "@type": SCHEMA.TYPE.CONTACT_POINT,
      telephone: CONTACT.PHONE,
      email: CONTACT.EMAIL,
      contactType: SCHEMA.CONTACT_TYPE,
      availableLanguage: [LOCALE.NL, LOCALE.EN, SCHEMA.KRIOLU_TAG, LOCALE.PT],
    },
  };

  // Profiles only count once AMIR has sent their addresses
  if (sameAs.length > 0) {
    organization.sameAs = sameAs;
  }

  // The organisation, and the website in the page's language that it publishes
  return [
    organization,
    {
      "@type": SCHEMA.TYPE.WEBSITE,
      "@id": toAbsoluteUrl(SCHEMA.WEBSITE_ANCHOR, site),
      name: SEO.SITE_NAME,
      url: toAbsoluteUrl(ROUTE.HOME, site),
      inLanguage: locale,
      publisher: { "@id": getOrganizationId(site) },
    },
  ];
}

/**
 * The {@link getEventStatus} helper
 * @description An event's state in schema.org's words
 * @param {EventSchemaInput["status"]} status - The event's state as EmDash stores it
 * @returns {string} Scheduled, rescheduled or cancelled
 */
function getEventStatus(status: EventSchemaInput["status"]): string {
  // A moved event is rescheduled
  if (status === EVENT_STATUS.MOVED) {
    return SCHEMA.EVENT_STATUS.RESCHEDULED;
  }

  // A cancelled one says so
  if (status === EVENT_STATUS.CANCELLED) {
    return SCHEMA.EVENT_STATUS.CANCELLED;
  }

  // Anything else goes ahead
  return SCHEMA.EVENT_STATUS.SCHEDULED;
}

/**
 * The {@link getEventLocations} helper
 * @description Where an event happens: its place, its online room (the event's own page, as the link to join stays hidden until shortly before), or both
 * @param {EventSchemaInput} input - The event
 * @returns {JsonLdNode[]} One location for each way to attend
 */
function getEventLocations(input: EventSchemaInput): JsonLdNode[] {
  const locations: JsonLdNode[] = [];

  // A place with a name or an address
  if (input.placeName || input.address) {
    const place: JsonLdNode = { "@type": SCHEMA.TYPE.PLACE };
    if (input.placeName) {
      place.name = input.placeName;
    }
    if (input.address) {
      place.address = input.address;
    }
    locations.push(place);
  }

  // An online event points at its own page, where the link appears
  if (input.isOnline) {
    locations.push({ "@type": SCHEMA.TYPE.VIRTUAL_LOCATION, url: input.url });
  }

  // Every way to attend
  return locations;
}

/**
 * The {@link getEventSchema} helper
 * @description An event as Google's event results read it: its name, dates, state, how to attend, where, and AMIR-GB as organiser
 * @param {EventSchemaInput} input - The event
 * @returns {JsonLdNode} The event's node
 */
export function getEventSchema(input: EventSchemaInput): JsonLdNode {
  const locations = getEventLocations(input);
  const hasPlace = locations.some((location) => location["@type"] === SCHEMA.TYPE.PLACE);

  // Online, in person, or both
  let attendance: string = SCHEMA.ATTENDANCE.OFFLINE;
  if (input.isOnline) {
    attendance = hasPlace ? SCHEMA.ATTENDANCE.MIXED : SCHEMA.ATTENDANCE.ONLINE;
  }

  // The event, with only the facts the editor gave
  const event: JsonLdNode = {
    "@type": SCHEMA.TYPE.EVENT,
    "@id": input.url,
    name: input.name,
    url: input.url,
    startDate: input.startsAt.toISOString(),
    eventStatus: getEventStatus(input.status),
    eventAttendanceMode: attendance,
    location: locations,
    organizer: { "@id": getOrganizationId(input.site) },
    inLanguage: input.locale,
  };
  if (input.endsAt) {
    event.endDate = input.endsAt.toISOString();
  }
  if (input.originalStartsAt && input.status === EVENT_STATUS.MOVED) {
    event.previousStartDate = input.originalStartsAt.toISOString();
  }
  if (input.image) {
    event.image = toAbsoluteUrl(input.image, input.site);
  }
  if (input.description) {
    event.description = input.description;
  }
  return event;
}

/**
 * The {@link getArticleSchema} helper
 * @description A post as a news article published by AMIR-GB
 * @param {ArticleSchemaInput} input - The post
 * @returns {JsonLdNode} The article's node
 */
export function getArticleSchema(input: ArticleSchemaInput): JsonLdNode {
  const organization = { "@id": getOrganizationId(input.site) };
  const article: JsonLdNode = {
    "@type": SCHEMA.TYPE.NEWS_ARTICLE,
    "@id": input.url,
    headline: input.headline,
    url: input.url,
    mainEntityOfPage: input.url,
    datePublished: input.publishedAt.toISOString(),
    inLanguage: input.locale,
    author: organization,
    publisher: organization,
  };

  // Only the facts the post has
  if (input.image) {
    article.image = toAbsoluteUrl(input.image, input.site);
  }
  if (input.description) {
    article.description = input.description;
  }
  return article;
}

/**
 * The {@link getBreadcrumbSchema} helper
 * @description A page's place in the site, from the home page down
 * @param {BreadcrumbStep[]} steps - Each step's name and path, home first
 * @param {URL} site - The site's public address
 * @returns {JsonLdNode} The breadcrumb trail
 */
export function getBreadcrumbSchema(steps: BreadcrumbStep[], site: URL): JsonLdNode {
  return {
    "@type": SCHEMA.TYPE.BREADCRUMB_LIST,
    itemListElement: steps.map((step, index) => ({
      "@type": SCHEMA.TYPE.LIST_ITEM,
      position: index + 1,
      name: step.name,
      item: toAbsoluteUrl(step.path, site),
    })),
  };
}

/**
 * The {@link renderJsonLd} helper
 * @description A page's structured data as one graph, safe to put in a script tag
 * @param {JsonLdNode[]} nodes - Every node the page describes
 * @returns {string} The JSON, with "<" escaped so no text can close the script
 */
export function renderJsonLd(nodes: JsonLdNode[]): string {
  return JSON.stringify({ "@context": SCHEMA.CONTEXT, "@graph": nodes }).replaceAll("<", "\\u003c");
}
