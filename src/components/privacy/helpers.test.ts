// Dependencies
import { describe, expect, it } from "vitest";
import { LOCALE } from "../../i18n/constants";
import { PRIVACY_PROMISE } from "./constants";
import { formatUpdatedDate, getContentsLinks, getPromiseViews, toIsoDay } from "./helpers";

describe("getPromiseViews", () => {
  it("gives the three promises in order, in the page's language", () => {
    const views = getPromiseViews(LOCALE.EN);
    expect(views.map((view) => view.promise)).toEqual([
      PRIVACY_PROMISE.HELP,
      PRIVACY_PROMISE.NEVER_SOLD,
      PRIVACY_PROMISE.NO_TRACKING,
    ]);
    expect(views[0]?.title).toBe("Only to help you");
    expect(getPromiseViews(LOCALE.NL)[2]?.title).toBe("Geen tracking");
  });
});

describe("getContentsLinks", () => {
  it("keeps only the section headings, with their anchors", () => {
    const links = getContentsLinks([
      { depth: 2, slug: "who-we-are", text: "Who we are" },
      { depth: 3, slug: "a-detail", text: "A detail" },
      { depth: 2, slug: "cookies", text: "Cookies" },
    ]);
    expect(links).toEqual([
      { slug: "who-we-are", text: "Who we are" },
      { slug: "cookies", text: "Cookies" },
    ]);
  });
});

describe("formatUpdatedDate", () => {
  it("writes the Markdown date out in each language, on the same day", () => {
    const date = new Date("2027-01-15");
    expect(formatUpdatedDate(date, LOCALE.NL)).toBe("15 januari 2027");
    expect(formatUpdatedDate(date, LOCALE.EN)).toBe("15 January 2027");
    expect(formatUpdatedDate(date, LOCALE.PT)).toBe("15 de janeiro de 2027");
  });
});

describe("toIsoDay", () => {
  it("gives the date as year, month and day", () => {
    expect(toIsoDay(new Date("2027-01-15"))).toBe("2027-01-15");
  });
});
