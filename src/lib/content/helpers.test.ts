// Dependencies
import { describe, expect, it } from "vitest";
import {
  compareWeekly,
  getEventDay,
  getEventWhen,
  isStripActive,
  mergeWithDutch,
  planWhatsOn,
} from "./helpers";

const entry = (id: string, group: string, locale: string) => ({
  id,
  data: { translationGroup: group, locale },
});

describe("mergeWithDutch", () => {
  it("keeps the page's entries and adds only the Dutch ones without a translation", () => {
    const local = [entry("en-a", "a", "en")];
    const dutch = [entry("nl-a", "a", "nl"), entry("nl-b", "b", "nl")];
    expect(
      mergeWithDutch(local, dutch).map(({ entry: e, isDutchOnly }) => [e.id, isDutchOnly]),
    ).toEqual([
      ["en-a", false],
      ["nl-b", true],
    ]);
  });

  it("returns only the page's entries when Dutch adds nothing", () => {
    expect(mergeWithDutch([entry("nl-a", "a", "nl")], [])).toHaveLength(1);
  });
});

describe("isStripActive", () => {
  const now = new Date("2026-11-13T12:00:00Z");

  it("needs the urgent mark and a sentence", () => {
    expect(isStripActive(false, "Text", undefined, now)).toBe(false);
    expect(isStripActive(true, "", undefined, now)).toBe(false);
    expect(isStripActive(true, "Text", undefined, now)).toBe(true);
  });

  it("stops at its end", () => {
    expect(isStripActive(true, "Text", "2026-11-21T18:00:00+01:00", now)).toBe(true);
    expect(isStripActive(true, "Text", "2026-11-01T18:00:00+01:00", now)).toBe(false);
  });
});

describe("compareWeekly", () => {
  it("orders by weekday from Monday, then by start time", () => {
    const items = [
      { weekday: "wednesday", startTime: "15:30" },
      { weekday: "tuesday", startTime: "18:00" },
      { weekday: "tuesday", startTime: "10:00" },
    ] as const;
    expect(
      [...items].sort(compareWeekly).map((item) => `${item.weekday} ${item.startTime}`),
    ).toEqual(["tuesday 10:00", "tuesday 18:00", "wednesday 15:30"]);
  });
});

describe("planWhatsOn", () => {
  const event = {
    id: "e",
    href: "#",
    title: "E",
    startsAt: new Date(),
    isOnline: false,
    isDutchOnly: false,
  };
  const weekly = {
    id: "w",
    name: "W",
    weekday: "tuesday",
    startTime: "10:00",
    endTime: "13:00",
    tileColour: "forest",
    isDutchOnly: false,
  } as const;
  const activities = [weekly, weekly, weekly];

  it("fills the band with events from four on", () => {
    expect(planWhatsOn([event, event, event, event], activities)).toMatchObject({
      state: "rail",
      weekly: [],
    });
  });

  it("fills the places that few events leave with weekly activities", () => {
    expect(planWhatsOn([event, event, event], activities)).toMatchObject({ state: "cards" });
    expect(planWhatsOn([event, event, event], activities).weekly).toHaveLength(1);
    expect(planWhatsOn([event, event], activities).weekly).toHaveLength(2);
    expect(planWhatsOn([event], activities).state).toBe("featured");
    expect(planWhatsOn([], activities).state).toBe("none");
  });

  it("uses only the desktop columns it fills", () => {
    expect(planWhatsOn([], [])).toMatchObject({ state: "none", columns: 1, wideSpan: 1 });
    expect(planWhatsOn([event], [weekly])).toMatchObject({ columns: 3, wideSpan: 2 });
    expect(planWhatsOn([event, event], [])).toMatchObject({ state: "cards", columns: 2 });
  });
});

describe("event dates", () => {
  const start = new Date("2026-11-21T13:30:00Z");
  const end = new Date("2026-11-21T17:00:00Z");

  it("shows the day and short month in Dutch time", () => {
    expect(getEventDay(start, "en-GB")).toEqual({ day: "21", month: "Nov" });
  });

  it("writes the weekday, date and times in the page's language", () => {
    expect(getEventWhen(start, end, "en-GB", "to")).toBe("Saturday 21 November · 14:30 to 18:00");
    expect(getEventWhen(start, end, "nl-NL", "tot")).toBe("Zaterdag 21 november · 14:30 tot 18:00");
  });
});
