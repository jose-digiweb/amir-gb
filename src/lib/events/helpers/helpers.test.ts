// Dependencies
import { describe, expect, it } from "vitest";
import {
  buildCalendarFile,
  buildCalendarMonth,
  buildEventsHref,
  escapeCalendarText,
  foldCalendarLine,
  getArchiveDate,
  getCountLabel,
  getDayKey,
  getEventPhase,
  getEventTimes,
  getEventWhere,
  getLongDate,
  getMovedFromDate,
  getPlaceLines,
  getTypeChips,
  getWeekdayNames,
  groupByMonth,
  isOnlineOnly,
  parseDay,
  parseEventType,
  parseMonth,
  parseYear,
  shiftMonth,
} from ".";

// Types
import type { WeeklyActivity } from "../../content/types";
import type { EventItem } from "../types";

const event = (id: string, startsAt: string, endsAt?: string): EventItem => ({
  id,
  group: id,
  slug: id,
  href: `/events/${id}/`,
  title: id,
  type: "gemeenschap",
  status: "gaat door",
  startsAt: new Date(startsAt),
  endsAt: endsAt ? new Date(endsAt) : undefined,
  dayKey: getDayKey(new Date(startsAt)),
  isOnline: false,
  isDutchOnly: false,
});

const weekly: WeeklyActivity = {
  id: "w",
  name: "Drop-in help",
  weekday: "dinsdag",
  startTime: "10:00",
  endTime: "13:00",
  tileColour: "forest",
  isDutchOnly: false,
};

describe("event dates", () => {
  it("puts a late evening start on its Dutch day", () => {
    expect(getDayKey(new Date("2026-11-21T23:30:00Z"))).toBe("2026-11-22");
  });
  it("writes the long date without a comma and the times or a start alone", () => {
    const meeting = event("m", "2026-11-21T13:30:00Z", "2026-11-21T17:00:00Z");
    expect(getLongDate(meeting.startsAt, "en-GB")).toBe("Saturday 21 November 2026");
    expect(getEventTimes(meeting, "en-GB", "to", "From {time}")).toBe("14:30 to 18:00");
    expect(getEventTimes(event("h", "2027-01-20T17:00:00Z"), "nl-NL", "tot", "Vanaf {time}")).toBe(
      "Vanaf 18:00",
    );
    expect(getArchiveDate(meeting.startsAt, "en-GB")).toBe("Sat 21 Nov 2026");
  });
  it("ends an event at its end, or at its start without one", () => {
    const now = new Date("2026-11-21T15:00:00Z");
    expect(getEventPhase(event("a", "2026-11-21T13:30:00Z", "2026-11-21T17:00:00Z"), now)).toBe(
      "upcoming",
    );
    expect(getEventPhase(event("b", "2026-11-21T13:30:00Z"), now)).toBe("ended");
  });
});

describe("address parameters", () => {
  it("keeps only real kinds, months, days and years", () => {
    expect(parseEventType("cultuur")).toBe("cultuur");
    expect(parseEventType("party")).toBeUndefined();
    expect(parseMonth("2026-12", "2026-11-15")).toEqual({ year: 2026, month: 12 });
    expect(parseMonth("2026-13", "2026-11-15")).toEqual({ year: 2026, month: 11 });
    expect(parseDay("2026-11-31")).toBeUndefined();
    expect(parseDay("2026-11-30")).toBe("2026-11-30");
    expect(parseYear("26")).toBeUndefined();
  });
  it("moves across years and leaves empty parameters out of links", () => {
    expect(shiftMonth({ year: 2026, month: 12 }, 1)).toEqual({ year: 2027, month: 1 });
    expect(buildEventsHref("/en/events/", { type: undefined })).toBe("/en/events/");
    expect(
      buildEventsHref("/events/calendar/", { type: "jeugd", day: "2026-11-21" }, "calendar"),
    ).toBe("/events/calendar/?type=jeugd&day=2026-11-21#calendar");
  });
  it("offers All first and marks the current filter", () => {
    const chips = getTypeChips("/events/", "hulp");
    expect(chips.map((chip) => chip.isCurrent)).toEqual([false, false, true, false, false]);
    expect(chips[0].href).toBe("/events/");
  });
});

describe("the list", () => {
  it("groups by month and calls the next event's month later in it", () => {
    const groups = groupByMonth(
      [event("a", "2026-11-27T18:00:00Z"), event("b", "2026-12-05T17:00:00Z")],
      "en-GB",
      "Later in {month}",
      "2026-11",
    );
    expect(groups.map((group) => group.title)).toEqual(["Later in November", "December"]);
  });
  it("counts in the page's language and joins the place with online", () => {
    expect(getCountLabel(1, "en-GB", "{count} event", "{count} events")).toBe("1 event");
    expect(getCountLabel(2, "en-GB", "{count} event", "{count} events")).toBe("2 events");
    expect(getEventWhere({ placeName: "Library", isOnline: true }, "online", "and")).toBe(
      "Library and online",
    );
  });
});

describe("the calendar", () => {
  const month = buildCalendarMonth({
    month: { year: 2026, month: 11 },
    events: [event("m", "2026-11-21T13:30:00Z")],
    activities: [weekly],
    today: "2026-11-15",
    locale: "en-GB",
    path: "/events/calendar/",
  });
  it("starts on Monday and links the months around it", () => {
    expect(month.leading).toBe(6);
    expect(month.days).toHaveLength(30);
    expect(month.title).toBe("November 2026");
    expect(month.previousHref).toBe("/events/calendar/?month=2026-10#calendar");
    expect(getWeekdayNames("nl-NL", "narrow")).toEqual(["M", "D", "W", "D", "V", "Z", "Z"]);
  });
  it("marks today, the past, the weekly days and opens on the next event", () => {
    const day = (number: number) => month.days[number - 1];
    expect(day(15).isToday).toBe(true);
    expect(day(14).isPast).toBe(true);
    expect(day(17).weekly).toHaveLength(1);
    expect(day(21).isPicked).toBe(true);
    expect(day(21).events).toHaveLength(1);
  });
});

describe("a moved event", () => {
  it("strikes its old date only when it moved and the editor gave one", () => {
    const old = new Date("2026-11-21T13:30:00Z");
    expect(getMovedFromDate({ status: "verplaatst", originalStartsAt: old }, "en-GB")).toBe(
      "Saturday 21 November 2026",
    );
    expect(getMovedFromDate({ status: "verplaatst" }, "en-GB")).toBeUndefined();
    expect(
      getMovedFromDate({ status: "gaat door", originalStartsAt: old }, "en-GB"),
    ).toBeUndefined();
  });
});

describe("the event page", () => {
  it("shows a place once and knows an event is only online", () => {
    expect(getPlaceLines({ placeName: "Westersingel 14", address: "Westersingel 14" })).toEqual([
      "Westersingel 14",
    ]);
    expect(isOnlineOnly({ onlineLink: "https://example.org" })).toBe(true);
    expect(isOnlineOnly({ onlineLink: "https://example.org", placeName: "Hall" })).toBe(false);
  });
});

describe("the calendar file", () => {
  it("escapes text and folds long lines at 75 bytes", () => {
    expect(escapeCalendarText("a, b; c\nd")).toBe("a\\, b\\; c\\nd");
    const folded = foldCalendarLine(`DESCRIPTION:${"é".repeat(60)}`);
    for (const line of folded.split("\r\n")) {
      expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
    }
  });
  it("writes the event in UTC with its place", () => {
    const file = buildCalendarFile({
      event: {
        ...event("g", "2026-11-21T13:30:00Z", "2026-11-21T17:00:00Z"),
        title: "General meeting",
        placeName: "Westersingel 14",
      },
      url: "https://example.org/events/g/",
      now: new Date("2026-11-15T12:00:00Z"),
    });
    expect(file).toContain("DTSTART:20261121T133000Z\r\n");
    expect(file).toContain("DTEND:20261121T170000Z\r\n");
    expect(file).toContain("LOCATION:Westersingel 14\r\n");
    expect(file.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });
});
