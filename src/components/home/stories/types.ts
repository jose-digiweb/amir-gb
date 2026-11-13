// Types
import type { STORY_LAYOUT, STORY_WALL } from "./constants";

/**
 * The {@link StoryWallPattern} type
 * @description One of the {@link STORY_WALL} patterns
 */
export type StoryWallPattern = (typeof STORY_WALL)[keyof typeof STORY_WALL];

/**
 * The {@link StoryLayout} type
 * @description One of the {@link STORY_LAYOUT} values
 */
export type StoryLayout = (typeof STORY_LAYOUT)[keyof typeof STORY_LAYOUT];

/**
 * The {@link StoryWallPlan} type
 * @description The photo wall's grid for each screen size, and each tile's place in it, as custom properties
 */
export type StoryWallPlan = {
  grid: string;
  tiles: string[];
};
