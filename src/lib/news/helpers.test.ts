// Dependencies
import { describe, expect, it } from "vitest";
import { POST_TYPE } from "../content/constants";
import { NEWS_LIST_STATE } from "./constants";
import {
  fillPostTitle,
  getGalleryImages,
  getLastPage,
  getMorePosts,
  getNewsQuery,
  getPostDay,
  planNewsList,
  readNewsFilter,
  readNewsPage,
} from "./helpers";

// Types
import type { MediaImage, PostType } from "../content/types";
import type { NewsPost } from "./types";

const image = (id: string): MediaImage => ({ id });

const post = (id: string, type: PostType, photo?: string): NewsPost => ({
  id,
  href: `/news/${id}/`,
  type,
  title: id,
  image: photo ? image(photo) : undefined,
  publishedAt: new Date("2026-11-14T10:00:00Z"),
  isDutchOnly: false,
});

const posts = (count: number, type: PostType = POST_TYPE.NEWS): NewsPost[] =>
  Array.from({ length: count }, (_, index) => post(`p${index}`, type, `i${index}`));

describe("readNewsFilter", () => {
  it("reads a post type and ignores anything else", () => {
    expect(readNewsFilter(new URLSearchParams("type=verhaal"))).toBe(POST_TYPE.STORY);
    expect(readNewsFilter(new URLSearchParams("type=stories"))).toBeNull();
    expect(readNewsFilter(new URLSearchParams())).toBeNull();
  });
});

describe("readNewsPage", () => {
  it("reads a whole page number from one and falls back to the first page", () => {
    expect(readNewsPage(new URLSearchParams("page=3"))).toBe(3);
    expect(readNewsPage(new URLSearchParams("page=0"))).toBe(1);
    expect(readNewsPage(new URLSearchParams("page=2.5"))).toBe(1);
    expect(readNewsPage(new URLSearchParams("page=abc"))).toBe(1);
  });
});

describe("getNewsQuery", () => {
  it("leaves the plain address for the first page of every post", () => {
    expect(getNewsQuery(null, 1)).toBe("");
    expect(getNewsQuery(POST_TYPE.ANNOUNCEMENT, 1)).toBe("?type=aankondiging");
    expect(getNewsQuery(POST_TYPE.STORY, 2)).toBe("?type=verhaal&page=2");
  });
});

describe("getLastPage", () => {
  it("fits seven posts on the first page and six on each older one", () => {
    expect(getLastPage(0)).toBe(1);
    expect(getLastPage(7)).toBe(1);
    expect(getLastPage(8)).toBe(2);
    expect(getLastPage(13)).toBe(2);
    expect(getLastPage(14)).toBe(3);
  });
});

describe("planNewsList", () => {
  it("shows the message before the first post", () => {
    expect(planNewsList([], null, 1).state).toBe(NEWS_LIST_STATE.EMPTY);
  });

  it("shows the type's message when it has no posts", () => {
    const plan = planNewsList(posts(3), POST_TYPE.ANNOUNCEMENT, 1);
    expect(plan.state).toBe(NEWS_LIST_STATE.EMPTY_TYPE);
    expect(plan.posts).toEqual([]);
  });

  it("features the newest post and lists six more, with older posts left", () => {
    const plan = planNewsList(posts(10), null, 1);
    expect(plan.featured?.id).toBe("p0");
    expect(plan.posts.map((item) => item.id)).toEqual(["p1", "p2", "p3", "p4", "p5", "p6"]);
    expect(plan.hasMore).toBe(true);
  });

  it("never shows past the last page", () => {
    const plan = planNewsList(posts(10), null, 9);
    expect(plan.page).toBe(2);
    expect(plan.posts).toHaveLength(9);
    expect(plan.hasMore).toBe(false);
  });

  it("filters to one type", () => {
    const mixed = [
      post("a", POST_TYPE.NEWS),
      post("b", POST_TYPE.STORY),
      post("c", POST_TYPE.NEWS),
    ];
    const plan = planNewsList(mixed, POST_TYPE.NEWS, 1);
    expect(plan.featured?.id).toBe("a");
    expect(plan.posts.map((item) => item.id)).toEqual(["c"]);
  });
});

describe("getMorePosts", () => {
  it("leaves out the post being read and keeps three", () => {
    expect(getMorePosts(posts(5), "p0").map((item) => item.id)).toEqual(["p1", "p2", "p3"]);
  });
});

describe("getGalleryImages", () => {
  it("skips rows without a photo and the post's own photo", () => {
    const rows = [{ image: image("a") }, {}, { image: image("own") }, { image: image("b") }];
    expect(getGalleryImages(rows, image("own")).map((photo) => photo.id)).toEqual(["a", "b"]);
    expect(getGalleryImages(undefined, undefined)).toEqual([]);
  });
});

describe("getPostDay", () => {
  const now = new Date("2026-11-15T12:00:00Z");

  it("shows the day and month for this year, and the year for an older post", () => {
    expect(getPostDay(new Date("2026-11-14T10:00:00Z"), "en-GB", now)).toBe("14 November");
    expect(getPostDay(new Date("2025-03-02T10:00:00Z"), "nl-NL", now)).toBe("2 maart 2025");
  });

  it("reads the day in Dutch time", () => {
    expect(getPostDay(new Date("2026-11-14T23:30:00Z"), "en-GB", now)).toBe("15 November");
  });
});

describe("fillPostTitle", () => {
  it("puts the title into the page title's copy", () => {
    expect(fillPostTitle("{title} · AMIR-GB", "Independence Day")).toBe(
      "Independence Day · AMIR-GB",
    );
  });
});
