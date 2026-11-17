// Renders How can we help? through Astro's Container API and checks the phone's launcher.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import { nl } from "../../../i18n/translations/nl";
import { CONTACT } from "../../../site/constants";
import HelpSection from "./HelpSection.astro";

const LAUNCHER_CELL = "flex w-full touch-manipulation flex-col items-center";

/**
 * The {@link renderHelp} helper
 * @description Renders the section in the site's default language, Dutch, and returns its HTML
 * @returns {Promise<string>} The HTML
 */
async function renderHelp(): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(HelpSection);
}

describe("HelpSection on phone", () => {
  it("launches all six help topics", async () => {
    const html = await renderHelp();
    expect(html.split(LAUNCHER_CELL)).toHaveLength(7);
  });

  it("ends on a row that opens WhatsApp", async () => {
    const html = await renderHelp();
    expect(html).toContain(nl["help.notSureTitle"]);
    expect(html).toContain(`href="${CONTACT.WHATSAPP_HREF}"`);
  });
});
