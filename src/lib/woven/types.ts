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
