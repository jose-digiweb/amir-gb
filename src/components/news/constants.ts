// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";
import { VALUE } from "../../site/constants";

// Types
import type { NewsDrawingLayout } from "./types";

/**
 * The {@link NOTICE} constant
 * @description The kinds of post that hang from the opening's line, with Photos for the stories' pictures
 */
export const NOTICE = {
  ANNOUNCEMENTS: "announcements",
  NEWS: "news",
  STORIES: "stories",
  PHOTOS: "photos",
} as const;

/**
 * The {@link NOTICE_LABEL} constant
 * @description The translation key of each card's name
 */
export const NOTICE_LABEL = {
  [NOTICE.ANNOUNCEMENTS]: "news.filterAnnouncements",
  [NOTICE.NEWS]: "news.filterNews",
  [NOTICE.STORIES]: "news.filterStories",
  [NOTICE.PHOTOS]: "news.noticePhotos",
} as const;

/**
 * The {@link NEWS_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the News boards: the logo holding one end of a stitched line, with the kinds of post hanging from it as pinned cards
 */
export const NEWS_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 356, cropX: 0, cropY: 0 },
    dots: { centreX: 123, centreY: 193, radius: 260, step: 28 },
    line: { path: "M-20 118 Q130 252 252 150", stitch: { width: 2.2, dash: "8 7" } },
    ring: { centreX: 322, centreY: 172, radius: 91, count: 16, size: 16 },
    disc: { centreX: 322, centreY: 172, size: 124 },
    cards: [
      {
        notice: NOTICE.ANNOUNCEMENTS,
        tint: TILE_COLOUR.BRICK,
        x: 25,
        y: 160,
        width: 56,
        height: 54,
        turn: -5,
      },
      {
        notice: NOTICE.STORIES,
        tint: TILE_COLOUR.FOREST,
        x: 95,
        y: 183,
        width: 56,
        height: 54,
        turn: -3,
      },
      {
        notice: NOTICE.NEWS,
        tint: TILE_COLOUR.NAVY,
        x: 164,
        y: 175,
        width: 56,
        height: 54,
        turn: 4,
      },
    ],
    hasLabels: false,
    pins: [
      { x: 42, y: 159, size: 22, isRinged: true },
      { x: 112, y: 182, size: 22, isRinged: true },
      { x: 181, y: 174, size: 22, isRinged: true },
    ],
    chips: [],
    sparkles: [
      { x: 23, y: 323, size: 14, isRinged: true },
      { x: 203, y: 313, size: 14, isRinged: false },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 800, cropX: 0, cropY: 300 },
    dots: { centreX: 490, centreY: 628, radius: 450, step: 40 },
    line: { path: "M172 520 Q470 760 850 470", stitch: { width: 3, dash: "8 7" } },
    ring: { centreX: 110, centreY: 470, radius: 96, count: 16, size: 20 },
    disc: { centreX: 110, centreY: 470, size: 130 },
    cards: [
      {
        notice: NOTICE.ANNOUNCEMENTS,
        tint: TILE_COLOUR.BRICK,
        x: 234,
        y: 585,
        width: 120,
        height: 100,
        turn: -5,
      },
      {
        notice: NOTICE.NEWS,
        tint: TILE_COLOUR.NAVY,
        x: 377,
        y: 618,
        width: 120,
        height: 100,
        turn: 4,
      },
      {
        notice: NOTICE.STORIES,
        tint: TILE_COLOUR.FOREST,
        x: 527,
        y: 600,
        width: 120,
        height: 100,
        turn: -3,
      },
      {
        notice: NOTICE.PHOTOS,
        tint: TILE_COLOUR.GOLD,
        x: 685,
        y: 531,
        width: 120,
        height: 100,
        turn: 6,
      },
    ],
    hasLabels: true,
    pins: [
      { x: 283, y: 584, size: 22, isRinged: true },
      { x: 426, y: 617, size: 22, isRinged: true },
      { x: 576, y: 599, size: 22, isRinged: true },
      { x: 734, y: 530, size: 22, isRinged: true },
    ],
    chips: [],
    sparkles: [
      { x: 771, y: 321, size: 18, isRinged: true },
      { x: 322, y: 412, size: 16, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 860, cropX: 560, cropY: 0 },
    dots: { centreX: 1148, centreY: 509, radius: 590, step: 48 },
    line: { path: "M830 395 Q1150 640 1460 360", stitch: { width: 3, dash: "8 7" } },
    ring: { centreX: 760, centreY: 330, radius: 118, count: 20, size: 20 },
    disc: { centreX: 760, centreY: 330, size: 160 },
    cards: [
      {
        notice: NOTICE.ANNOUNCEMENTS,
        tint: TILE_COLOUR.BRICK,
        x: 881,
        y: 456,
        width: 128,
        height: 108,
        turn: -5,
      },
      {
        notice: NOTICE.NEWS,
        tint: TILE_COLOUR.NAVY,
        x: 1020,
        y: 497,
        width: 128,
        height: 108,
        turn: 4,
      },
      {
        notice: NOTICE.STORIES,
        tint: TILE_COLOUR.FOREST,
        x: 1159,
        y: 487,
        width: 128,
        height: 108,
        turn: -3,
      },
      {
        notice: NOTICE.PHOTOS,
        tint: TILE_COLOUR.GOLD,
        x: 1290,
        y: 430,
        width: 128,
        height: 108,
        turn: 6,
      },
    ],
    hasLabels: true,
    pins: [
      { x: 934, y: 455, size: 22, isRinged: true },
      { x: 1073, y: 496, size: 22, isRinged: true },
      { x: 1212, y: 486, size: 22, isRinged: true },
      { x: 1343, y: 429, size: 22, isRinged: true },
    ],
    chips: [{ value: VALUE.UNITY, x: 1120, y: 700 }],
    sparkles: [
      { x: 1291, y: 171, size: 18, isRinged: false },
      { x: 1380, y: 690, size: 20, isRinged: true },
      { x: 691, y: 631, size: 18, isRinged: true },
    ],
  },
} as const satisfies Record<string, NewsDrawingLayout>;
