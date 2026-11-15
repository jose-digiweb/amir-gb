// Dependencies
import { describe, expect, it } from "vitest";
import { LOCALE } from "../../i18n/constants";
import { getAimNumber, getInitials, getTaxStatusText } from "./helpers";

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

describe("getTaxStatusText", () => {
  it("names the KvK and RSIN numbers and never says AMIR-GB is an ANBI", () => {
    const text = getTaxStatusText(LOCALE.EN);
    expect(text).toContain("42120588");
    expect(text).toContain("869821118");
    expect(text).toContain("SBBI");
    expect(text).toContain("not an ANBI");
  });
});
