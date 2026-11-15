// Types
import type { HELP_SERVICE } from "./constants";

/**
 * The {@link HelpService} type
 * @description One of the {@link HELP_SERVICE} values
 */
export type HelpService = (typeof HELP_SERVICE)[keyof typeof HELP_SERVICE];
