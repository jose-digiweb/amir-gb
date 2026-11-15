// Dependencies
import { VALUE } from "../../site/constants";

// Types
import type { EventsDrawingLayout, EventsWeekLayout } from "./types";

/**
 * The {@link EVENTS_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the What's on boards: the logo in its ring inside a tilted stitched orbit carrying the next dates
 */
export const EVENTS_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 360, cropX: 0, cropY: 0 },
    dots: { centreX: 220, centreY: 190, radius: 260, step: 28 },
    orbit: { centreX: 300, centreY: 190, radiusX: 230, radiusY: 130, turn: -14 },
    stitch: { width: 2.5, dash: "8 7" },
    ring: { centreX: 300, centreY: 190, radius: 111, count: 18, size: 18 },
    disc: { centreX: 300, centreY: 190, size: 150 },
    badge: { width: 58, height: 62 },
    slots: [
      { x: 127, y: 133 },
      { x: 75, y: 223 },
      { x: 123, y: 301 },
    ],
    chips: [],
    sparkles: [
      { x: 23, y: 323, size: 14, isRinged: true },
      { x: 193, y: 323, size: 14, isRinged: false },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 850, cropX: 0, cropY: 300 },
    dots: { centreX: 540, centreY: 610, radius: 450, step: 40 },
    orbit: { centreX: 540, centreY: 610, radiusX: 245, radiusY: 160, turn: -14 },
    stitch: { width: 2.5, dash: "8 7" },
    ring: { centreX: 540, centreY: 610, radius: 125, count: 22, size: 22 },
    disc: { centreX: 540, centreY: 610, size: 170 },
    badge: { width: 65, height: 70 },
    slots: [
      { x: 308.5, y: 598 },
      { x: 422.5, y: 484 },
      { x: 625.5, y: 446 },
      { x: 759.5, y: 512 },
      { x: 765.5, y: 636 },
      { x: 435.5, y: 771 },
    ],
    chips: [],
    sparkles: [
      { x: 791, y: 321, size: 18, isRinged: true },
      { x: 132, y: 692, size: 16, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 880, cropX: 560, cropY: 0 },
    dots: { centreX: 1050, centreY: 450, radius: 590, step: 48 },
    orbit: { centreX: 1050, centreY: 450, radiusX: 340, radiusY: 200, turn: -14 },
    stitch: { width: 2.5, dash: "8 7" },
    ring: { centreX: 1050, centreY: 450, radius: 147, count: 26, size: 22 },
    disc: { centreX: 1050, centreY: 450, size: 200 },
    badge: { width: 74, height: 80 },
    slots: [
      { x: 731, y: 443 },
      { x: 892, y: 296 },
      { x: 1173, y: 241 },
      { x: 1356, y: 320 },
      { x: 1360, y: 476 },
      { x: 900, y: 656 },
    ],
    chips: [{ value: VALUE.WELCOME, x: 1020, y: 750 }],
    sparkles: [
      { x: 749, y: 149, size: 22, isRinged: true },
      { x: 1371, y: 151, size: 18, isRinged: false },
      { x: 1391, y: 751, size: 18, isRinged: true },
    ],
  },
} as const satisfies Record<string, EventsDrawingLayout>;

/**
 * The {@link WEEK_REFERENCE_MONDAY} constant
 * @description Noon on a Monday, from which the week's short day names are written in the page's language
 */
export const WEEK_REFERENCE_MONDAY = Date.UTC(2024, 0, 1, 12);

/**
 * The {@link WEEK_STOP_LETTERS} constant
 * @description How many letters of a day's name a stop on the week orbit shows, so every language fits the stop
 */
export const WEEK_STOP_LETTERS = 3;

/**
 * The {@link EVENTS_WEEK_DRAWINGS} constant
 * @description The opening's drawing while no event is planned, from the Page-EventsEmpty boards: the same orbit as the week, Monday first; on phone it runs off the right edge, Thursday at the bottom
 */
export const EVENTS_WEEK_DRAWINGS = {
  PHONE: {
    frame: EVENTS_DRAWINGS.PHONE.frame,
    dots: EVENTS_DRAWINGS.PHONE.dots,
    orbit: EVENTS_DRAWINGS.PHONE.orbit,
    stitch: EVENTS_DRAWINGS.PHONE.stitch,
    ring: EVENTS_DRAWINGS.PHONE.ring,
    disc: EVENTS_DRAWINGS.PHONE.disc,
    stops: [
      { x: 194, y: 90 },
      { x: 78, y: 203 },
      { x: 130, y: 305 },
      { x: 309, y: 321 },
      { x: 482, y: 238 },
      { x: 518, y: 119 },
      { x: 390, y: 53 },
    ],
    stopSize: 50,
    activitySize: 96,
    chip: null,
    sparkles: EVENTS_DRAWINGS.PHONE.sparkles,
  },
  TABLET: {
    frame: EVENTS_DRAWINGS.TABLET.frame,
    dots: EVENTS_DRAWINGS.TABLET.dots,
    orbit: EVENTS_DRAWINGS.TABLET.orbit,
    stitch: EVENTS_DRAWINGS.TABLET.stitch,
    ring: EVENTS_DRAWINGS.TABLET.ring,
    disc: EVENTS_DRAWINGS.TABLET.disc,
    stops: [
      { x: 419, y: 482 },
      { x: 615, y: 443 },
      { x: 754, y: 530 },
      { x: 732, y: 677 },
      { x: 565, y: 773 },
      { x: 380, y: 747 },
      { x: 315, y: 618 },
    ],
    stopSize: 58,
    activitySize: 110,
    chip: null,
    sparkles: EVENTS_DRAWINGS.TABLET.sparkles,
  },
  DESKTOP: {
    frame: EVENTS_DRAWINGS.DESKTOP.frame,
    dots: EVENTS_DRAWINGS.DESKTOP.dots,
    orbit: EVENTS_DRAWINGS.DESKTOP.orbit,
    stitch: EVENTS_DRAWINGS.DESKTOP.stitch,
    ring: EVENTS_DRAWINGS.DESKTOP.ring,
    disc: EVENTS_DRAWINGS.DESKTOP.disc,
    stops: [
      { x: 882, y: 301 },
      { x: 1170, y: 241 },
      { x: 1368, y: 338 },
      { x: 1327, y: 520 },
      { x: 1077, y: 649 },
      { x: 807, y: 628 },
      { x: 720, y: 473 },
    ],
    stopSize: 58,
    activitySize: 128,
    chip: { x: 945, y: 702 },
    sparkles: EVENTS_DRAWINGS.DESKTOP.sparkles,
  },
} as const satisfies Record<string, EventsWeekLayout>;

/**
 * The {@link EVENTS_PLACEHOLDER} constant
 * @description The places in the What's on copy that a value fills in
 */
export const EVENTS_PLACEHOLDER = {
  DATE: "{date}",
} as const;
