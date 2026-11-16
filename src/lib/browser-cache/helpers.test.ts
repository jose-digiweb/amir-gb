// Dependencies
import { describe, expect, it } from "vitest";
import { BROWSER_CACHE } from "./constants";
import { letBrowserKeepPage } from "./helpers";

const KEPT = { enabled: true, options: { maxAge: 3600, tags: [] } };

describe("letBrowserKeepPage", () => {
  it("lets the browser keep a page the edge keeps", () => {
    const kept = letBrowserKeepPage(KEPT, new Response("page"));
    expect(kept.headers.get(BROWSER_CACHE.HEADER)).toBe(BROWSER_CACHE.VALUE);
  });

  it("leaves a page the edge does not keep alone", () => {
    const response = new Response("page");
    expect(letBrowserKeepPage({ enabled: true, options: { tags: [] } }, response)).toBe(response);
    expect(
      letBrowserKeepPage({ enabled: false, options: { maxAge: 3600, tags: [] } }, response),
    ).toBe(response);
  });

  it("keeps a page's own rule, such as a private donation page", () => {
    const response = new Response("page", { headers: { "Cache-Control": "private, no-store" } });
    expect(letBrowserKeepPage(KEPT, response).headers.get(BROWSER_CACHE.HEADER)).toBe(
      "private, no-store",
    );
  });

  it("never lets the browser keep a failed page", () => {
    const response = new Response("failed", { status: 500 });
    expect(letBrowserKeepPage(KEPT, response)).toBe(response);
  });
});
