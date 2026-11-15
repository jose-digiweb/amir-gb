// Checks how the What's on opening draws its orbit and puts the next events on it.
import { describe, expect, it } from "vitest";
import { getOrbitBadges, getOrbitPath } from "./helpers";

// Types
import type { EventItem } from "../../lib/events/types";

/**
 * The {@link event} helper
 * @description An upcoming event on a day, for the orbit
 * @param {string} id - The event's id
 * @param {string} startsAt - When it starts
 * @returns {EventItem} The event
 */
function event(id: string, startsAt: string): EventItem {
  return {
    id,
    group: id,
    slug: id,
    href: `/events/${id}/`,
    title: id,
    type: "jeugd",
    status: "gaat door",
    startsAt: new Date(startsAt),
    dayKey: startsAt.slice(0, 10),
    isOnline: false,
    isDutchOnly: false,
  };
}

const slots = [
  { x: 10, y: 10 },
  { x: 20, y: 20 },
  { x: 30, y: 30 },
];

describe("getOrbitPath", () => {
  it("closes on its starting point", () => {
    const path = getOrbitPath({ centreX: 100, centreY: 100, radiusX: 50, radiusY: 20, turn: 0 });
    expect(path).toBe("M50 100 A50 20 0 1 1 150 100 A50 20 0 1 1 50 100");
  });
});

describe("getOrbitBadges", () => {
  it("fills the places in date order and leaves the rest empty", () => {
    const badges = getOrbitBadges(
      [event("a", "2026-11-21T13:30:00Z"), event("b", "2026-12-05T11:00:00Z")],
      slots,
      "en-GB",
    );
    expect(badges.map((badge) => [badge.key, badge.x, badge.day, badge.month])).toEqual([
      ["a", 10, "21", "Nov"],
      ["b", 20, "5", "Dec"],
    ]);
  });

  it("draws no more badges than the orbit has places", () => {
    const events = ["a", "b", "c", "d"].map((id) => event(id, "2026-11-21T13:30:00Z"));
    expect(getOrbitBadges(events, slots, "en-GB")).toHaveLength(3);
  });
});
