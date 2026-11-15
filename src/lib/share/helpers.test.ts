// Dependencies
import { describe, expect, it } from "vitest";
import { getWhatsAppShareHref } from "./helpers";

const PAGE = "https://amir.example/en/";

describe("getWhatsAppShareHref", () => {
  it("opens WhatsApp with the message and the address", () => {
    const href = new URL(getWhatsAppShareHref("Give too:", PAGE));
    expect(href.origin).toBe("https://wa.me");
    expect(href.searchParams.get("text")).toBe(`Give too: ${PAGE}`);
  });
});
