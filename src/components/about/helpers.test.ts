// Dependencies
import { describe, expect, it } from "vitest";
import { LOCALE } from "../../i18n/constants";
import { MILESTONE_STATE } from "../../lib/timeline/constants";
import { getAimNumber, getInitials, getMilestoneViews, getTaxStatusText } from "./helpers";

describe("getAimNumber", () => {
  it("numbers the aims with a leading zero", () => {
    expect(getAimNumber(0)).toBe("01");
    expect(getAimNumber(6)).toBe("07");
  });
});

describe("getInitials", () => {
  it("takes the first letters of the first and last names", () => {
    expect(getInitials("Cesaltina Pereira dos Reis")).toBe("CR");
    expect(getInitials("Júlio Gomes dos Santos")).toBe("JS");
    expect(getInitials("Umaru Seidi")).toBe("US");
  });

  it("gives one letter for a single name", () => {
    expect(getInitials("Umaru")).toBe("U");
  });
});

describe("getMilestoneViews", () => {
  it("marks the general meeting coming up before 21 November and done after it", () => {
    const before = getMilestoneViews(LOCALE.EN, new Date("2026-11-15T12:00:00Z"));
    const after = getMilestoneViews(LOCALE.EN, new Date("2026-11-22T12:00:00Z"));
    expect(before.map((item) => item.state)).toEqual([
      MILESTONE_STATE.DONE,
      MILESTONE_STATE.DONE,
      MILESTONE_STATE.DONE,
      MILESTONE_STATE.COMING,
      MILESTONE_STATE.COMING,
    ]);
    expect(after[3]?.state).toBe(MILESTONE_STATE.DONE);
  });

  it("writes days with their month and the founding phase's end as a month", () => {
    const views = getMilestoneViews(LOCALE.EN, new Date("2026-11-15T12:00:00Z"));
    expect(views[0]?.when).toBe("20 Jul");
    expect(views[0]?.year).toBe("2026");
    expect(views[4]?.when).toBe("Mar");
    expect(views[4]?.year).toBe("2027");
  });

  it("stitches every milestone to the next but the last", () => {
    const views = getMilestoneViews(LOCALE.NL, new Date("2026-11-15T12:00:00Z"));
    expect(views.map((item) => item.joinsNext)).toEqual([true, true, true, true, false]);
  });
});

describe("getTaxStatusText", () => {
  it("names the KvK and RSIN numbers and never says AMIR-GB is an ANBI", () => {
    const text = getTaxStatusText(LOCALE.EN);
    expect(text).toContain("42120588");
    expect(text).toContain("869821118");
    expect(text).toContain("SBBI");
    expect(text).toContain("not an ANBI");
  });
});
