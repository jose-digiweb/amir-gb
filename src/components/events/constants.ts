// Dependencies
import { VALUE } from "../../site/constants";

// Types
import type { EventsDrawingLayout } from "./types";

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
