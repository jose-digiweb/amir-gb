// Checks the sign-up form's rules and the email AMIR-GB receives.
import { describe, expect, it } from "vitest";
import { JOIN_ERROR } from "./constants";
import {
  checkJoinEmail,
  checkJoinValues,
  getFirstName,
  getJoinMailLines,
  orderSkills,
} from "./helpers";

// Types
import type { JoinValues } from "./types";

const member: JoinValues = {
  mode: "member",
  name: "Fatumata Baldé",
  email: "fatumata.balde@example.nl",
  phone: "",
  place: "Tilburg",
  language: "pt",
  skills: [],
  message: "",
  consent: true,
};

describe("checkJoinEmail", () => {
  it("accepts a complete address", () => {
    expect(checkJoinEmail("f.balde@example.nl")).toBeUndefined();
  });

  it("names what is wrong", () => {
    expect(checkJoinEmail("")).toBe(JOIN_ERROR.EMAIL_MISSING);
    expect(checkJoinEmail("fatumata.balde@gmail")).toBe(JOIN_ERROR.EMAIL_INCOMPLETE);
    expect(checkJoinEmail("fatumata")).toBe(JOIN_ERROR.EMAIL_INVALID);
  });
});

describe("checkJoinValues", () => {
  it("finds nothing in a complete member sign-up", () => {
    expect(checkJoinValues(member)).toEqual({});
  });

  it("asks a volunteer what they can help with, and never a member", () => {
    expect(checkJoinValues({ ...member, mode: "volunteer" })).toEqual({
      skills: JOIN_ERROR.SKILLS_MISSING,
    });
    expect(checkJoinValues({ ...member, mode: "volunteer", skills: ["law"] })).toEqual({});
  });

  it("finds the five things to check in an empty volunteer sign-up", () => {
    const errors = checkJoinValues({
      ...member,
      mode: "volunteer",
      name: "",
      email: "",
      place: "",
      consent: false,
    });
    expect(Object.keys(errors)).toEqual(["name", "email", "place", "skills", "consent"]);
  });
});

describe("getJoinMailLines", () => {
  it("writes a member's sign-up in Dutch with the next step", () => {
    const lines = getJoinMailLines(member);
    expect(lines[0]).toBe("Aanmelden als: Lid");
    expect(lines).toContain("Telefoon of WhatsApp: Niet ingevuld");
    expect(lines).toContain("Praten in: Português");
    expect(lines.some((line) => line.startsWith("Kan helpen met"))).toBe(false);
  });

  it("lists a volunteer's skills and keeps their message", () => {
    const lines = getJoinMailLines({
      ...member,
      mode: "volunteer",
      skills: ["translation", "events"],
      message: "Weekends",
    });
    expect(lines).toContain("Kan helpen met: Vertalen, Evenementen");
    expect(lines.at(-1)).toBe("Weekends");
  });
});

describe("orderSkills and getFirstName", () => {
  it("keeps the form's order and greets the first name", () => {
    expect(orderSkills(["events", "translation"])).toEqual(["translation", "events"]);
    expect(getFirstName("Fatumata Baldé")).toBe("Fatumata");
  });
});
