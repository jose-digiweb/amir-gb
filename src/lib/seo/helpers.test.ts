// Dependencies
import { describe, expect, it } from "vitest";
import {
  buildHeadSeo,
  getEntryPageSeo,
  getLanguageAlternates,
  isStagingSite,
  toAbsoluteUrl,
} from "./helpers";

// Types
import type { LocalePath } from "./types";

const site = new URL("https://www.amir-gb.nl");
const preview = new URL("https://amir-gb.josefurtado-digital.workers.dev");
const contactPaths: LocalePath[] = [
  { locale: "nl", path: "/contact/" },
  { locale: "en", path: "/en/contact/" },
  { locale: "pt", path: "/pt/contact/" },
];

describe("toAbsoluteUrl", () => {
  it("joins a path to the site and leaves a full address alone", () => {
    expect(toAbsoluteUrl("/en/contact/", site)).toBe("https://www.amir-gb.nl/en/contact/");
    expect(toAbsoluteUrl("https://cdn.example.org/a.jpg", site)).toBe(
      "https://cdn.example.org/a.jpg",
    );
  });
});

describe("isStagingSite", () => {
  it("keeps the preview address out of search, not the real domain", () => {
    expect(isStagingSite(preview)).toBe(true);
    expect(isStagingSite(site)).toBe(false);
  });
});

describe("getLanguageAlternates", () => {
  it("lists every language and Dutch again as x-default", () => {
    expect(getLanguageAlternates(contactPaths, site, "nl")).toEqual([
      { hreflang: "nl", href: "https://www.amir-gb.nl/contact/" },
      { hreflang: "en", href: "https://www.amir-gb.nl/en/contact/" },
      { hreflang: "pt", href: "https://www.amir-gb.nl/pt/contact/" },
      { hreflang: "x-default", href: "https://www.amir-gb.nl/contact/" },
    ]);
  });
});

describe("buildHeadSeo", () => {
  const base = {
    site,
    pathname: "/en/contact/",
    locale: "en" as const,
    localePaths: contactPaths,
    defaultLocale: "nl" as const,
    shareImageAlt: "AMIR-GB",
  };

  it("gives a page its own address, its languages and the share card", () => {
    const seo = buildHeadSeo(base);
    expect(seo.canonical).toBe("https://www.amir-gb.nl/en/contact/");
    expect(seo.robots).toBeNull();
    expect(seo.ogLocale).toBe("en_GB");
    expect(seo.ogLocaleAlternates).toEqual(["nl_NL", "pt_PT"]);
    expect(seo.image).toEqual({
      url: "https://www.amir-gb.nl/og/amir-gb.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: "AMIR-GB",
    });
  });

  it("keeps a page out of search on the preview address or when it asks", () => {
    expect(buildHeadSeo({ ...base, site: preview }).robots).toBe("noindex");
    expect(buildHeadSeo({ ...base, seo: { noindex: true } }).robots).toBe("noindex");
  });

  it("takes a page's own canonical, languages and picture", () => {
    const seo = buildHeadSeo({
      ...base,
      seo: {
        canonical: "https://www.amir-gb.nl/news/feest/",
        alternates: [{ hreflang: "nl", href: "https://www.amir-gb.nl/news/feest/" }],
        image: "/_emdash/api/media/file/feest.jpg",
        imageAlt: "Het feest",
      },
    });
    expect(seo.canonical).toBe("https://www.amir-gb.nl/news/feest/");
    expect(seo.ogLocaleAlternates).toEqual(["nl_NL"]);
    expect(seo.image.url).toBe("https://www.amir-gb.nl/_emdash/api/media/file/feest.jpg");
    expect(seo.image.width).toBeNull();
  });
});

describe("getEntryPageSeo", () => {
  const alternates = [
    { hreflang: "nl", href: "https://www.amir-gb.nl/news/feest/" },
    { hreflang: "x-default", href: "https://www.amir-gb.nl/news/feest/" },
  ];

  it("points a Dutch post shown at another language's address at the Dutch one", () => {
    const seo = getEntryPageSeo({ alternates, isDutchOnly: true, defaultLocale: "nl" });
    expect(seo.canonical).toBe("https://www.amir-gb.nl/news/feest/");
    expect(seo.alternates).toBe(alternates);
    expect(seo.type).toBe("article");
    expect(seo.noindex).toBe(false);
    expect(seo.contentLocale).toBe("nl");
  });

  it("lets the editor's settings win over the post's own", () => {
    const seo = getEntryPageSeo({
      alternates,
      isDutchOnly: false,
      defaultLocale: "nl",
      image: "/photo.jpg",
      seo: {
        title: "Ons feest",
        description: "Kom ook",
        image: "/share.jpg",
        canonical: null,
        noIndex: true,
      },
    });
    expect(seo.canonical).toBeUndefined();
    expect(seo.description).toBe("Kom ook");
    expect(seo.image).toBe("/share.jpg");
    expect(seo.noindex).toBe(true);
  });
});
