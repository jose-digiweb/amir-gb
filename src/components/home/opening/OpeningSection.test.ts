// Renders the opening through Astro's Container API and checks how its three photos load.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import OpeningSection from "./OpeningSection.astro";

const PHOTO_PATTERN = /<img [^>]*src="[^"]*joined-hands[^"]*"[^>]*>/g;
const COPIES = 3;

/**
 * The {@link renderPhotos} helper
 * @description Renders the opening and returns its joined-hands img tags, one per screen size
 * @returns {Promise<string[]>} The img tags as HTML
 */
async function renderPhotos(): Promise<string[]> {
  // Render the section and pick out the photo's img tags
  const container = await AstroContainer.create();
  const html = await container.renderToString(OpeningSection);
  const photos = html.match(PHOTO_PATTERN) ?? [];

  // Every test reads all three copies, so a missing one fails here
  expect(photos).toHaveLength(COPIES);
  return photos;
}

/**
 * The {@link readAttribute} helper
 * @description Reads one attribute's value from an img tag
 * @param {string} tag - The img tag as HTML
 * @param {string} name - The attribute to read
 * @returns {string | undefined} The value, or undefined when the tag has none
 */
function readAttribute(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(` ${name}="([^"]*)"`))?.[1];
}

describe("OpeningSection", () => {
  it("draws the joined hands once per screen size", async () => {
    await renderPhotos();
  });

  // Eager copies with different srcsets would each download, hidden or not
  it("gives every copy the same srcset and sizes, so the page fetches one photo", async () => {
    const photos = await renderPhotos();
    const srcsets = new Set(photos.map((tag) => readAttribute(tag, "srcset")));
    const sizes = new Set(photos.map((tag) => readAttribute(tag, "sizes")));
    expect(srcsets.size).toBe(1);
    expect(sizes.size).toBe(1);
  });

  it("loads the photo eagerly and first", async () => {
    const photos = await renderPhotos();
    for (const tag of photos) {
      expect(readAttribute(tag, "loading")).toBe("eager");
      expect(readAttribute(tag, "fetchpriority")).toBe("high");
    }
  });
});
