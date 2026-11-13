// Dependencies
import { STORY_CSS, STORY_LAYOUT, STORY_WALL } from "./constants";

// Types
import type { StoryLayout, StoryWallPattern, StoryWallPlan } from "./types";

/**
 * The {@link getStoryLayout} helper
 * @description Picks how Life at AMIR shows its stories, so a few never look like a broken wall
 * @param {number} count - How many stories there are
 * @returns {StoryLayout} One story with its words, a pair, or the wall
 */
export function getStoryLayout(count: number): StoryLayout {
  // One story gets its words beside the photo
  if (count === 1) {
    return STORY_LAYOUT.ONE;
  }

  // Up to three stories sit side by side
  if (count < STORY_WALL.TWO.areas.length) {
    return STORY_LAYOUT.PAIR;
  }

  // Four or more make the wall
  return STORY_LAYOUT.WALL;
}

/**
 * The {@link pickPattern} helper
 * @description The widest wall a number of stories can fill, among the ones a screen size allows
 * @param {number} count - How many stories there are
 * @param {StoryWallPattern[]} allowed - The walls the screen size allows, widest first
 * @returns {StoryWallPattern} The widest wall the stories fill completely
 */
function pickPattern(count: number, allowed: StoryWallPattern[]): StoryWallPattern {
  return allowed.find((pattern) => count >= pattern.areas.length) ?? STORY_WALL.TWO;
}

/**
 * The {@link planStoryWall} helper
 * @description Places the stories on the photo wall for phone, tablet and desktop, hiding the ones a wall has no place for
 * @param {number} count - How many stories there are
 * @returns {StoryWallPlan} The grid's and each tile's custom properties
 */
export function planStoryWall(count: number): StoryWallPlan {
  const patterns = [
    pickPattern(count, [STORY_WALL.TWO]),
    pickPattern(count, [STORY_WALL.THREE, STORY_WALL.TWO]),
    pickPattern(count, [STORY_WALL.FOUR, STORY_WALL.THREE, STORY_WALL.TWO]),
  ];

  // The grid's columns, rows and proportions for each screen size
  const grid = patterns
    .map(
      (pattern, index) =>
        `--columns-${STORY_CSS.SIZES[index]}: ${pattern.columns}; --rows-${STORY_CSS.SIZES[index]}: ${pattern.rows}; --ratio-${STORY_CSS.SIZES[index]}: ${pattern.ratio}`,
    )
    .join("; ");

  // Each tile's place for each screen size, or hidden where the wall has none for it
  const tiles = Array.from({ length: count }, (_, tile) =>
    patterns
      .map((pattern, index) => {
        const area = pattern.areas[tile];
        const size = STORY_CSS.SIZES[index];
        return `--area-${size}: ${area ?? "auto"}; --show-${size}: ${area ? STORY_CSS.SHOWN : STORY_CSS.HIDDEN}`;
      })
      .join("; "),
  );

  // The wall, ready to render
  return { grid, tiles };
}
