// Renders the phone's dock through Astro's Container API and checks what it offers.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import { nl } from "../../../i18n/translations/nl";
import { CONTACT } from "../../../site/constants";
import HomeDock from "./HomeDock.astro";

/**
 * The {@link render} helper
 * @description Renders a component in the site's default language, Dutch, and returns its HTML
 * @param {Parameters<AstroContainer["renderToString"]>[0]} component - The component to render
 * @returns {Promise<string>} The HTML
 */
async function render(component: Parameters<AstroContainer["renderToString"]>[0]): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(component);
}

describe("HomeDock", () => {
  it("is a labelled region with WhatsApp and Call", async () => {
    const html = await render(HomeDock);
    expect(html).toContain('role="region"');
    expect(html).toContain(`aria-label="${nl["dock.label"]}"`);
    expect(html).toContain(`href="${CONTACT.WHATSAPP_HREF}"`);
    expect(html).toContain(`href="${CONTACT.PHONE_HREF}"`);
    expect(html).toContain(`aria-label="${nl["contact.call"]}"`);
  });

  it("only shows on phone", async () => {
    const html = await render(HomeDock);
    expect(html).toMatch(/data-home-dock[^>]*tablet:hidden/);
  });
});
