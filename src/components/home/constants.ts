// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";

/**
 * The {@link HELP_SERVICE} constant
 * @description The six kinds of help AMIR-GB offers, as the opening and the help tiles show them
 */
export const HELP_SERVICE = {
  LETTERS: "letters",
  DUTCH: "dutch",
  WORK: "work",
  KIDS: "kids",
  HEALTH: "health",
  CULTURE: "culture",
} as const;

/**
 * The {@link HELP_SERVICES} constant
 * @description The help services in the order the tiles show them, each with its tint and the key of its label
 */
export const HELP_SERVICES = [
  { service: HELP_SERVICE.LETTERS, tint: TILE_COLOUR.GOLD, label: "help.letters" },
  { service: HELP_SERVICE.DUTCH, tint: TILE_COLOUR.FOREST, label: "help.dutch" },
  { service: HELP_SERVICE.WORK, tint: TILE_COLOUR.BRICK, label: "help.work" },
  { service: HELP_SERVICE.KIDS, tint: TILE_COLOUR.NAVY, label: "help.kids" },
  { service: HELP_SERVICE.HEALTH, tint: TILE_COLOUR.FOREST, label: "help.health" },
  { service: HELP_SERVICE.CULTURE, tint: TILE_COLOUR.GOLD, label: "help.culture" },
] as const;

/**
 * The {@link VALUE} constant
 * @description AMIR-GB's values, as the motto chips and the opening show them
 */
export const VALUE = {
  SOLIDARITY: "solidarity",
  WELCOME: "welcome",
  UNITY: "unity",
  DIGNITY: "dignity",
} as const;

/**
 * The {@link VALUE_LABEL} constant
 * @description The translation key of each value's name
 */
export const VALUE_LABEL = {
  [VALUE.SOLIDARITY]: "values.solidarity",
  [VALUE.WELCOME]: "values.welcome",
  [VALUE.UNITY]: "values.unity",
  [VALUE.DIGNITY]: "values.dignity",
} as const;

/**
 * The {@link HELP_SERVICE_LABEL} constant
 * @description The translation key of each help service's name
 */
export const HELP_SERVICE_LABEL = {
  [HELP_SERVICE.LETTERS]: "help.letters",
  [HELP_SERVICE.DUTCH]: "help.dutch",
  [HELP_SERVICE.WORK]: "help.work",
  [HELP_SERVICE.KIDS]: "help.kids",
  [HELP_SERVICE.HEALTH]: "help.health",
  [HELP_SERVICE.CULTURE]: "help.culture",
} as const;

/**
 * The {@link WOVEN_DEFS} constant
 * @description The ids of the woven beads every home drawing reuses
 */
export const WOVEN_DEFS = {
  SOLID: "woven-bead-solid",
  RINGED: "woven-bead-ringed",
  OPEN: "woven-bead-open",
} as const;
