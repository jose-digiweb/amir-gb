// Types
import type { TileColour } from "../../lib/content/types";
import type { RingSpec } from "../../lib/woven/types";
import type { ValueChip } from "../../site/types";
import type { Disc, DotField, DrawingFrame, Sparkle, Stitch } from "../opening/types";
import type { NOTICE } from "./constants";

/**
 * The {@link Notice} type
 * @description One of the {@link NOTICE} values
 */
export type Notice = (typeof NOTICE)[keyof typeof NOTICE];

/**
 * The {@link NoticeCard} type
 * @description One kind of post as a tilted tinted card hanging from the line: its tint, its top-left corner, its size and its tilt in degrees
 */
export type NoticeCard = {
  notice: Notice;
  tint: TileColour;
  x: number;
  y: number;
  width: number;
  height: number;
  turn: number;
};

/**
 * The {@link NewsDrawingLayout} type
 * @description One screen size's opening drawing: the logo holding one end of a stitched line, the cards hanging from it and their pins
 */
export type NewsDrawingLayout = {
  frame: DrawingFrame;
  dots: DotField;
  line: { path: string; stitch: Stitch };
  ring: RingSpec;
  disc: Disc;
  cards: readonly NoticeCard[];
  hasLabels: boolean;
  pins: readonly Sparkle[];
  chips: readonly ValueChip[];
  sparkles: readonly Sparkle[];
};
