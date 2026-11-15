// Dependencies
import { BEAD, LATTICE, LATTICE_PIECE, LOZENGE, WEAVE } from "./constants";

// Types
import type { BeadRing, LatticeLayout, LatticePiece, PlacedPiece, RingSpec } from "./types";

/**
 * The {@link getWovenPath} helper
 * @description Draws the cells of a woven diamond as threads, keeping the cells a test accepts
 * @param {number} radius - Cells from the centre to the tip
 * @param {(distance: number, row: number, column: number) => boolean} isFilled - Whether a cell is woven, from its distance to the centre and its row and column counted from the centre
 * @returns {string} An SVG path of one thread per woven cell
 */
export function getWovenPath(
  radius: number,
  isFilled: (distance: number, row: number, column: number) => boolean,
): string {
  const size = radius * 2 + 1;
  const threads: string[] = [];

  // Walk every cell of the square around the diamond
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      // A cell is woven when it lies inside the diamond and the test accepts its distance
      const distance = Math.abs(row - radius) + Math.abs(column - radius);
      if (distance <= radius && isFilled(distance, row - radius, column - radius)) {
        const x = column * WEAVE.CELL;
        const y = row * WEAVE.CELL + WEAVE.GAP;
        threads.push(`M${x} ${y}h${WEAVE.CELL}v${WEAVE.THREAD}h-${WEAVE.CELL}z`);
      }
    }
  }

  // One path holds every thread
  return threads.join("");
}

/**
 * The {@link getNestedLozengePath} helper
 * @description The pano di pinti's nested lozenge: woven rings every eight cells, two cells wide
 * @returns {string} The SVG path of the figure, in a square of 73 cells
 */
export function getNestedLozengePath(): string {
  return getWovenPath(
    LOZENGE.NESTED_RADIUS,
    (distance) =>
      (LOZENGE.NESTED_RADIUS - distance) % LOZENGE.NESTED_RING_STEP < LOZENGE.NESTED_RING_WIDTH,
  );
}

/**
 * The {@link getLatticeLayout} helper
 * @description Places the members lattice: alternating solid and ringed pieces, the centre one changed
 * @param {LatticePiece} centrePiece - What happens to the centre piece
 * @returns {LatticeLayout} Every piece with its transform, split by kind
 */
export function getLatticeLayout(centrePiece: LatticePiece): LatticeLayout {
  const centreRow = Math.floor(LATTICE.ROWS / 2);
  const centreColumn = Math.floor(LATTICE.COLUMNS / 2);
  const solid: PlacedPiece[] = [];
  const ringed: PlacedPiece[] = [];
  let centre: PlacedPiece = { key: "centre", transform: "" };

  // Place each piece on its row, odd rows shifted half a step
  for (let row = 0; row < LATTICE.ROWS; row += 1) {
    for (let column = 0; column < LATTICE.COLUMNS; column += 1) {
      const shift = row % 2 === 1 ? LATTICE.ODD_ROW_SHIFT : 0;
      const x = LATTICE.OFFSET_X + shift + column * LATTICE.STEP_X;
      const y = LATTICE.OFFSET_Y + row * LATTICE.STEP_Y;
      const key = `${row}-${column}`;

      // The centre piece takes the error's place
      if (row === centreRow && column === centreColumn) {
        centre = { key, transform: getCentreTransform(centrePiece, x, y) };
        continue;
      }

      // The rest alternate between solid and ringed
      if ((row + column) % 2 === 0) {
        solid.push({ key, transform: `translate(${x} ${y})` });
      } else {
        ringed.push({ key, transform: `translate(${x} ${y})` });
      }
    }
  }

  // The layout, ready to render
  return { solid, ringed, centre };
}

/**
 * The {@link getCentreTransform} helper
 * @description Where the centre piece sits: in its place, or knocked out of line
 * @param {LatticePiece} centrePiece - What happens to the centre piece
 * @param {number} x - The piece's left edge
 * @param {number} y - The piece's top edge
 * @returns {string} The SVG transform for the centre piece
 */
function getCentreTransform(centrePiece: LatticePiece, x: number, y: number): string {
  const half = LATTICE.PIECE_SIZE / 2;

  // A missing piece leaves its outline in place
  if (centrePiece === LATTICE_PIECE.MISSING) {
    return `translate(${x} ${y})`;
  }

  // A knocked piece is moved and turned about its own centre
  return `translate(${x + LATTICE.KNOCK_X} ${y + LATTICE.KNOCK_Y}) rotate(${LATTICE.KNOCK_TURN} ${half} ${half})`;
}

/**
 * The {@link getBeadRing} helper
 * @description Strings beads round a circle, solid and ringed in turn, the first one at the top, leaving out the places asked for
 * @param {RingSpec} ring - The ring's centre, radius, bead count and bead size
 * @param {readonly number[]} [gaps] - The places, counted from the top, that stay empty
 * @returns {BeadRing} Every bead with its transform, split by kind
 */
export function getBeadRing(ring: RingSpec, gaps: readonly number[] = []): BeadRing {
  const step = 360 / ring.count;
  const places = Array.from({ length: ring.count }, (_, index) => index);

  // The beads at every place that is not a gap
  return placeBeads(
    ring,
    places.filter((index) => !gaps.includes(index)),
    (index) => BEAD.START_TURN + step * index,
  );
}

/**
 * The {@link getBeadArc} helper
 * @description Strings beads over the top half of a circle, from the left end to the right, solid and ringed in turn
 * @param {RingSpec} arc - The arc's centre, radius, bead count and bead size
 * @returns {BeadRing} Every bead with its transform, split by kind
 */
export function getBeadArc(arc: RingSpec): BeadRing {
  const step = BEAD.ARC_TURN / (arc.count - 1);
  const places = Array.from({ length: arc.count }, (_, index) => index);

  // The beads from the left end of the arc over the top to the right end
  return placeBeads(arc, places, (index) => BEAD.ARC_START_TURN + step * index);
}

/**
 * The {@link placeBeads} helper
 * @description Places beads on a circle at the given places, even places solid and odd ones ringed
 * @param {RingSpec} ring - The circle's centre and radius, and the bead size
 * @param {number[]} places - The places to fill, counted along the string
 * @param {(index: number) => number} getTurn - The angle in degrees of a place
 * @returns {BeadRing} Every bead with its transform, split by kind
 */
function placeBeads(
  ring: RingSpec,
  places: number[],
  getTurn: (index: number) => number,
): BeadRing {
  const solid: PlacedPiece[] = [];
  const ringed: PlacedPiece[] = [];
  const scale = ring.size / BEAD.UNITS;
  const half = ring.size / 2;

  // Place each bead at its angle round the circle
  for (const index of places) {
    const angle = (getTurn(index) * Math.PI) / 180;
    const x = round(ring.centreX + ring.radius * Math.cos(angle) - half);
    const y = round(ring.centreY + ring.radius * Math.sin(angle) - half);
    const bead = { key: `${index}`, transform: `translate(${x} ${y}) scale(${round(scale)})` };

    // Even beads are solid, odd ones ringed
    if (index % 2 === 0) {
      solid.push(bead);
    } else {
      ringed.push(bead);
    }
  }

  // The beads, ready to render
  return { solid, ringed };
}

/**
 * The {@link round} helper
 * @description Rounds a coordinate to two decimals, so SVG attributes stay short
 * @param {number} value - The coordinate
 * @returns {number} The rounded coordinate
 */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}
