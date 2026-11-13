/**
 * The {@link WEAVE} constant
 * @description The woven grid in SVG units: a cell, the thread drawn in it, and the gap above the thread
 */
export const WEAVE = {
  CELL: 3,
  THREAD: 2.1,
  GAP: 0.45,
} as const;

/**
 * The {@link LOZENGE} constant
 * @description The woven lozenges: a member piece is 9 cells across, the nested figure 73
 */
export const LOZENGE = {
  PIECE_RADIUS: 4,
  PIECE_RING_FROM: 3,
  PIECE_EYE_TO: 1,
  NESTED_RADIUS: 36,
  NESTED_RING_STEP: 8,
  NESTED_RING_WIDTH: 2,
} as const;

/**
 * The {@link LATTICE} constant
 * @description The members lattice on the error pages: rows, columns and spacing in SVG units
 */
export const LATTICE = {
  ROWS: 5,
  COLUMNS: 7,
  STEP_X: 46,
  STEP_Y: 28.5,
  OFFSET_X: 10,
  OFFSET_Y: 10,
  ODD_ROW_SHIFT: 22,
  WIDTH: 345,
  HEIGHT: 161,
  KNOCK_X: 10,
  KNOCK_Y: 14,
  KNOCK_TURN: 28,
  PIECE_SIZE: 27,
  OUTLINE_TRANSFORM: "translate(13.5 13.5) rotate(45) scale(0.72) translate(-13.5 -13.5)",
} as const;

/**
 * The {@link LATTICE_PIECE} constant
 * @description What happens to the lattice's centre piece: missing (404) or knocked out of line (500)
 */
export const LATTICE_PIECE = {
  MISSING: "missing",
  KNOCKED: "knocked",
} as const;
