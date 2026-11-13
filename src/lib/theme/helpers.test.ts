// Dependencies
import { describe, expect, it } from "vitest";
import { THEME } from "./constants";
import { isThemeOverride, parseThemeChoice } from "./helpers";

describe("parseThemeChoice", () => {
  it("reads each known choice", () => {
    expect(parseThemeChoice("auto")).toBe(THEME.AUTO);
    expect(parseThemeChoice("light")).toBe(THEME.LIGHT);
    expect(parseThemeChoice("dark")).toBe(THEME.DARK);
  });

  it("falls back to Automatic when nothing or something unknown is stored", () => {
    expect(parseThemeChoice(null)).toBe(THEME.AUTO);
    expect(parseThemeChoice("")).toBe(THEME.AUTO);
    expect(parseThemeChoice("sepia")).toBe(THEME.AUTO);
  });
});

describe("isThemeOverride", () => {
  it("is true only for Light and Dark", () => {
    expect(isThemeOverride(THEME.LIGHT)).toBe(true);
    expect(isThemeOverride(THEME.DARK)).toBe(true);
    expect(isThemeOverride(THEME.AUTO)).toBe(false);
  });
});
