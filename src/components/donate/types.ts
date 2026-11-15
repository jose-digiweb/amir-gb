// Types
import type { TileColour } from "../../lib/content/types";
import type { RingSpec } from "../../lib/woven/types";
import type { ValueChip } from "../../site/types";
import type { Disc, DotField, DrawingFrame, Sparkle, Stitch } from "../opening/types";
import type { GIFT_USE, WAY_CARD_TONE } from "./constants";

/**
 * The {@link GiftUse} type
 * @description One of the {@link GIFT_USE} values
 */
export type GiftUse = (typeof GIFT_USE)[keyof typeof GIFT_USE];

/**
 * The {@link WayCardTone} type
 * @description One of the {@link WAY_CARD_TONE} values
 */
export type WayCardTone = (typeof WAY_CARD_TONE)[keyof typeof WAY_CARD_TONE];

/**
 * The {@link GiftFlowTile} type
 * @description One thing gifts pay for as a tinted tile in the opening's drawing: its tint, its top-left corner and its size
 */
export type GiftFlowTile = {
  use: GiftUse;
  tint: TileColour;
  x: number;
  y: number;
  width: number;
  height: number;
};

/**
 * The {@link DonateDrawingLayout} type
 * @description One screen size's opening drawing: the joined hands in their ring, the threads flowing down and the tiles they reach
 */
export type DonateDrawingLayout = {
  frame: DrawingFrame;
  dots: DotField;
  ring: RingSpec;
  photo: Disc;
  threads: { paths: readonly string[]; stitch: Stitch };
  tiles: readonly GiftFlowTile[];
  hasLabels: boolean;
  chips: readonly ValueChip[];
  sparkles: readonly Sparkle[];
};
