// Dependencies
import { describe, expect, it } from "vitest";
import { getLocale, getPagePath, getTranslations, isLocale } from "./helpers";

describe("isLocale", () => {
  it.each([
    ["nl", true],
    ["en", true],
    ["pt", true],
    ["fr", false],
    [undefined, false],
  ])("treats %s as a site language: %s", (value, expected) => {
    expect(isLocale(value)).toBe(expected);
  });
});

describe("getLocale", () => {
  it("keeps a language the site has", () => {
    expect(getLocale("pt")).toBe("pt");
  });

  it("falls back to Dutch when Astro reports none", () => {
    expect(getLocale(undefined)).toBe("nl");
  });
});

describe("getPagePath", () => {
  it.each([
    ["/", "/"],
    ["/events/", "/events/"],
    ["/en/", "/"],
    ["/pt/events/", "/events"],
    ["/nl/events/", "/nl/events/"],
  ])("turns %s into %s", (pathname, expected) => {
    expect(getPagePath(pathname)).toBe(expected);
  });
});

describe("getTranslations", () => {
  it("has the same keys in every language", () => {
    const keys = Object.keys(getTranslations("en")).sort();
    expect(Object.keys(getTranslations("nl")).sort()).toEqual(keys);
    expect(Object.keys(getTranslations("pt")).sort()).toEqual(keys);
  });
});
