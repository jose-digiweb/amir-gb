// Types
import type { TileColour } from "../../../lib/content/types";
import type { HelpService } from "../../../lib/help/types";
import type { RingSpec } from "../../../lib/woven/types";
import type { ValueChip } from "../../../site/types";
import type { Disc, DotField, DrawingFrame, Sparkle, Stitch } from "../../opening/types";

/**
 * The {@link ConstellationDisc} type
 * @description A help service's disc: its tint and its top-left corner and size, in drawing units
 */
export type ConstellationDisc = {
  service: HelpService;
  tint: TileColour;
  x: number;
  y: number;
  size: number;
};

/**
 * The {@link ConstellationLayout} type
 * @description One screen size's woven constellation: the joined hands in a ring of beads, the services and values round it
 */
export type ConstellationLayout = {
  frame: DrawingFrame;
  ring: RingSpec;
  photo: Disc;
  threads: { paths: readonly string[]; stitch: Stitch };
  dots: DotField;
  discs: ConstellationDisc[];
  pills: ValueChip[];
  lozenges: Sparkle[];
  hasLabels: boolean;
};
