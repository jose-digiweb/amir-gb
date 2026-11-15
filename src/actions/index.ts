// Dependencies
import { contact } from "./contact";
import { donate } from "./donate";
import { join } from "./join";

/**
 * The {@link server} constant
 * @description The site's Astro Actions, in the one export Astro reads
 */
export const server = { contact, donate, join };
