// Types
import type { EventType } from "../../../lib/events/types";
import type { RingSpec } from "../../../lib/woven/types";
import type { ValueChip } from "../../../site/types";
import type { Disc, DotField, DrawingFrame, Point, Sparkle, Stitch } from "../../opening/types";
import type { KNOT_SIDE } from "./constants";

/**
 * The {@link KnotSide} type
 * @description One of the {@link KNOT_SIDE} values
 */
export type KnotSide = (typeof KNOT_SIDE)[keyof typeof KNOT_SIDE];

/**
 * The {@link TimelineSlot} type
 * @description A month's point on the timeline and the side its events hang on
 */
export type TimelineSlot = {
  x: number;
  y: number;
  side: KnotSide;
};

/**
 * The {@link KnotStyle} type
 * @description How the events hang from a month: their size, how far from the line, the angle between them and how many at most
 */
export type KnotStyle = {
  size: number;
  reach: number;
  spread: number;
  max: number;
};

/**
 * The {@link ArchiveDrawingLayout} type
 * @description One screen size's opening drawing: the logo with the founding date, the stitched timeline through the recent months and the events hanging from them
 */
export type ArchiveDrawingLayout = {
  frame: DrawingFrame;
  dots: DotField;
  ring: RingSpec;
  disc: Disc;
  founded: Point | null;
  line: { start: Point; tail: Point; stitch: Stitch };
  slots: readonly TimelineSlot[];
  knot: KnotStyle;
  pointBead: number;
  chips: readonly ValueChip[];
  sparkles: readonly Sparkle[];
};

/**
 * The {@link MonthMark} type
 * @description A month on the drawn timeline: its label and where the label sits
 */
export type MonthMark = {
  key: string;
  label: string;
  x: number;
  y: number;
};

/**
 * The {@link EventKnot} type
 * @description One past event hanging from its month: its kind, its centre and the thread to the line
 */
export type EventKnot = {
  key: string;
  type: EventType;
  x: number;
  y: number;
  thread: string;
};

/**
 * The {@link TimelineDrawing} type
 * @description The timeline worked out for one screen size: the line's path, the month marks, the beads on the line and the knots
 */
export type TimelineDrawing = {
  path: string;
  months: MonthMark[];
  beads: Sparkle[];
  knots: EventKnot[];
};
