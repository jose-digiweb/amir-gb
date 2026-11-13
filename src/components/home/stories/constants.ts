/**
 * The {@link STORY_WALL} constant
 * @description The photo walls from the boards: two, three and four columns of tall and short tiles that all end on one line
 */
export const STORY_WALL = {
  TWO: {
    columns: 2,
    rows: "170fr 60fr 170fr",
    ratio: "358 / 420",
    areas: ["1 / 1 / 3 / 2", "3 / 1 / 4 / 2", "1 / 2 / 2 / 3", "2 / 2 / 4 / 3"],
  },
  THREE: {
    columns: 3,
    rows: "180fr 60fr 40fr 180fr",
    ratio: "754 / 496",
    areas: [
      "1 / 1 / 4 / 2",
      "4 / 1 / 5 / 2",
      "1 / 2 / 2 / 3",
      "2 / 2 / 5 / 3",
      "1 / 3 / 3 / 4",
      "3 / 3 / 5 / 4",
    ],
  },
  FOUR: {
    columns: 4,
    rows: "200fr 36fr 104fr 196fr",
    ratio: "1296 / 608",
    areas: [
      "1 / 1 / 4 / 2",
      "4 / 1 / 5 / 2",
      "1 / 2 / 2 / 3",
      "2 / 2 / 5 / 3",
      "1 / 3 / 5 / 4",
      "1 / 4 / 3 / 5",
      "3 / 4 / 5 / 5",
    ],
  },
} as const;

/**
 * The {@link STORY_LAYOUT} constant
 * @description How Life at AMIR shows its stories: one with its words, a pair, or the photo wall
 */
export const STORY_LAYOUT = {
  ONE: "one",
  PAIR: "pair",
  WALL: "wall",
} as const;

/**
 * The {@link STORY_CSS} constant
 * @description The custom properties the photo wall's grid and tiles read, per screen size
 */
export const STORY_CSS = {
  HIDDEN: "none",
  SHOWN: "block",
  SIZES: ["sm", "md", "lg"],
} as const;
