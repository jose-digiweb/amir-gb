// Renders the openings that hold the joined hands and checks that each page fetches the photo once, first.
import { getContainerRenderer } from "@astrojs/vue";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { describe, expect, it } from "vitest";
import { GIFT_STATE } from "../../lib/donate/constants";
import DonateOpening from "../donate/DonateOpening.astro";
import JoinOpening from "../join/JoinOpening.astro";

const PHOTO_PATTERN = /<img [^>]*src="[^"]*joined-hands[^"]*"[^>]*>/g;
const COPIES = 3;

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
 * The {@link renderJoin} helper
 * @description Renders the Join in opening and returns its joined-hands img tags
 * @returns {Promise<string[]>} The img tags as HTML
 */
async function renderJoin(): Promise<string[]> {
  // Render the opening and pick out the photo's img tags
  const container = await AstroContainer.create();
  const html = await container.renderToString(JoinOpening);
  return html.match(PHOTO_PATTERN) ?? [];
}

/**
 * The {@link renderDonate} helper
 * @description Renders the Donate opening with the form, whose widget is a Vue island, and returns its joined-hands img tags
 * @returns {Promise<string[]>} The img tags as HTML
 */
async function renderDonate(): Promise<string[]> {
  // Render the opening with Vue for its widget and pick out the photo's img tags
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const html = await container.renderToString(DonateOpening, {
    props: { support: { state: GIFT_STATE.FORM } },
  });
  return html.match(PHOTO_PATTERN) ?? [];
}

describe.each([
  ["JoinOpening", renderJoin],
  ["DonateOpening", renderDonate],
])("%s", (_name, render) => {
  // Eager copies with different srcsets would each download, hidden or not
  it("draws the joined hands once per screen size, with one srcset and sizes", async () => {
    const photos = await render();
    expect(photos).toHaveLength(COPIES);
    expect(new Set(photos.map((tag) => readAttribute(tag, "srcset"))).size).toBe(1);
    expect(new Set(photos.map((tag) => readAttribute(tag, "sizes"))).size).toBe(1);
  });

  it("loads the photo eagerly and first", async () => {
    for (const tag of await render()) {
      expect(readAttribute(tag, "loading")).toBe("eager");
      expect(readAttribute(tag, "fetchpriority")).toBe("high");
    }
  });
});
