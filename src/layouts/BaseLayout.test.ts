// Renders the base layout through Astro's Container API and checks the document shell.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import BaseLayout from "./BaseLayout.astro";

async function render() {
  const container = await AstroContainer.create();
  return container.renderToString(BaseLayout, {
    props: { title: "Test title", description: "Test description" },
    slots: { default: "<p>Page content</p>" },
    partial: false,
  });
}

describe("BaseLayout", () => {
  it("renders the title, description and page content", async () => {
    const html = await render();
    expect(html).toContain("<title>Test title</title>");
    expect(html).toContain('<meta name="description" content="Test description">');
    expect(html).toContain("<p>Page content</p>");
  });

  it("declares the viewport and both colour schemes", async () => {
    const html = await render();
    expect(html).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    );
    expect(html).toContain('<meta name="color-scheme" content="light dark">');
  });

  it("applies a remembered appearance in the head, right after the colour schemes", async () => {
    const html = await render();
    const meta = html.indexOf('<meta name="color-scheme"');
    const script = html.indexOf("amir-gb-theme");
    expect(script).toBeGreaterThan(meta);
    expect(script).toBeLessThan(html.indexOf("</head>"));
  });

  it("loads Montserrat and Inter through Astro's Fonts API", async () => {
    const html = await render();
    expect(html).toContain("--font-montserrat:");
    expect(html).toContain("--font-inter:");
    expect(html).toMatch(/rel="preload" href="\/_astro\/fonts\/font-montserrat-/);
    expect(html).toMatch(/rel="preload" href="\/_astro\/fonts\/font-inter-/);
  });

  it("uses the token background and text colour on the body", async () => {
    const html = await render();
    expect(html).toContain('<body class="bg-bg type-body text-text">');
  });

  // The container does not load the i18n config, so Astro.currentLocale is undefined here.
  // The lang of /en/ and /pt/ is checked in the browser, not in this test.
  it("falls back to Dutch when Astro reports no locale", async () => {
    const html = await render();
    expect(html).toContain('<html lang="nl">');
  });
});
