// Dependencies
import { ICS } from "../constants";
import { getPlaceQuery } from "./links";

// Types
import type { CalendarFileInput } from "../types";

/**
 * The {@link toCalendarTime} helper
 * @description Writes a moment as a calendar file's UTC time
 * @param {Date} date - The moment
 * @returns {string} For example 20261121T133000Z
 */
export function toCalendarTime(date: Date): string {
  return date
    .toISOString()
    .replace(/\.\d{3}Z$/, "Z")
    .replaceAll("-", "")
    .replaceAll(":", "");
}

/**
 * The {@link escapeCalendarText} helper
 * @description Escapes a text value as calendar files require
 * @param {string} text - The text
 * @returns {string} The text with backslashes, commas, semicolons and line breaks escaped
 */
export function escapeCalendarText(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replace(/\r?\n/g, "\\n");
}

/**
 * The {@link foldCalendarLine} helper
 * @description Folds a long line at 75 bytes, each new piece starting with a space, as calendar files require
 * @param {string} line - The line
 * @returns {string} The folded line
 */
export function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  const pieces: string[] = [];
  let piece = "";
  // Add characters until the next would pass the limit, then start a new piece
  for (const character of line) {
    const limit = pieces.length === 0 ? ICS.LINE_OCTETS : ICS.LINE_OCTETS - 1;
    if (encoder.encode(piece + character).length > limit) {
      pieces.push(piece);
      piece = "";
    }
    piece += character;
  }
  pieces.push(piece);
  // Join the pieces, each after the first indented by one space
  return pieces.join(`${ICS.LINE_BREAK} `);
}

/**
 * The {@link buildCalendarFile} helper
 * @description Writes an event as a calendar file that phones and calendar apps add in one tap
 * @param {CalendarFileInput} input - The event, its page and the moment the file is made
 * @returns {string} The calendar file's text
 */
export function buildCalendarFile({ event, url, now }: CalendarFileInput): string {
  const location = getPlaceQuery(event) || event.onlineLink;
  const description = [event.summary, url].filter(Boolean).join("\n\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${ICS.PRODUCT}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${event.group}@${ICS.UID_DOMAIN}`,
    `DTSTAMP:${toCalendarTime(now)}`,
    `DTSTART:${toCalendarTime(event.startsAt)}`,
  ];
  // An end time only when the event has one
  if (event.endsAt) {
    lines.push(`DTEND:${toCalendarTime(event.endsAt)}`);
  }
  lines.push(`SUMMARY:${escapeCalendarText(event.title)}`);
  lines.push(`DESCRIPTION:${escapeCalendarText(description)}`);
  // A location only when the event has a place or an online link
  if (location) {
    lines.push(`LOCATION:${escapeCalendarText(location)}`);
  }
  lines.push(`URL:${url}`, "END:VEVENT", "END:VCALENDAR");
  // Fold every line and end each with the line break calendar files use
  return `${lines.map((line) => foldCalendarLine(line)).join(ICS.LINE_BREAK)}${ICS.LINE_BREAK}`;
}
