// Checks the message form's rules and the opening hours status.
import { describe, expect, it } from "vitest";
import { CONTACT_ERROR } from "./constants";
import { checkContactValues, checkReach, getOpeningStatus } from "./helpers";
import { getQrDrawing } from "./qr";

describe("checkReach", () => {
  it("accepts an email address and a Dutch phone number", () => {
    expect(checkReach("f.balde@example.nl")).toBeUndefined();
    expect(checkReach("06 12 34 56 78")).toBeUndefined();
    expect(checkReach("+31 6 15 18 87 45")).toBeUndefined();
  });

  it("names what is wrong", () => {
    expect(checkReach("")).toBe(CONTACT_ERROR.REACH_MISSING);
    expect(checkReach("f.balde@")).toBe(CONTACT_ERROR.EMAIL_INCOMPLETE);
    expect(checkReach("0612")).toBe(CONTACT_ERROR.REACH_INVALID);
    expect(checkReach("call me")).toBe(CONTACT_ERROR.REACH_INVALID);
  });
});

describe("checkContactValues", () => {
  it("finds the four things to check in an empty message", () => {
    const errors = checkContactValues({
      name: "",
      reach: "",
      language: "nl",
      message: "",
      consent: false,
    });
    expect(Object.keys(errors)).toEqual(["name", "reach", "message", "consent"]);
  });

  it("finds nothing in a complete message", () => {
    const errors = checkContactValues({
      name: "Fatumata",
      reach: "06 12 34 56 78",
      language: "pt",
      message: "Olá",
      consent: true,
    });
    expect(errors).toEqual({});
  });
});

describe("getOpeningStatus", () => {
  it("is open on a weekday afternoon and closes at 20:00", () => {
    // Wednesday 12 November 2026, 14:00 in Amsterdam (13:00 UTC)
    const status = getOpeningStatus(new Date(Date.UTC(2026, 10, 11, 13)));
    expect(status).toEqual({ isOpen: true, time: "20:00", weekday: 3, daysAway: 0 });
  });

  it("opens later the same morning before 08:00", () => {
    // Wednesday 12 November 2026, 07:00 in Amsterdam (06:00 UTC)
    const status = getOpeningStatus(new Date(Date.UTC(2026, 10, 11, 6)));
    expect(status).toEqual({ isOpen: false, time: "08:00", weekday: 3, daysAway: 0 });
  });

  it("opens Saturday at 10:00 after Friday evening", () => {
    // Friday 13 November 2026, 21:00 in Amsterdam (20:00 UTC)
    const status = getOpeningStatus(new Date(Date.UTC(2026, 10, 13, 20)));
    expect(status).toEqual({ isOpen: false, time: "10:00", weekday: 6, daysAway: 1 });
  });

  it("follows summer time", () => {
    // Monday 6 July 2026, 19:30 in Amsterdam (17:30 UTC)
    const status = getOpeningStatus(new Date(Date.UTC(2026, 6, 6, 17, 30)));
    expect(status.isOpen).toBe(true);
  });
});

describe("getQrDrawing", () => {
  it("draws a square code with a margin for the WhatsApp link", () => {
    const qr = getQrDrawing("https://wa.me/31615188745");
    expect(qr.size).toBeGreaterThan(21);
    expect(qr.path.startsWith("M")).toBe(true);
  });
});
