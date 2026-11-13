// Dependencies
import { describe, expect, it } from "vitest";
import { getStoryLayout, planStoryWall } from "./helpers";

describe("getStoryLayout", () => {
  it("shows one story with its words, two or three side by side, and four or more as the wall", () => {
    expect(getStoryLayout(1)).toBe("one");
    expect(getStoryLayout(2)).toBe("pair");
    expect(getStoryLayout(3)).toBe("pair");
    expect(getStoryLayout(4)).toBe("wall");
  });
});

describe("planStoryWall", () => {
  it("uses the widest wall each screen size can fill and hides the stories it has no place for", () => {
    const plan = planStoryWall(6);
    expect(plan.grid).toContain("--columns-sm: 2");
    expect(plan.grid).toContain("--columns-md: 3");
    expect(plan.grid).toContain("--columns-lg: 3");
    expect(plan.tiles[4]).toContain("--show-sm: none");
    expect(plan.tiles[4]).toContain("--show-md: block");
  });

  it("fills the four column wall with seven stories", () => {
    expect(planStoryWall(7).grid).toContain("--columns-lg: 4");
  });
});
