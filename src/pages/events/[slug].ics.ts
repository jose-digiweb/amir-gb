// Dependencies
import { getLocale } from "../../i18n/helpers";
import { cacheContentPage } from "../../lib/content/helpers";
import { ICS } from "../../lib/events/constants";
import { buildCalendarFile } from "../../lib/events/helpers";
import { readEventEntry } from "../../lib/events/queries";

// Types
import type { APIRoute } from "astro";

// A calendar file is made from CMS content, so it is made per request
export const prerender = false;

/**
 * The {@link GET} endpoint
 * @description Serves an event as a calendar file, so Add to calendar puts it in the visitor's calendar app
 * @param {APIContext} context - The request's context
 * @returns {Promise<Response>} The calendar file, or not found
 */
export const GET: APIRoute = async ({ params, currentLocale, url, cache }) => {
  const read = await readEventEntry(getLocale(currentLocale), params.slug ?? "");
  const event = read.items[0];
  // An address without an event is not found
  if (!event) {
    return new Response(null, { status: 404 });
  }
  // Cache the file at the edge, then write it
  cacheContentPage(cache, read.cacheHints);
  const body = buildCalendarFile({ event, url: new URL(event.href, url).href, now: new Date() });
  return new Response(body, {
    headers: {
      "Content-Type": ICS.CONTENT_TYPE,
      "Content-Disposition": `inline; filename="${event.slug}${ICS.EXTENSION}"`,
    },
  });
};
