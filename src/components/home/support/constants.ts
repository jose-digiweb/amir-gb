// Dependencies
import { VALUE } from "../../../site/constants";
import { CHIP_SIZE } from "../../opening/constants";

// Types
import type { SupportCrownLayout, SupportHandsLayout } from "./types";

/**
 * The {@link DESKTOP_SUPPORT_HANDS} constant
 * @description The desktop drawing from the V1-Desktop board, in the 1296 wide group's units, cut at the widget's left edge (x 744) and from just under the words down, so it hangs from the widget and follows the words
 */
export const DESKTOP_SUPPORT_HANDS = {
  frame: { width: 744, height: 800, cropX: 140, cropY: 308 },
  dots: { centreX: 700, centreY: 500, radius: 550, step: 48 },
  ring: { centreX: 500, centreY: 560, radius: 226, count: 38, size: 15 },
  photo: { centreX: 500, centreY: 560, size: 380 },
  thread: {
    path: "M606 360 C626 270 660 210 750 210",
    stitch: { width: 2.5, dash: "8 7" },
  },
  chip: { value: VALUE.SOLIDARITY, x: 300, y: 710 },
  chipSize: CHIP_SIZE.REGULAR,
  sparkles: [
    { x: 630, y: 110, size: 20, isRinged: true },
    { x: 1231, y: 711, size: 18, isRinged: false },
    { x: 152, y: 462, size: 16, isRinged: false },
  ],
} as const satisfies SupportHandsLayout;

/**
 * The {@link TABLET_SUPPORT_HANDS} constant
 * @description The tablet drawing from the V1-Tablet board, in the 786 wide card's units, cut to the words column and the gap up to the widget (x 40 to 386), from just under the words down
 */
export const TABLET_SUPPORT_HANDS = {
  frame: { width: 386, height: 690, cropX: 40, cropY: 294 },
  dots: { centreX: 420, centreY: 420, radius: 460, step: 40 },
  ring: { centreX: 214, centreY: 504, radius: 163, count: 28, size: 14 },
  photo: { centreX: 214, centreY: 504, size: 262 },
  thread: {
    path: "M342 404 C362 344 342 310 392 300",
    stitch: { width: 2.5, dash: "8 7" },
  },
  chip: { value: VALUE.SOLIDARITY, x: 130, y: 654 },
  chipSize: CHIP_SIZE.SMALL,
  sparkles: [
    { x: 371, y: 31, size: 18, isRinged: true },
    { x: 722, y: 632, size: 16, isRinged: false },
  ],
} as const satisfies SupportHandsLayout;

/**
 * The {@link PHONE_SUPPORT_CROWN} constant
 * @description The phone drawing from the Main board, in the widget's units (its top-left corner is 0 0), so the ring always crowns the card however long the words above it run; the chip and the bead sit lower than on the board, clear of the words
 */
export const PHONE_SUPPORT_CROWN = {
  frame: { width: 334, height: 250, cropX: 0, cropY: -130 },
  dots: { centreX: 167, centreY: 132, radius: 280, step: 28 },
  ring: { centreX: 167, centreY: 92, radius: 156, count: 26, size: 14 },
  chip: { value: VALUE.SOLIDARITY, x: 81, y: -38 },
  sparkles: [{ x: 316, y: -34, size: 16, isRinged: true }],
} as const satisfies SupportCrownLayout;

/**
 * The {@link SUPPORT_PHOTO} constant
 * @description The joined hands' widths and sizes, shared by the tablet and desktop drawings so the page fetches one photo; the breakpoint repeats --breakpoint-desktop
 */
export const SUPPORT_PHOTO = {
  WIDTHS: [270, 400, 540, 600],
  SIZES: "(min-width: 1180px) 380px, 262px",
} as const;
