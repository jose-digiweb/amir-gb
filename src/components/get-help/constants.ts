// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";
import { HELP_SERVICE } from "../../lib/help/constants";
import { BEAD } from "../../lib/woven/constants";

// Types
import type { HelpArea, HowStep } from "./types";

/**
 * The {@link HELP_AREAS} constant
 * @description What AMIR-GB helps with, in the page's order: each area's tint, name and what it offers, from AMIR's fact sheet
 */
export const HELP_AREAS = [
  {
    service: HELP_SERVICE.LETTERS,
    tint: TILE_COLOUR.GOLD,
    title: "help.letters",
    points: [
      "getHelp.lettersOffices",
      "getHelp.lettersLegal",
      "getHelp.lettersMediation",
      "getHelp.lettersGuide",
    ],
  },
  {
    service: HELP_SERVICE.DUTCH,
    tint: TILE_COLOUR.FOREST,
    title: "help.dutch",
    points: ["getHelp.dutchConversation", "getHelp.dutchIntegration", "getHelp.dutchSchools"],
  },
  {
    service: HELP_SERVICE.WORK,
    tint: TILE_COLOUR.BRICK,
    title: "getHelp.work",
    points: ["getHelp.workDesk", "getHelp.workWorkshops", "getHelp.workCourses"],
  },
  {
    service: HELP_SERVICE.KIDS,
    tint: TILE_COLOUR.NAVY,
    title: "help.kids",
    points: ["getHelp.kidsHomework", "getHelp.kidsNoGuine", "getHelp.kidsNoMinines"],
  },
  {
    service: HELP_SERVICE.HEALTH,
    tint: TILE_COLOUR.FOREST,
    title: "help.health",
    points: [
      "getHelp.healthChecks",
      "getHelp.healthMental",
      "getHelp.healthSupport",
      "getHelp.healthCentres",
    ],
  },
  {
    service: HELP_SERVICE.YOUTH,
    tint: TILE_COLOUR.NAVY,
    title: "help.youth",
    points: ["getHelp.youthTeams", "getHelp.youthMentoring"],
  },
  {
    service: HELP_SERVICE.CULTURE,
    tint: TILE_COLOUR.GOLD,
    title: "help.culture",
    points: ["getHelp.cultureParties", "getHelp.cultureSabura", "getHelp.cultureTraditions"],
  },
] as const satisfies readonly HelpArea[];

/**
 * The {@link HOW_STEPS} constant
 * @description The three steps of How it works, in order
 */
export const HOW_STEPS = [
  { number: 1, title: "getHelp.step1Title", text: "getHelp.step1Text" },
  { number: 2, title: "getHelp.step2Title", text: "getHelp.step2Text" },
  { number: 3, title: "getHelp.step3Title", text: "getHelp.step3Text" },
] as const satisfies readonly HowStep[];

/**
 * The {@link GET_HELP_PLACEHOLDER} constant
 * @description The marks in the page's copy that the topic or the phone number replaces
 */
export const GET_HELP_PLACEHOLDER = {
  TOPIC: "{topic}",
  PHONE: "{phone}",
} as const;

/**
 * The {@link ASK_MESSAGE_PARAM} constant
 * @description The WhatsApp link's query parameter that types a message for the visitor
 */
export const ASK_MESSAGE_PARAM = "text";

/**
 * The {@link HELP_AREA_ITEM} constant
 * @description The phone accordion's shared name, so one topic is open at a time, and the attribute naming each row's topic
 */
export const HELP_AREA_ITEM = {
  GROUP: "help-areas",
  ATTRIBUTE: "data-help-area",
  SELECTOR: "details[data-help-area]",
} as const;

/**
 * The {@link STEP_THREAD} constant
 * @description The gold stitched thread between the step numbers: its dash and gap, and its width, in SVG units
 */
export const STEP_THREAD = {
  DASH: "8 8",
  WIDTH: 3,
} as const;

/**
 * The {@link DECOR_BEAD_VIEW_BOX} constant
 * @description The drawing box of one woven bead, as the page's shared bead defs draw it
 */
export const DECOR_BEAD_VIEW_BOX = `0 0 ${BEAD.UNITS} ${BEAD.UNITS}`;

/**
 * The {@link DOT_PATCH} constant
 * @description The faint dot patch behind the opening and the help areas: the dot's radius and the grid step, in SVG units
 */
export const DOT_PATCH = {
  RADIUS: 1.6,
  STEP: 14,
  FADE_FROM: 0.3,
} as const;
