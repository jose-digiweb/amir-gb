// Renders Support AMIR-GB and checks how its joined-hands photos load.
import { getContainerRenderer } from "@astrojs/vue";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { describe, expect, it } from "vitest";
import { GIFT_STATE } from "../../../lib/donate/constants";
import SupportSection from "./SupportSection.astro";

const PHOTO_PATTERN = /<img [^>]*src="[^"]*joined-hands[^"]*"[^>]*>/g;
const COPIES = 2;

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

/**
 * The {@link renderPhotos} helper
 * @description Renders the section with the form, whose widget is a Vue island, and returns its joined-hands img tags
 * @returns {Promise<string[]>} The img tags as HTML
 */
async function renderPhotos(): Promise<string[]> {
  // Render the section with Vue for its widget and pick out the photo's img tags
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const html = await container.renderToString(SupportSection, {
    props: { support: { state: GIFT_STATE.FORM } },
  });
  const photos = html.match(PHOTO_PATTERN) ?? [];

  // Every test reads both copies, so a missing one fails here
  expect(photos).toHaveLength(COPIES);
  return photos;
}

describe("SupportSection", () => {
  // The tablet and desktop drawings each hold the photo; one srcset and sizes means one download
  it("gives both copies the same srcset and sizes, so the page fetches one photo", async () => {
    const photos = await renderPhotos();
    expect(new Set(photos.map((tag) => readAttribute(tag, "srcset"))).size).toBe(1);
    expect(new Set(photos.map((tag) => readAttribute(tag, "sizes"))).size).toBe(1);
  });

  it("loads the photo lazily, as the section sits at the foot of the page", async () => {
    for (const tag of await renderPhotos()) {
      expect(readAttribute(tag, "loading")).toBe("lazy");
    }
  });
});
