// Dependencies
import { VALUE } from "../../../site/constants";

// Types
import type { ArchiveDrawingLayout } from "./types";

/**
 * The {@link KNOT_SIDE} constant
 * @description The side of the line a month's events hang on
 */
export const KNOT_SIDE = {
  UP: "up",
  DOWN: "down",
} as const;

/**
 * The {@link TIMELINE_MARK} constant
 * @description How far a month's label sits from its point, on the side away from its events, in drawing units
 */
export const TIMELINE_MARK = {
  GAP: 28,
} as const;

/**
 * The {@link ARCHIVE_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the Past events boards: the logo starting a stitched timeline through the recent months, the past events hanging off it as knots
 */
export const ARCHIVE_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 356, cropX: 0, cropY: 0 },
    dots: { centreX: 250, centreY: 174, radius: 260, step: 28 },
    ring: { centreX: 74, centreY: 176, radius: 88, count: 16, size: 16 },
    disc: { centreX: 74, centreY: 176, size: 120 },
    founded: null,
    line: {
      start: { x: 169, y: 206 },
      tail: { x: 420, y: 230 },
      stitch: { width: 2.2, dash: "8 7" },
    },
    slots: [
      { x: 186, y: 262, side: KNOT_SIDE.DOWN },
      { x: 255, y: 214, side: KNOT_SIDE.UP },
      { x: 330, y: 272, side: KNOT_SIDE.UP },
    ],
    knot: { size: 40, reach: 72, spread: 38, max: 3 },
    pointBead: 18,
    chips: [],
    sparkles: [
      { x: 353, y: 103, size: 14, isRinged: true },
      { x: 13, y: 313, size: 14, isRinged: false },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 900, cropX: 0, cropY: 380 },
    dots: { centreX: 430, centreY: 660, radius: 450, step: 40 },
    ring: { centreX: 130, centreY: 650, radius: 111, count: 18, size: 20 },
    disc: { centreX: 130, centreY: 650, size: 150 },
    founded: { x: 130, y: 791 },
    line: {
      start: { x: 247, y: 650 },
      tail: { x: 870, y: 640 },
      stitch: { width: 3, dash: "8 7" },
    },
    slots: [
      { x: 310, y: 620, side: KNOT_SIDE.UP },
      { x: 430, y: 700, side: KNOT_SIDE.DOWN },
      { x: 590, y: 620, side: KNOT_SIDE.UP },
      { x: 750, y: 680, side: KNOT_SIDE.DOWN },
    ],
    knot: { size: 56, reach: 126, spread: 30, max: 5 },
    pointBead: 24,
    chips: [],
    sparkles: [
      { x: 771, y: 371, size: 18, isRinged: true },
      { x: 292, y: 872, size: 16, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 860, cropX: 560, cropY: 0 },
    dots: { centreX: 1120, centreY: 480, radius: 590, step: 48 },
    ring: { centreX: 800, centreY: 470, radius: 140, count: 24, size: 22 },
    disc: { centreX: 800, centreY: 470, size: 190 },
    founded: { x: 800, y: 644 },
    line: {
      start: { x: 947, y: 470 },
      tail: { x: 1530, y: 460 },
      stitch: { width: 3, dash: "8 7" },
    },
    slots: [
      { x: 1000, y: 430, side: KNOT_SIDE.UP },
      { x: 1120, y: 520, side: KNOT_SIDE.DOWN },
      { x: 1270, y: 440, side: KNOT_SIDE.UP },
      { x: 1410, y: 500, side: KNOT_SIDE.DOWN },
    ],
    knot: { size: 66, reach: 150, spread: 30, max: 5 },
    pointBead: 24,
    chips: [{ value: VALUE.UNITY, x: 960, y: 700 }],
    sparkles: [
      { x: 729, y: 209, size: 22, isRinged: true },
      { x: 1381, y: 191, size: 18, isRinged: false },
      { x: 1191, y: 751, size: 18, isRinged: true },
    ],
  },
} as const satisfies Record<string, ArchiveDrawingLayout>;

/**
 * The {@link KNOT_STITCH} constant
 * @description How the short threads from the line to each event's knot are sewn
 */
export const KNOT_STITCH = { width: 1.5, dash: "5 5" } as const;
