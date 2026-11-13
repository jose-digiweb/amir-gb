// Dependencies
import { TILE_COLOUR } from "../../../lib/content/constants";
import { HELP_SERVICE, VALUE } from "../constants";

// Types
import type { ConstellationLayout } from "./types";

/**
 * The {@link PHONE_CONSTELLATION} constant
 * @description The phone's constellation from the Main board, in its 390 wide drawing: three icon discs, no values
 */
export const PHONE_CONSTELLATION = {
  width: 390,
  height: 372,
  centreX: 296,
  centreY: 206,
  photoSize: 150,
  ring: { radius: 106, count: 20, size: 14 },
  threads: {
    path: "M190.6 194.8 Q173.2 167.4 176.9 146.6 M204.2 259.0 Q173.8 247.1 164.4 228.1 M253.0 302.9 Q221.6 311.0 203.0 301.2",
    width: 1.5,
    dash: "4 4",
  },
  dots: { centreX: 296, centreY: 326, radius: 430, step: 40 },
  discs: [
    { service: HELP_SERVICE.LETTERS, tint: TILE_COLOUR.GOLD, x: 138, y: 83, size: 58 },
    { service: HELP_SERVICE.DUTCH, tint: TILE_COLOUR.FOREST, x: 107, y: 177, size: 58 },
    { service: HELP_SERVICE.WORK, tint: TILE_COLOUR.BRICK, x: 138, y: 271, size: 58 },
  ],
  pills: [],
  lozenges: [
    { x: 34, y: 114, size: 13, isRinged: true },
    { x: 28, y: 324, size: 13, isRinged: false },
    { x: 354, y: 346, size: 13, isRinged: true },
  ],
  hasLabels: false,
} as const satisfies ConstellationLayout;

/**
 * The {@link TABLET_CONSTELLATION} constant
 * @description The tablet's constellation from the V1-Tablet board, in its 834 wide drawing
 */
export const TABLET_CONSTELLATION = {
  width: 834,
  height: 1112,
  centreX: 578,
  centreY: 664,
  photoSize: 200,
  ring: { radius: 140, count: 24, size: 20 },
  threads: {
    path: "M521.1 536.1 Q531.1 503.5 547.5 492.5 M660.2 550.7 Q693.3 543.1 711.0 551.8 M717.2 678.7 Q740.3 703.6 741.6 723.3 M634.9 791.9 Q624.9 824.5 608.5 835.5 M495.8 777.3 Q462.7 784.9 445.0 776.2 M438.8 649.3 Q415.7 624.4 414.4 604.7",
    width: 1.5,
    dash: "5 5",
  },
  dots: { centreX: 578, centreY: 604, radius: 600, step: 40 },
  discs: [
    { service: HELP_SERVICE.DUTCH, tint: TILE_COLOUR.FOREST, x: 528, y: 392, size: 100 },
    { service: HELP_SERVICE.CULTURE, tint: TILE_COLOUR.FOREST, x: 720, y: 503, size: 100 },
    { service: HELP_SERVICE.WORK, tint: TILE_COLOUR.BRICK, x: 720, y: 725, size: 100 },
    { service: HELP_SERVICE.KIDS, tint: TILE_COLOUR.NAVY, x: 528, y: 836, size: 100 },
    { service: HELP_SERVICE.HEALTH, tint: TILE_COLOUR.GOLD, x: 336, y: 725, size: 100 },
    { service: HELP_SERVICE.LETTERS, tint: TILE_COLOUR.GOLD, x: 336, y: 503, size: 100 },
  ],
  pills: [
    { value: VALUE.SOLIDARITY, x: 700, y: 300 },
    { value: VALUE.UNITY, x: 732, y: 962 },
    { value: VALUE.DIGNITY, x: 220, y: 704 },
  ],
  lozenges: [
    { x: 491, y: 227, size: 18, isRinged: true },
    { x: 796, y: 170, size: 20, isRinged: false },
    { x: 161, y: 891, size: 18, isRinged: true },
  ],
  hasLabels: true,
} as const satisfies ConstellationLayout;

/**
 * The {@link DESKTOP_CONSTELLATION} constant
 * @description The desktop's constellation from the V1-Desktop board, cut to the part right of the words
 */
export const DESKTOP_CONSTELLATION = {
  width: 1440,
  height: 920,
  centreX: 1040,
  centreY: 470,
  photoSize: 190,
  ring: { radius: 140, count: 24, size: 22 },
  threads: {
    path: "M941.0 371.0 Q920.6 318.5 868.1 298.1 M1070.9 333.5 Q1092.9 303.7 1085.9 267.4 M1179.9 463.5 Q1241.7 487.4 1301.1 458.0 M1154.4 550.7 Q1183.7 599.5 1239.4 610.8 M1059.5 608.6 Q1041.8 671.3 1076.1 726.6 M903.3 500.1 Q875.4 494.5 852.5 511.2",
    width: 1.75,
    dash: "6 6",
  },
  dots: { centreX: 1040, centreY: 470, radius: 620, step: 48 },
  discs: [
    { service: HELP_SERVICE.LETTERS, tint: TILE_COLOUR.GOLD, x: 764, y: 194, size: 112 },
    { service: HELP_SERVICE.DUTCH, tint: TILE_COLOUR.FOREST, x: 1048, y: 153, size: 104 },
    { service: HELP_SERVICE.CULTURE, tint: TILE_COLOUR.FOREST, x: 1313, y: 403, size: 104 },
    { service: HELP_SERVICE.WORK, tint: TILE_COLOUR.BRICK, x: 1239, y: 594, size: 112 },
    { service: HELP_SERVICE.KIDS, tint: TILE_COLOUR.NAVY, x: 1033, y: 738, size: 104 },
    { service: HELP_SERVICE.HEALTH, tint: TILE_COLOUR.GOLD, x: 738, y: 473, size: 104 },
  ],
  pills: [
    { value: VALUE.SOLIDARITY, x: 972, y: 136 },
    { value: VALUE.UNITY, x: 817, y: 718 },
    { value: VALUE.DIGNITY, x: 1290, y: 277 },
  ],
  lozenges: [
    { x: 725, y: 389, size: 22, isRinged: false },
    { x: 1409, y: 749, size: 22, isRinged: true },
    { x: 1231, y: 141, size: 18, isRinged: false },
    { x: 599, y: 185, size: 22, isRinged: true },
    { x: 1171, y: 871, size: 18, isRinged: false },
  ],
  hasLabels: true,
} as const satisfies ConstellationLayout;

/**
 * The {@link DESKTOP_CROP_X} constant
 * @description Where the desktop drawing starts: everything left of it belongs to the words
 */
export const DESKTOP_CROP_X = 560;

/**
 * The {@link PILL_BOX} constant
 * @description The box a value pill is centred in, wide enough for the longest value in any language
 */
export const PILL_BOX = {
  WIDTH: 280,
  HEIGHT: 56,
} as const;
