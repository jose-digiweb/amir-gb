// Dependencies
import { describe, expect, it } from "vitest";
import { getRichTextHeadingLevel } from "./helpers";

describe("getRichTextHeadingLevel", () => {
  it("moves every editor heading one level under the page title", () => {
    expect(["h1", "h2", "h3", "h4", "h5"].map((style) => getRichTextHeadingLevel(style))).toEqual([
      2, 3, 4, 5, 6,
    ]);
  });

  it("never goes past h6", () => {
    expect(getRichTextHeadingLevel("h6")).toBe(6);
  });

  it("reads anything else as the first heading", () => {
    expect(getRichTextHeadingLevel(undefined)).toBe(2);
    expect(getRichTextHeadingLevel("normal")).toBe(2);
  });
});
