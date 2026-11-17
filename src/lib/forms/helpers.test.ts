// Dependencies
import { describe, expect, it } from "vitest";
import { listFieldLinks } from "./helpers";

describe("listFieldLinks", () => {
  it("links each field's name, joins them in the page's language and ends with a full stop", () => {
    expect(
      listFieldLinks("en", [
        { id: "name", name: "your name" },
        { id: "email", name: "your email" },
      ]),
    ).toEqual([
      { text: "Your name", href: "#name" },
      { text: " and " },
      { text: "your email", href: "#email" },
      { text: "." },
    ]);
  });

  it("writes Dutch with its own word for and", () => {
    const parts = listFieldLinks("nl", [
      { id: "a", name: "je naam" },
      { id: "b", name: "je bericht" },
    ]);
    expect(parts.map((part) => part.text).join("")).toBe("Je naam en je bericht.");
  });
});
