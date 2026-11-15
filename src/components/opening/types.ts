// Types
import type { CHIP_SIZE } from "./constants";

/**
 * The {@link ChipSize} type
 * @description One of the {@link CHIP_SIZE} values
 */
export type ChipSize = (typeof CHIP_SIZE)[keyof typeof CHIP_SIZE];

/**
 * The {@link DotField} type
 * @description The round fading dot field behind a drawing: its centre, radius and grid step, in drawing units
 */
export type DotField = {
  centreX: number;
  centreY: number;
  radius: number;
  step: number;
};

/**
 * The {@link Sparkle} type
 * @description A woven bead placed on its own: its top-left corner and size, and whether it is the ringed gold one
 */
export type Sparkle = {
  x: number;
  y: number;
  size: number;
  isRinged: boolean;
};

/**
 * The {@link Stitch} type
 * @description How a stitched gold thread is sewn: its width and its dash and gap, in drawing units
 */
export type Stitch = {
  width: number;
  dash: string;
};

/**
 * The {@link DrawingFrame} type
 * @description A drawing's size and the part of it a screen shows, in drawing units
 */
export type DrawingFrame = {
  width: number;
  height: number;
  cropX: number;
  cropY: number;
};

/**
 * The {@link Disc} type
 * @description A round centre disc placed by its centre and size, in drawing units
 */
export type Disc = {
  centreX: number;
  centreY: number;
  size: number;
};

/**
 * The {@link Point} type
 * @description A point in drawing units
 */
export type Point = {
  x: number;
  y: number;
};
