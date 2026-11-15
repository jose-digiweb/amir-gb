// Types
import type { RingSpec } from "../../../lib/woven/types";
import type { ValueChip } from "../../../site/types";
import type { ChipSize, Disc, DotField, DrawingFrame, Sparkle, Stitch } from "../../opening/types";

/**
 * The {@link SupportHandsLayout} type
 * @description One screen size's drawing beside the donation widget: the joined hands in their bead ring, a stitched thread into the widget, a value chip on the ring and the dot field under all
 */
export type SupportHandsLayout = {
  frame: DrawingFrame;
  dots: DotField;
  ring: RingSpec;
  photo: Disc;
  thread: { path: string; stitch: Stitch };
  chip: ValueChip;
  chipSize: ChipSize;
  sparkles: Sparkle[];
};

/**
 * The {@link SupportCrownLayout} type
 * @description The phone's drawing over the donation widget: the bead ring rising above the card as an arc, a value chip on it and the dot field, in the widget's own units
 */
export type SupportCrownLayout = {
  frame: DrawingFrame;
  dots: DotField;
  ring: RingSpec;
  chip: ValueChip;
  sparkles: Sparkle[];
};
