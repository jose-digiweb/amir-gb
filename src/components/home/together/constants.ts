// Dependencies
import { WOVEN_DEFS } from "../constants";

/**
 * The {@link CLOTH_SIDE} constant
 * @description The edges of a woven strip where stitches can run
 */
export const CLOTH_SIDE = {
  LEFT: "left",
  RIGHT: "right",
} as const;

/**
 * The {@link MEMBERS_LATTICE} constant
 * @description The members label's lattice: two rows of woven lozenges, the last one open for the next member
 */
export const MEMBERS_LATTICE = {
  VIEW_BOX: "0 0 93.6 33.6",
  PIECE: 21.6,
  PIECES: [
    { x: 0, y: 0, kind: WOVEN_DEFS.SOLID },
    { x: 24, y: 0, kind: WOVEN_DEFS.RINGED },
    { x: 48, y: 0, kind: WOVEN_DEFS.SOLID },
    { x: 72, y: 0, kind: WOVEN_DEFS.SOLID },
    { x: 12, y: 12, kind: WOVEN_DEFS.SOLID },
    { x: 36, y: 12, kind: WOVEN_DEFS.SOLID },
    { x: 60, y: 12, kind: WOVEN_DEFS.OPEN },
  ],
} as const;
