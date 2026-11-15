// Dependencies
import { EVENT_TIME, ICS, SHARE_URL } from "../constants";

// Types
import type { EventDetail } from "../types";

/**
 * The {@link getMapsHref} helper
 * @description A link that opens a place in the visitor's maps app or Google Maps
 * @param {string} place - The place's name and address
 * @returns {string} The maps link
 */
export function getMapsHref(place: string): string {
  return `${SHARE_URL.MAPS}${encodeURIComponent(place)}`;
}

/**
 * The {@link getWhatsAppShareHref} helper
 * @description A link that opens WhatsApp with a prepared message
 * @param {string} text - The message, the event's address included
 * @returns {string} The WhatsApp link
 */
export function getWhatsAppShareHref(text: string): string {
  return `${SHARE_URL.WHATSAPP}${encodeURIComponent(text)}`;
}

/**
 * The {@link getCalendarFileHref} helper
 * @description The address of an event's calendar file, next to its page
 * @param {string} href - The event page's address, ending in a slash
 * @returns {string} The calendar file's address
 */
export function getCalendarFileHref(href: string): string {
  return `${href.replace(/\/$/, "")}${ICS.EXTENSION}`;
}

/**
 * The {@link getOnlineLinkFrom} helper
 * @description When an event's online link appears on its page: an hour before it starts
 * @param {Pick<EventDetail, "startsAt">} event - The event's start
 * @returns {Date} The moment the link shows
 */
export function getOnlineLinkFrom(event: Pick<EventDetail, "startsAt">): Date {
  return new Date(event.startsAt.getTime() - EVENT_TIME.ONLINE_LINK_LEAD);
}

/**
 * The {@link getPlaceLines} helper
 * @description An event's place name and address, each once, for the facts card
 * @param {Pick<EventDetail, "placeName" | "address">} event - The event's place
 * @returns {string[]} The lines, empty when the event has no place
 */
export function getPlaceLines(event: Pick<EventDetail, "placeName" | "address">): string[] {
  const lines = [event.placeName, event.address].filter((line): line is string => Boolean(line));
  // Drop the address when an editor wrote the same text twice
  return [...new Set(lines)];
}

/**
 * The {@link getPlaceQuery} helper
 * @description What a maps search and a calendar file use as the place: the name and the address on one line
 * @param {Pick<EventDetail, "placeName" | "address">} event - The event's place
 * @returns {string} The place on one line, or empty when the event has no place
 */
export function getPlaceQuery(event: Pick<EventDetail, "placeName" | "address">): string {
  return getPlaceLines(event).join(", ");
}

/**
 * The {@link getShareText} helper
 * @description The message Share on WhatsApp prepares: the event's name, when it is, and its address
 * @param {string} template - The message with {title}, {when} and {url} in it
 * @param {string} title - The event's name
 * @param {string} when - When the event is
 * @param {string} url - The event page's full address
 * @returns {string} The message
 */
export function getShareText(template: string, title: string, when: string, url: string): string {
  return template.replace("{title}", title).replace("{when}", when).replace("{url}", url);
}

/**
 * The {@link isOnlineOnly} helper
 * @description Whether an event happens only online: it has an online link and no place
 * @param {Pick<EventDetail, "onlineLink" | "placeName" | "address">} event - The event's online link and place
 * @returns {boolean} True when there is nowhere to go but online
 */
export function isOnlineOnly(
  event: Pick<EventDetail, "onlineLink" | "placeName" | "address">,
): boolean {
  return Boolean(event.onlineLink) && !getPlaceQuery(event);
}
