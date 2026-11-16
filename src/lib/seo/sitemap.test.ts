// Dependencies
import { describe, expect, it } from "vitest";
import {
  escapeXml,
  getEntrySitemapUrls,
  getPageSitemapUrls,
  renderRobots,
  renderSitemapIndex,
  renderUrlset,
} from "./sitemap";

const site = new URL("https://www.amir-gb.nl");

describe("escapeXml", () => {
  it("writes XML's special characters as entities, ampersands once", () => {
    expect(escapeXml(`a & <b> "c" 'd'`)).toBe("a &amp; &lt;b&gt; &quot;c&quot; &apos;d&apos;");
  });
});

describe("getPageSitemapUrls", () => {
  it("lists a page in every language, each with all its versions", () => {
    const urls = getPageSitemapUrls(
      [
        [
          { locale: "nl", path: "/contact/" },
          { locale: "en", path: "/en/contact/" },
        ],
      ],
      site,
      "nl",
    );
    expect(urls.map((url) => url.loc)).toEqual([
      "https://www.amir-gb.nl/contact/",
      "https://www.amir-gb.nl/en/contact/",
    ]);
    expect(urls[1]?.alternates.map((alternate) => alternate.hreflang)).toEqual([
      "nl",
      "en",
      "x-default",
    ]);
  });
});

describe("getEntrySitemapUrls", () => {
  it("joins translations, keeps a Dutch-only post to Dutch and leaves hidden ones out", () => {
    const urls = getEntrySitemapUrls(
      [
        { group: "a", locale: "nl", path: "/news/feest/", lastmod: "2026-11-01", isHidden: false },
        {
          group: "a",
          locale: "en",
          path: "/en/news/party/",
          lastmod: "2026-11-02",
          isHidden: false,
        },
        { group: "b", locale: "nl", path: "/news/alleen/", lastmod: "2026-11-03", isHidden: false },
        {
          group: "c",
          locale: "nl",
          path: "/news/verborgen/",
          lastmod: "2026-11-04",
          isHidden: true,
        },
      ],
      site,
      "nl",
    );
    expect(urls.map((url) => url.loc)).toEqual([
      "https://www.amir-gb.nl/news/feest/",
      "https://www.amir-gb.nl/en/news/party/",
      "https://www.amir-gb.nl/news/alleen/",
    ]);
    expect(urls[1]?.alternates).toEqual([
      { hreflang: "nl", href: "https://www.amir-gb.nl/news/feest/" },
      { hreflang: "en", href: "https://www.amir-gb.nl/en/news/party/" },
      { hreflang: "x-default", href: "https://www.amir-gb.nl/news/feest/" },
    ]);
    expect(urls[2]?.alternates.map((alternate) => alternate.hreflang)).toEqual(["nl", "x-default"]);
  });
});

describe("the files", () => {
  it("renders a urlset, an index and robots.txt", () => {
    const xml = renderUrlset([
      {
        loc: "https://www.amir-gb.nl/",
        lastmod: "2026-11-01",
        alternates: [{ hreflang: "nl", href: "https://www.amir-gb.nl/" }],
      },
    ]);
    expect(xml).toContain("<loc>https://www.amir-gb.nl/</loc>");
    expect(xml).toContain(
      '<xhtml:link rel="alternate" hreflang="nl" href="https://www.amir-gb.nl/" />',
    );
    expect(renderSitemapIndex(["https://www.amir-gb.nl/sitemap-pages.xml"])).toContain(
      "<sitemap><loc>https://www.amir-gb.nl/sitemap-pages.xml</loc></sitemap>",
    );
    expect(renderRobots("https://www.amir-gb.nl/sitemap.xml", "/_emdash/")).toBe(
      "User-agent: *\nAllow: /\nDisallow: /_emdash/\n\nSitemap: https://www.amir-gb.nl/sitemap.xml\n",
    );
  });
});
