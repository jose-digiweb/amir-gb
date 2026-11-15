// Dependencies
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";

// Components
import RichText from "./RichText.astro";

// Types
import type { PortableTextBlock } from "emdash";

/**
 * The {@link block} helper
 * @description Builds one Portable Text block the way EmDash's editor stores it
 * @param {string} style - The block's style, such as normal or h1
 * @param {string} text - The block's text
 * @returns {PortableTextBlock} The block
 */
function block(style: string, text: string): PortableTextBlock {
  return {
    _type: "block",
    _key: `${style}-${text}`,
    style,
    markDefs: [],
    children: [{ _type: "span", _key: text, text, marks: [] }],
  };
}

/**
 * The {@link renderText} helper
 * @description Renders rich text and returns its HTML
 * @param {PortableTextBlock[]} value - The text to render
 * @returns {Promise<string>} The rendered HTML
 */
async function renderText(value: PortableTextBlock[]): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(RichText, { props: { value } });
}

describe("RichText", () => {
  it("moves the editor's headings one level under the page title", async () => {
    const html = await renderText([
      block("h1", "Eerste"),
      block("h2", "Tweede"),
      block("h3", "Derde"),
    ]);
    expect(html).toMatch(/<h2[^>]*class="[^"]*type-h2[^"]*"[^>]*>Eerste<\/h2>/);
    expect(html).toMatch(/<h3[^>]*class="[^"]*type-h3[^"]*"[^>]*>Tweede<\/h3>/);
    expect(html).toMatch(/<h4[^>]*class="[^"]*type-h4[^"]*"[^>]*>Derde<\/h4>/);
    expect(html).not.toContain("<h1");
  });

  it("renders paragraphs inside the rich text wrapper", async () => {
    const html = await renderText([block("normal", "Welkom bij AMIR-GB.")]);
    expect(html).toContain("rich-text");
    expect(html).toMatch(/<p[^>]*>Welkom bij AMIR-GB\.<\/p>/);
  });

  it("renders nothing but the wrapper when there is no text", async () => {
    const html = await renderText([]);
    expect(html).not.toContain("<p");
  });
});
