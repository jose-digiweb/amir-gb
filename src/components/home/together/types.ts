// Types
import type { CLOTH_SIDE } from "./constants";

/**
 * The {@link ClothSide} type
 * @description One of the {@link CLOTH_SIDE} values
 */
export type ClothSide = (typeof CLOTH_SIDE)[keyof typeof CLOTH_SIDE];
