// Dependencies
import { describe, expect, it } from "vitest";
import { en } from "../../i18n/translations/en";
import {
  cacheContentPage,
  compareWeekly,
  getEventDay,
  getEventMeta,
  getEventWhen,
  getWeeklyTint,
  isStripActive,
  mergeWithDutch,
  planWhatsOn,
  toClockTime,
  getPhotoAlt,
} from "./helpers";

// Types
import type { AstroGlobal } from "astro";

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
      { weekday: "woensdag", startTime: "15:30" },
      { weekday: "dinsdag", startTime: "18:00" },
      { weekday: "dinsdag", startTime: "10:00" },
    ] as const;
    expect(
      [...items].sort(compareWeekly).map((item) => `${item.weekday} ${item.startTime}`),
    ).toEqual(["dinsdag 10:00", "dinsdag 18:00", "woensdag 15:30"]);
  });
});

describe("toClockTime", () => {
  it("reads the ways an editor writes a time as HH:MM", () => {
    expect(toClockTime("10:00")).toBe("10:00");
    expect(toClockTime("9:30")).toBe("09:30");
    expect(toClockTime("10.00")).toBe("10:00");
    expect(toClockTime(" 7.15 ")).toBe("07:15");
  });

  it("leaves anything else as written", () => {
    expect(toClockTime("noon")).toBe("noon");
  });
});

describe("getWeeklyTint", () => {
  it("gives the tiles the four help tints in turn", () => {
    expect([0, 1, 2, 3, 4].map((index) => getWeeklyTint(index))).toEqual([
      "forest",
      "gold",
      "brick",
      "navy",
      "forest",
    ]);
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
    weekday: "dinsdag",
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

describe("getEventMeta", () => {
  const startsAt = new Date("2026-11-21T13:30:00Z");
  const endsAt = new Date("2026-11-21T17:00:00Z");

  it("joins when, the place and online", () => {
    expect(
      getEventMeta({ startsAt, endsAt, placeName: "Rotterdam", isOnline: true }, "en-GB", en),
    ).toBe("Saturday 21 November · 14:30 to 18:00 · Rotterdam and online");
  });

  it("leaves out where when it is unknown", () => {
    expect(getEventMeta({ startsAt, isOnline: false }, "en-GB", en)).toBe(
      "Saturday 21 November · 14:30",
    );
  });
});

type CacheOptions = Parameters<AstroGlobal["cache"]["set"]>[0];

describe("cacheContentPage", () => {
  it("keeps the page for a while and adds every query's tags", () => {
    const calls: CacheOptions[] = [];
    cacheContentPage({ enabled: true, set: (options) => calls.push(options) }, [
      { tags: ["events"] },
    ]);
    expect(calls).toEqual([{ maxAge: 3600, swr: 31_536_000 }, { tags: ["events"] }]);
  });

  it("sets nothing without a cache provider", () => {
    const calls: CacheOptions[] = [];
    cacheContentPage({ enabled: false, set: (options) => calls.push(options) }, [
      { tags: ["events"] },
    ]);
    expect(calls).toHaveLength(0);
  });
});

describe("getPhotoAlt", () => {
  const image = { id: "photo", alt: "A volunteer helping at a table" } as const;

  it("gives a lead photo the editor's description", () => {
    expect(getPhotoAlt(image, true)).toBe("A volunteer helping at a table");
  });

  it("leaves a photo in a list to the link's words", () => {
    expect(getPhotoAlt(image, false)).toBe("");
  });

  it("leaves a lead photo with no description empty", () => {
    expect(getPhotoAlt(undefined, true)).toBe("");
  });
});
