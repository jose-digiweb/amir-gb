// Types
import type {
  BUTTON_SIZE,
  BUTTON_TONE,
  ICON_BUTTON_TONE,
  OPENER_TONE,
  WOVEN_SHADE_TONE,
} from "./constants";

/**
 * The {@link OpenerTone} type
 * @description One of the {@link OPENER_TONE} values
 */
export type OpenerTone = (typeof OPENER_TONE)[keyof typeof OPENER_TONE];

/**
 * The {@link ButtonTone} type
 * @description One of the {@link BUTTON_TONE} values
 */
export type ButtonTone = (typeof BUTTON_TONE)[keyof typeof BUTTON_TONE];

/**
 * The {@link ButtonSize} type
 * @description One of the {@link BUTTON_SIZE} values
 */
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

/**
 * The {@link IconButtonTone} type
 * @description One of the {@link ICON_BUTTON_TONE} values
 */
export type IconButtonTone = (typeof ICON_BUTTON_TONE)[keyof typeof ICON_BUTTON_TONE];

/**
 * The {@link WovenShadeTone} type
 * @description One of the {@link WOVEN_SHADE_TONE} values
 */
export type WovenShadeTone = (typeof WOVEN_SHADE_TONE)[keyof typeof WOVEN_SHADE_TONE];
