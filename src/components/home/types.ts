// Types
import type { VALUE } from "./constants";

/**
 * The {@link Value} type
 * @description One of the {@link VALUE} values
 */
export type Value = (typeof VALUE)[keyof typeof VALUE];
