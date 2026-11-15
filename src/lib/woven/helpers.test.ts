// Dependencies
import { describe, expect, it } from "vitest";
import { LATTICE, LATTICE_PIECE, LOZENGE } from "./constants";
import {
  getBeadArc,
  getBeadRing,
  getLatticeLayout,
  getNestedLozengePath,
  getWovenPath,
} from "./helpers";

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

describe("getBeadRing", () => {
  it("alternates solid and ringed beads, the first one at the top of the ring", () => {
    const ring = getBeadRing({ centreX: 100, centreY: 100, radius: 50, count: 20, size: 27 });
    expect(ring.solid).toHaveLength(10);
    expect(ring.ringed).toHaveLength(10);
    expect(ring.solid[0]?.transform).toBe("translate(86.5 36.5) scale(1)");
  });

  it("leaves the gaps empty and keeps every other bead's kind", () => {
    const ring = getBeadRing(
      { centreX: 100, centreY: 100, radius: 50, count: 20, size: 27 },
      [0, 1],
    );
    expect(ring.solid).toHaveLength(9);
    expect(ring.ringed).toHaveLength(9);
    expect(ring.solid[0]?.key).toBe("2");
  });
});

describe("getBeadArc", () => {
  it("strings beads from the left end over the top to the right end", () => {
    const arc = getBeadArc({ centreX: 100, centreY: 100, radius: 50, count: 5, size: 27 });
    expect(arc.solid).toHaveLength(3);
    expect(arc.ringed).toHaveLength(2);
    expect(arc.solid[0]?.transform).toBe("translate(36.5 86.5) scale(1)");
    expect(arc.solid[1]?.transform).toBe("translate(86.5 36.5) scale(1)");
    expect(arc.solid[2]?.transform).toBe("translate(136.5 86.5) scale(1)");
  });
});
