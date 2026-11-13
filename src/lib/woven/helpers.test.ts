// Dependencies
import { describe, expect, it } from "vitest";
import { LATTICE, LATTICE_PIECE, LOZENGE } from "./constants";
import { getLatticeLayout, getNestedLozengePath, getWovenPath } from "./helpers";

/**
 * The {@link countThreads} helper
 * @description How many woven cells a path draws
 * @param {string} path - An SVG path from the woven helpers
 * @returns {number} The number of threads in it
 */
function countThreads(path: string): number {
  return path.split("M").length - 1;
}

describe("getWovenPath", () => {
  it("weaves a member piece as the canvas does: 41 cells solid, a 28-cell ring and a 5-cell eye", () => {
    expect(countThreads(getWovenPath(LOZENGE.PIECE_RADIUS, () => true))).toBe(41);
    expect(
      countThreads(
        getWovenPath(LOZENGE.PIECE_RADIUS, (distance) => distance >= LOZENGE.PIECE_RING_FROM),
      ),
    ).toBe(28);
    expect(
      countThreads(
        getWovenPath(LOZENGE.PIECE_RADIUS, (distance) => distance <= LOZENGE.PIECE_EYE_TO),
      ),
    ).toBe(5);
  });

  it("starts the nested lozenge with a single cell at its tip", () => {
    expect(getNestedLozengePath().startsWith("M108 0.45h3v2.1h-3z")).toBe(true);
  });
});

describe("getLatticeLayout", () => {
  it("places every piece of the lattice once, the centre apart", () => {
    const layout = getLatticeLayout(LATTICE_PIECE.MISSING);
    expect(layout.solid.length + layout.ringed.length + 1).toBe(LATTICE.ROWS * LATTICE.COLUMNS);
    expect(layout.solid).toHaveLength(18);
    expect(layout.ringed).toHaveLength(16);
  });

  it("leaves a missing piece in place and turns a knocked one", () => {
    expect(getLatticeLayout(LATTICE_PIECE.MISSING).centre.transform).toBe("translate(148 67)");
    expect(getLatticeLayout(LATTICE_PIECE.KNOCKED).centre.transform).toContain("rotate(28");
  });
});
