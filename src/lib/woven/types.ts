// Types
import type { LATTICE_PIECE } from "./constants";

/**
 * The {@link LatticePiece} type
 * @description One of the {@link LATTICE_PIECE} values
 */
export type LatticePiece = (typeof LATTICE_PIECE)[keyof typeof LATTICE_PIECE];

/**
 * The {@link PlacedPiece} type
 * @description A lattice piece and where it sits, as an SVG transform
 */
export type PlacedPiece = {
  key: string;
  transform: string;
};

/**
 * The {@link LatticeLayout} type
 * @description The lattice split by what each piece is, so the template only renders
 */
export type LatticeLayout = {
  solid: PlacedPiece[];
  ringed: PlacedPiece[];
  centre: PlacedPiece;
};

/**
 * The {@link BeadRing} type
 * @description A ring of beads split into the solid and the ringed ones, alternating round the ring
 */
export type BeadRing = {
  solid: PlacedPiece[];
  ringed: PlacedPiece[];
};

/**
 * The {@link RingSpec} type
 * @description Where a ring of beads sits and how it is strung
 */
export type RingSpec = {
  centreX: number;
  centreY: number;
  radius: number;
  count: number;
  size: number;
};
