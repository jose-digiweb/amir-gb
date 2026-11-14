// Renders the appearance controls through Astro's Container API and checks their radios.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import ThemeList from "./ThemeList.astro";
import ThemeToggle from "./ThemeToggle.astro";

describe("ThemeList", () => {
  it("renders the button, the card and three radios with Automatic checked", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ThemeList);
    expect(html).toContain('popovertarget="theme-list"');
    expect(html).toContain('id="theme-list" popover="auto"');
    expect(html.match(/name="theme-list"/g)).toHaveLength(3);
    expect(html).toMatch(/value="auto" checked/);
    expect(html.match(/data-theme-input/g)).toHaveLength(3);
    // Without a language from routing the component falls back to Dutch, the default
    expect(html).toContain("Weergave: Automatisch");
  });
});

describe("ThemeToggle", () => {
  it("renders three radios of its own group with Automatic checked", async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ThemeToggle);
    expect(html.match(/name="theme-toggle"/g)).toHaveLength(3);
    expect(html).toMatch(/value="auto" checked/);
    expect(html.match(/data-theme-input/g)).toHaveLength(3);
  });
});
