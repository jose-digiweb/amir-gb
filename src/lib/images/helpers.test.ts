// Dependencies
import { describe, expect, it } from "vitest";
import { RESIZED_IMAGE } from "./constants";
import { keepResizedImage } from "./helpers";

const IMAGE_URL = new URL("https://www.amir-gb.nl/_image?href=%2Fphoto.jpg&w=400");
const YEAR = "public, max-age=31536000, immutable";

describe("keepResizedImage", () => {
  it("gives a resized image the edge header", () => {
    const response = new Response("image", { headers: { "Cache-Control": YEAR } });
    const kept = keepResizedImage(IMAGE_URL, response);
    expect(kept.headers.get(RESIZED_IMAGE.EDGE_CACHE_CONTROL)).toBe(YEAR);
  });

  it("never keeps a failed resize", () => {
    const response = new Response("failed", { status: 502, headers: { "Cache-Control": YEAR } });
    const kept = keepResizedImage(IMAGE_URL, response);
    expect(kept.headers.has(RESIZED_IMAGE.EDGE_CACHE_CONTROL)).toBe(false);
  });

  it("leaves every other page alone", () => {
    const response = new Response("page", { headers: { "Cache-Control": YEAR } });
    const kept = keepResizedImage(new URL("https://www.amir-gb.nl/news/"), response);
    expect(kept).toBe(response);
  });
});
