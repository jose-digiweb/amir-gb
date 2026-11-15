// Types
import type { RETURN_TONE } from "./constants";

/**
 * The {@link ReturnTone} type
 * @description One of the {@link RETURN_TONE} values
 */
export type ReturnTone = (typeof RETURN_TONE)[keyof typeof RETURN_TONE];
