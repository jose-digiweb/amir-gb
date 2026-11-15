// Dependencies
import { describe, expect, it } from "vitest";
import { getGiftPageRoute } from "./pages";

describe("getGiftPageRoute", () => {
  it("returns a gift from the Donate page there, in every language", () => {
    expect(getGiftPageRoute("/donate/")).toBe("/donate/");
    expect(getGiftPageRoute("/donate")).toBe("/donate/");
    expect(getGiftPageRoute("/en/donate/")).toBe("/donate/");
    expect(getGiftPageRoute("/pt/donate")).toBe("/donate/");
  });

  it("returns any other gift to the home page", () => {
    expect(getGiftPageRoute("/")).toBe("/");
    expect(getGiftPageRoute("/en/")).toBe("/");
    expect(getGiftPageRoute("/news/")).toBe("/");
    expect(getGiftPageRoute("/donate/extra/")).toBe("/");
  });
});
