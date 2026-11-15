// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";
import { VALUE } from "../../site/constants";

// Types
import type { DonateDrawingLayout } from "./types";

/**
 * The {@link GIFT_USE} constant
 * @description What gifts are for, from AMIR-GB's own plan
 */
export const GIFT_USE = {
  EMERGENCY: "emergency",
  RIGHTS: "rights",
  LEARNING: "learning",
  BRIDGE: "bridge",
} as const;

/**
 * The {@link GIFT_USES} constant
 * @description The tiles of What your gift does, in order, each with its tint and the keys of its title and line
 */
export const GIFT_USES = [
  {
    use: GIFT_USE.EMERGENCY,
    tint: TILE_COLOUR.BRICK,
    title: "donatePage.emergencyTitle",
    text: "donatePage.emergencyText",
  },
  {
    use: GIFT_USE.RIGHTS,
    tint: TILE_COLOUR.GOLD,
    title: "donatePage.rightsTitle",
    text: "donatePage.rightsText",
  },
  {
    use: GIFT_USE.LEARNING,
    tint: TILE_COLOUR.FOREST,
    title: "donatePage.learningTitle",
    text: "donatePage.learningText",
  },
  {
    use: GIFT_USE.BRIDGE,
    tint: TILE_COLOUR.NAVY,
    title: "donatePage.bridgeTitle",
    text: "donatePage.bridgeText",
  },
] as const;

/**
 * The {@link WAY_CARD_TONE} constant
 * @description The ground of a card's round icon: the sand of the page, or the info tint for the tax card
 */
export const WAY_CARD_TONE = {
  SAND: "sand",
  INFO: "info",
} as const;

/**
 * The {@link GIFT_FLOW_LABEL} constant
 * @description The translation key of each tile's short name in the opening's drawing
 */
export const GIFT_FLOW_LABEL = {
  [GIFT_USE.EMERGENCY]: "donatePage.emergencyTitle",
  [GIFT_USE.RIGHTS]: "donatePage.flowRights",
  [GIFT_USE.LEARNING]: "donatePage.learningTitle",
  [GIFT_USE.BRIDGE]: "donatePage.flowBridge",
} as const;

/**
 * The {@link DONATE_PHOTO_SIZES} constant
 * @description The joined hands' sizes, shared by the three drawings so the page fetches one photo; the breakpoints repeat --breakpoint-desktop and --breakpoint-tablet
 */
export const DONATE_PHOTO_SIZES = "(min-width: 1180px) 200px, (min-width: 700px) 170px, 39vw";

/**
 * The {@link DONATE_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the Donate boards: the joined hands in their ring, with stitched threads flowing down to what gifts pay for
 */
export const DONATE_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 368, cropX: 0, cropY: 0 },
    dots: { centreX: 220, centreY: 190, radius: 260, step: 28 },
    ring: { centreX: 298, centreY: 168, radius: 111, count: 18, size: 18 },
    photo: { centreX: 298, centreY: 168, size: 150 },
    threads: {
      paths: ["M228 128 Q176 166 88 104", "M234 168 Q195 221 126 214", "M240 208 Q247 264 230 300"],
      stitch: { width: 1.6, dash: "6 6" },
    },
    tiles: [
      { use: GIFT_USE.EMERGENCY, tint: TILE_COLOUR.BRICK, x: 24, y: 74, width: 60, height: 60 },
      { use: GIFT_USE.RIGHTS, tint: TILE_COLOUR.GOLD, x: 62, y: 184, width: 60, height: 60 },
      { use: GIFT_USE.BRIDGE, tint: TILE_COLOUR.NAVY, x: 166, y: 270, width: 60, height: 60 },
    ],
    hasLabels: false,
    chips: [],
    sparkles: [
      { x: 143, y: 85, size: 14, isRinged: true },
      { x: 23, y: 313, size: 14, isRinged: false },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 1300, cropX: 0, cropY: 660 },
    dots: { centreX: 417, centreY: 980, radius: 450, step: 40 },
    ring: { centreX: 417, centreY: 820, radius: 125, count: 22, size: 20 },
    photo: { centreX: 417, centreY: 820, size: 170 },
    threads: {
      paths: [
        "M369 919 C369 987 150 987 150 1042",
        "M400 919 C400 1009 325 1009 325 1082",
        "M434 919 C434 1009 510 1009 510 1082",
        "M465 919 C465 987 685 987 685 1042",
      ],
      stitch: { width: 2, dash: "7 7" },
    },
    tiles: [
      { use: GIFT_USE.EMERGENCY, tint: TILE_COLOUR.BRICK, x: 80, y: 1056, width: 140, height: 128 },
      { use: GIFT_USE.RIGHTS, tint: TILE_COLOUR.GOLD, x: 255, y: 1096, width: 140, height: 128 },
      {
        use: GIFT_USE.LEARNING,
        tint: TILE_COLOUR.FOREST,
        x: 440,
        y: 1096,
        width: 140,
        height: 128,
      },
      { use: GIFT_USE.BRIDGE, tint: TILE_COLOUR.NAVY, x: 615, y: 1056, width: 140, height: 128 },
    ],
    hasLabels: true,
    chips: [],
    sparkles: [
      { x: 249, y: 975, size: 20, isRinged: true },
      { x: 353, y: 997, size: 20, isRinged: true },
      { x: 462, y: 997, size: 20, isRinged: true },
      { x: 565, y: 975, size: 20, isRinged: true },
      { x: 141, y: 811, size: 18, isRinged: true },
      { x: 691, y: 791, size: 18, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 1060, cropX: 560, cropY: 0 },
    dots: { centreX: 1060, centreY: 520, radius: 590, step: 48 },
    ring: { centreX: 1060, centreY: 330, radius: 147, count: 26, size: 22 },
    photo: { centreX: 1060, centreY: 330, size: 200 },
    threads: {
      paths: [
        "M1015 444 C1015 539 810 539 810 616",
        "M1045 444 C1045 566 975 566 975 666",
        "M1075 444 C1075 566 1145 566 1145 666",
        "M1105 444 C1105 539 1310 539 1310 616",
      ],
      stitch: { width: 2, dash: "7 7" },
    },
    tiles: [
      { use: GIFT_USE.EMERGENCY, tint: TILE_COLOUR.BRICK, x: 740, y: 630, width: 140, height: 140 },
      { use: GIFT_USE.RIGHTS, tint: TILE_COLOUR.GOLD, x: 905, y: 680, width: 140, height: 140 },
      {
        use: GIFT_USE.LEARNING,
        tint: TILE_COLOUR.FOREST,
        x: 1075,
        y: 680,
        width: 140,
        height: 140,
      },
      { use: GIFT_USE.BRIDGE, tint: TILE_COLOUR.NAVY, x: 1240, y: 630, width: 140, height: 140 },
    ],
    hasLabels: true,
    chips: [
      { value: VALUE.SOLIDARITY, x: 800, y: 340 },
      { value: VALUE.DIGNITY, x: 1300, y: 470 },
    ],
    sparkles: [
      { x: 902, y: 526, size: 20, isRinged: true },
      { x: 1000, y: 553, size: 20, isRinged: true },
      { x: 1100, y: 553, size: 20, isRinged: true },
      { x: 1198, y: 526, size: 20, isRinged: true },
      { x: 800, y: 196, size: 22, isRinged: true },
      { x: 1351, y: 291, size: 18, isRinged: false },
      { x: 1051, y: 891, size: 18, isRinged: false },
    ],
  },
} as const satisfies Record<string, DonateDrawingLayout>;
