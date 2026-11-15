// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";
import { HELP_SERVICE } from "../../lib/help/constants";

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
 * The {@link HELP_SERVICE_LABEL} constant
 * @description The translation key of each help service's name
 */
export const HELP_SERVICE_LABEL = {
  [HELP_SERVICE.LETTERS]: "help.letters",
  [HELP_SERVICE.DUTCH]: "help.dutch",
  [HELP_SERVICE.WORK]: "help.work",
  [HELP_SERVICE.KIDS]: "help.kids",
  [HELP_SERVICE.HEALTH]: "help.health",
  [HELP_SERVICE.YOUTH]: "help.youth",
  [HELP_SERVICE.CULTURE]: "help.culture",
} as const;
