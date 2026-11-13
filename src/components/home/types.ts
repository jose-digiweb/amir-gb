// Types
import type { HELP_SERVICE, VALUE } from "./constants";

/**
 * The {@link HelpService} type
 * @description One of the {@link HELP_SERVICE} values
 */
export type HelpService = (typeof HELP_SERVICE)[keyof typeof HELP_SERVICE];

/**
 * The {@link Value} type
 * @description One of the {@link VALUE} values
 */
export type Value = (typeof VALUE)[keyof typeof VALUE];
