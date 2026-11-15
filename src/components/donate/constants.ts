// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";

/**
 * The {@link GIFT_USE} constant
 * @description What gifts are for, from AMIR-GB's own plan
 */
export const GIFT_USE = {
  EMERGENCY: "emergency",
  RIGHTS: "rights",
  LEARNING: "learning",
  BRIDGE: "bridge",
} as const;

/**
 * The {@link GIFT_USES} constant
 * @description The tiles of What your gift does, in order, each with its tint and the keys of its title and line
 */
export const GIFT_USES = [
  {
    use: GIFT_USE.EMERGENCY,
    tint: TILE_COLOUR.BRICK,
    title: "donatePage.emergencyTitle",
    text: "donatePage.emergencyText",
  },
  {
    use: GIFT_USE.RIGHTS,
    tint: TILE_COLOUR.GOLD,
    title: "donatePage.rightsTitle",
    text: "donatePage.rightsText",
  },
  {
    use: GIFT_USE.LEARNING,
    tint: TILE_COLOUR.FOREST,
    title: "donatePage.learningTitle",
    text: "donatePage.learningText",
  },
  {
    use: GIFT_USE.BRIDGE,
    tint: TILE_COLOUR.NAVY,
    title: "donatePage.bridgeTitle",
    text: "donatePage.bridgeText",
  },
] as const;

/**
 * The {@link WAY_CARD_TONE} constant
 * @description The ground of a card's round icon: the sand of the page, or the info tint for the tax card
 */
export const WAY_CARD_TONE = {
  SAND: "sand",
  INFO: "info",
} as const;
