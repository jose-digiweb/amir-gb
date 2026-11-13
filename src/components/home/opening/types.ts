// Types
import type { TileColour } from "../../../lib/content/types";
import type { HelpService, Value } from "../types";

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
 * The {@link ConstellationPill} type
 * @description A value's pill, placed by its centre, in drawing units
 */
export type ConstellationPill = {
  value: Value;
  x: number;
  y: number;
};

/**
 * The {@link ConstellationLozenge} type
 * @description A small woven lozenge scattered round the constellation
 */
export type ConstellationLozenge = {
  x: number;
  y: number;
  size: number;
  isRinged: boolean;
};

/**
 * The {@link ConstellationLayout} type
 * @description One screen size's woven constellation: the joined hands in a ring of beads, the services and values round it
 */
export type ConstellationLayout = {
  width: number;
  height: number;
  centreX: number;
  centreY: number;
  photoSize: number;
  ring: { radius: number; count: number; size: number };
  threads: { path: string; width: number; dash: string };
  dots: { centreX: number; centreY: number; radius: number; step: number };
  discs: ConstellationDisc[];
  pills: ConstellationPill[];
  lozenges: ConstellationLozenge[];
  hasLabels: boolean;
};
