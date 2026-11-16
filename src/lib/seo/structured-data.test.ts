// Dependencies
import { describe, expect, it } from "vitest";
import {
  getArticleSchema,
  getBreadcrumbSchema,
  getEventSchema,
  getSiteSchemas,
  renderJsonLd,
} from "./structured-data";

const site = new URL("https://www.amir-gb.nl");
const eventBase = {
  site,
  url: "https://www.amir-gb.nl/events/feest/",
  name: "Feest",
  startsAt: new Date("2026-12-12T15:00:00Z"),
  isOnline: false,
  locale: "nl" as const,
};

describe("getSiteSchemas", () => {
  it("describes AMIR-GB in Breda and its website, without profiles it does not have yet", () => {
    const [organization, website] = getSiteSchemas({
      site,
      locale: "en",
      legalName: "AMIR-GB, Association",
      logo: "/_astro/logo.svg",
      sameAs: [],
    });
    expect(organization?.["@type"]).toBe("NGO");
    expect(organization?.["@id"]).toBe("https://www.amir-gb.nl/#organization");
    expect(organization?.logo).toBe("https://www.amir-gb.nl/_astro/logo.svg");
    expect(organization?.address).toMatchObject({
      postalCode: "4827 LJ",
      addressLocality: "Breda",
    });
    expect(organization?.identifier).toMatchObject({ propertyID: "KvK", value: "42120588" });
    expect(organization).not.toHaveProperty("sameAs");
    expect(website).toMatchObject({ "@type": "WebSite", inLanguage: "en" });
  });
});

describe("getEventSchema", () => {
  it("gives a moved event in a hall its old date and the place", () => {
    const event = getEventSchema({
      ...eventBase,
      status: "verplaatst",
      originalStartsAt: new Date("2026-12-05T15:00:00Z"),
      placeName: "Wijkcentrum",
      address: "Hoofdstraat 1, Breda",
    });
    expect(event.eventStatus).toBe("https://schema.org/EventRescheduled");
    expect(event.previousStartDate).toBe("2026-12-05T15:00:00.000Z");
    expect(event.eventAttendanceMode).toBe("https://schema.org/OfflineEventAttendanceMode");
    expect(event.location).toEqual([
      { "@type": "Place", name: "Wijkcentrum", address: "Hoofdstraat 1, Breda" },
    ]);
    expect(event.organizer).toEqual({ "@id": "https://www.amir-gb.nl/#organization" });
  });

  it("points an online event at its own page, never at the hidden link", () => {
    const event = getEventSchema({ ...eventBase, status: "gaat door", isOnline: true });
    expect(event.eventStatus).toBe("https://schema.org/EventScheduled");
    expect(event.eventAttendanceMode).toBe("https://schema.org/OnlineEventAttendanceMode");
    expect(event.location).toEqual([
      { "@type": "VirtualLocation", url: "https://www.amir-gb.nl/events/feest/" },
    ]);
  });

  it("says a cancelled event with a place and a stream is mixed and cancelled", () => {
    const event = getEventSchema({
      ...eventBase,
      status: "afgelast",
      isOnline: true,
      placeName: "Wijkcentrum",
    });
    expect(event.eventStatus).toBe("https://schema.org/EventCancelled");
    expect(event.eventAttendanceMode).toBe("https://schema.org/MixedEventAttendanceMode");
    expect(event).not.toHaveProperty("previousStartDate");
  });
});

describe("getArticleSchema and getBreadcrumbSchema", () => {
  it("describes a post published by AMIR-GB and its place in the site", () => {
    const article = getArticleSchema({
      site,
      url: "https://www.amir-gb.nl/news/feest/",
      headline: "Feest",
      publishedAt: new Date("2026-11-01T10:00:00Z"),
      image: "/photo.jpg",
      locale: "nl",
    });
    expect(article).toMatchObject({
      "@type": "NewsArticle",
      datePublished: "2026-11-01T10:00:00.000Z",
      image: "https://www.amir-gb.nl/photo.jpg",
      publisher: { "@id": "https://www.amir-gb.nl/#organization" },
    });
    expect(
      getBreadcrumbSchema(
        [
          { name: "AMIR-GB", path: "/" },
          { name: "Nieuws", path: "/news/" },
        ],
        site,
      ).itemListElement,
    ).toEqual([
      { "@type": "ListItem", position: 1, name: "AMIR-GB", item: "https://www.amir-gb.nl/" },
      { "@type": "ListItem", position: 2, name: "Nieuws", item: "https://www.amir-gb.nl/news/" },
    ]);
  });
});

describe("renderJsonLd", () => {
  it("keeps text from closing the script tag", () => {
    expect(renderJsonLd([{ name: "</script><b>" }])).toBe(
      '{"@context":"https://schema.org","@graph":[{"name":"\\u003c/script>\\u003cb>"}]}',
    );
  });
});
