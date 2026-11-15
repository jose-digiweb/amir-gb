// Checks how the archive opening lays the recent months and their events on the timeline.
import { describe, expect, it } from "vitest";
import { ARCHIVE_DRAWINGS, KNOT_SIDE } from "./constants";
import { getLinePath, getTimelineDrawing } from "./helpers";

// Types
import type { EventItem, TimelineMonth } from "../../../lib/events/types";

/**
 * The {@link event} helper
 * @description A past event of a kind, for the timeline
 * @param {string} id - The event's id
 * @returns {EventItem} The event
 */
function event(id: string): EventItem {
  return {
    id,
    group: id,
    slug: id,
    href: `/events/${id}/`,
    title: id,
    type: "cultuur",
    status: "gaat door",
    startsAt: new Date("2026-10-10T13:00:00Z"),
    dayKey: "2026-10-10",
    isOnline: false,
    isDutchOnly: false,
  };
}

const months: TimelineMonth[] = [
  { key: "2026-08", year: 2026, month: 8, events: [] },
  { key: "2026-09", year: 2026, month: 9, events: [event("sep")] },
  { key: "2026-10", year: 2026, month: 10, events: ["a", "b", "c", "d", "e"].map(event) },
  { key: "2026-11", year: 2026, month: 11, events: [] },
];

describe("getLinePath", () => {
  it("bends each step halfway between its points", () => {
    expect(
      getLinePath([
        { x: 0, y: 10 },
        { x: 100, y: 50 },
      ]),
    ).toBe("M0 10 C50 10 50 50 100 50");
  });
});

describe("getTimelineDrawing", () => {
  it("fills the desktop's four points with the four months and every event", () => {
    const drawing = getTimelineDrawing(months, ARCHIVE_DRAWINGS.DESKTOP, "en-GB");
    expect(drawing.months.map((mark) => mark.label)).toEqual(["AUG", "SEPT", "OCT", "NOV"]);
    expect(drawing.knots).toHaveLength(6);
    expect(drawing.beads).toHaveLength(4);
  });

  it("shows the latest three months on a phone, at most three events each", () => {
    const drawing = getTimelineDrawing(months, ARCHIVE_DRAWINGS.PHONE, "en-GB");
    expect(drawing.months.map((mark) => mark.key)).toEqual(["2026-09", "2026-10", "2026-11"]);
    expect(drawing.knots).toHaveLength(4);
  });

  it("hangs the events on their month's side and puts the label on the other", () => {
    const drawing = getTimelineDrawing(months, ARCHIVE_DRAWINGS.DESKTOP, "en-GB");
    const slot = ARCHIVE_DRAWINGS.DESKTOP.slots[1];
    const knot = drawing.knots[0];
    expect(slot?.side).toBe(KNOT_SIDE.DOWN);
    expect(knot?.y).toBeGreaterThan(slot?.y ?? 0);
    expect(drawing.months[1]?.y).toBeLessThan(slot?.y ?? 0);
  });
});
