// Types
import type { EventType } from "../../lib/events/types";
import type { RingSpec } from "../../lib/woven/types";
import type { ValueChip } from "../../site/types";
import type { Disc, DotField, DrawingFrame, Point, Sparkle, Stitch } from "../opening/types";

/**
 * The {@link Orbit} type
 * @description The tilted stitched orbit round the logo: its centre, its two radii and its tilt in degrees
 */
export type Orbit = {
  centreX: number;
  centreY: number;
  radiusX: number;
  radiusY: number;
  turn: number;
};

/**
 * The {@link OrbitBadgeSpot} type
 * @description One next event as a date badge on the orbit, ready to draw
 */
export type OrbitBadgeSpot = {
  key: string;
  x: number;
  y: number;
  day: string;
  month: string;
  type: EventType;
};

/**
 * The {@link EventsDrawingLayout} type
 * @description One screen size's opening drawing: the logo in its ring inside a tilted orbit, with the places the next dates sit in, in date order
 */
export type EventsDrawingLayout = {
  frame: DrawingFrame;
  dots: DotField;
  orbit: Orbit;
  stitch: Stitch;
  ring: RingSpec;
  disc: Disc;
  badge: { width: number; height: number };
  slots: readonly Point[];
  chips: readonly ValueChip[];
  sparkles: readonly Sparkle[];
};
