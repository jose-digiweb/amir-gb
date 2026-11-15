// Dependencies
import { getEventDay } from "../../lib/content/helpers";

// Types
import type { EventItem } from "../../lib/events/types";
import type { Point } from "../opening/types";
import type { Orbit, OrbitBadgeSpot } from "./types";

/**
 * The {@link getOrbitPath} helper
 * @description Draws a tilted orbit as one closed path of two arcs, so a stitched thread can sew along it
 * @param {Orbit} orbit - The orbit's centre, radii and tilt
 * @returns {string} The SVG path, starting and ending at the orbit's left end
 */
export function getOrbitPath(orbit: Orbit): string {
  const angle = (orbit.turn * Math.PI) / 180;
  const dx = Math.round(orbit.radiusX * Math.cos(angle) * 100) / 100;
  const dy = Math.round(orbit.radiusX * Math.sin(angle) * 100) / 100;
  const start = `${orbit.centreX - dx} ${orbit.centreY - dy}`;
  const end = `${orbit.centreX + dx} ${orbit.centreY + dy}`;
  const arc = `A${orbit.radiusX} ${orbit.radiusY} ${orbit.turn} 1 1`;

  // Over the top to the right end, then back under to the left end
  return `M${start} ${arc} ${end} ${arc} ${start}`;
}

/**
 * The {@link getOrbitBadges} helper
 * @description Puts the next events on the orbit's places in date order; with fewer events the later places stay empty
 * @param {EventItem[]} events - The next events, soonest first
 * @param {readonly Point[]} slots - The places on the orbit, in date order
 * @param {string} locale - The page's language
 * @returns {OrbitBadgeSpot[]} One badge per event that has a place
 */
export function getOrbitBadges(
  events: EventItem[],
  slots: readonly Point[],
  locale: string,
): OrbitBadgeSpot[] {
  return events.slice(0, slots.length).flatMap((event, index) => {
    const slot = slots[index];

    // An event without a place is left out
    if (!slot) {
      return [];
    }

    // The badge at its place, with its day, month and kind
    const { day, month } = getEventDay(event.startsAt, locale);
    return [{ key: event.id, x: slot.x, y: slot.y, day, month, type: event.type }];
  });
}
