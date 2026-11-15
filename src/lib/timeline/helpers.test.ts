// Dependencies
import { describe, expect, it } from "vitest";
import { MILESTONE_PRECISION, MILESTONE_STATE } from "./constants";
import { getMilestoneState, getSiteToday } from "./helpers";

describe("getSiteToday", () => {
  it("reads the date in Dutch time, not UTC", () => {
    // 23:30 UTC on 20 November is already 21 November in Amsterdam
    expect(getSiteToday(new Date("2026-11-20T23:30:00Z"))).toBe("2026-11-21");
  });
});

describe("getMilestoneState", () => {
  const meeting = { date: "2026-11-21", precision: MILESTONE_PRECISION.DAY };
  const foundingEnd = { date: "2027-03-01", precision: MILESTONE_PRECISION.MONTH };

  it("keeps a day coming up until it has passed", () => {
    expect(getMilestoneState(meeting, "2026-11-20")).toBe(MILESTONE_STATE.COMING);
    expect(getMilestoneState(meeting, "2026-11-21")).toBe(MILESTONE_STATE.COMING);
    expect(getMilestoneState(meeting, "2026-11-22")).toBe(MILESTONE_STATE.DONE);
  });

  it("keeps a month coming up until it has ended", () => {
    expect(getMilestoneState(foundingEnd, "2027-03-31")).toBe(MILESTONE_STATE.COMING);
    expect(getMilestoneState(foundingEnd, "2027-04-01")).toBe(MILESTONE_STATE.DONE);
  });
});
