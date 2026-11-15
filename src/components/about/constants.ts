// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";
import { MILESTONE_PRECISION } from "../../lib/timeline/constants";
import { PENDING_LINK } from "../../site/constants";

// Types
import type {
  AboutDocument,
  Aim,
  BoardMember,
  Milestone,
  MoneyRule,
  PurposeCard,
  ValueTile,
} from "./types";

/**
 * The {@link PURPOSE_CARDS} constant
 * @description The mission and the vision, each with the keys of its label, title and text
 */
export const PURPOSE_CARDS = [
  { opener: "about.missionOpener", title: "about.missionTitle", text: "about.missionText" },
  { opener: "about.visionOpener", title: "about.visionTitle", text: "about.visionText" },
] as const satisfies readonly PurposeCard[];

/**
 * The {@link AIMS} constant
 * @description AMIR-GB's seven aims from its statutes, in order, each with the keys of its name and sentence
 */
export const AIMS = [
  { title: "about.aim1Title", text: "about.aim1Text" },
  { title: "about.aim2Title", text: "about.aim2Text" },
  { title: "about.aim3Title", text: "about.aim3Text" },
  { title: "about.aim4Title", text: "about.aim4Text" },
  { title: "about.aim5Title", text: "about.aim5Text" },
  { title: "about.aim6Title", text: "about.aim6Text" },
  { title: "about.aim7Title", text: "about.aim7Text" },
] as const satisfies readonly Aim[];

/**
 * The {@link AIM_NUMBER_DIGITS} constant
 * @description How many digits an aim's number shows, so 1 reads 01
 */
export const AIM_NUMBER_DIGITS = 2;

/**
 * The {@link ABOUT_VALUE} constant
 * @description The four values the About page explains, each drawn with its own pictogram
 */
export const ABOUT_VALUE = {
  SOLIDARITY: "solidarity",
  LEADERSHIP: "leadership",
  INCLUSION: "inclusion",
  PRIDE: "pride",
} as const;

/**
 * The {@link VALUE_TILES} constant
 * @description The values in order, each with its tint and the keys of its name, its Kriol word if it has one, and its sentence
 */
export const VALUE_TILES = [
  {
    value: ABOUT_VALUE.SOLIDARITY,
    tint: TILE_COLOUR.GOLD,
    kriol: "about.valueSolidarityKriol",
    title: "about.valueSolidarity",
    text: "about.valueSolidarityText",
  },
  {
    value: ABOUT_VALUE.LEADERSHIP,
    tint: TILE_COLOUR.NAVY,
    title: "about.valueLeadership",
    text: "about.valueLeadershipText",
  },
  {
    value: ABOUT_VALUE.INCLUSION,
    tint: TILE_COLOUR.FOREST,
    title: "about.valueInclusion",
    text: "about.valueInclusionText",
  },
  {
    value: ABOUT_VALUE.PRIDE,
    tint: TILE_COLOUR.BRICK,
    title: "about.valuePride",
    text: "about.valuePrideText",
  },
] as const satisfies readonly ValueTile[];

/**
 * The {@link KRIOL_LANG} constant
 * @description The language tag of Guinea-Bissau Kriol (Upper Guinea Creole), for words written in it
 */
export const KRIOL_LANG = "pov";

/**
 * The {@link MILESTONES} constant
 * @description AMIR-GB's first months from its fact sheet, in order: each date, how exactly it is known, and the key of what happened
 */
export const MILESTONES = [
  { date: "2026-07-20", precision: MILESTONE_PRECISION.DAY, text: "about.milestoneFounded" },
  { date: "2026-07-22", precision: MILESTONE_PRECISION.DAY, text: "about.milestoneRegistered" },
  { date: "2026-08-03", precision: MILESTONE_PRECISION.DAY, text: "about.milestoneUnpaid" },
  { date: "2026-11-21", precision: MILESTONE_PRECISION.DAY, text: "about.milestoneMeeting" },
  { date: "2027-03-01", precision: MILESTONE_PRECISION.MONTH, text: "about.milestoneFoundingEnd" },
] as const satisfies readonly Milestone[];

/**
 * The {@link MILESTONE_NOON} constant
 * @description The time of day a milestone's date is read at, so the time zone never moves it to another day
 */
export const MILESTONE_NOON = "T12:00:00Z";

/**
 * The {@link BOARD} constant
 * @description The three board members from AMIR's fact sheet, each with the keys of their role and tasks; a no-break space keeps a long name from leaving one word on a line
 */
export const BOARD = [
  {
    name: "Cesaltina Pereira dos Reis",
    role: "about.rolePresident",
    tasks: "about.tasksPresident",
  },
  { name: "Júlio Gomes dos Santos", role: "about.roleSecretary", tasks: "about.tasksSecretary" },
  { name: "Umaru Seidi", role: "about.roleTreasurer", tasks: "about.tasksTreasurer" },
] as const satisfies readonly BoardMember[];

/**
 * The {@link MONEY_RULE} constant
 * @description The four rules of how AMIR-GB handles money, each drawn with its own pictogram
 */
export const MONEY_RULE = {
  SIGNATURES: "signatures",
  ACCOUNT: "account",
  REPORTS: "reports",
  UNPAID: "unpaid",
} as const;

/**
 * The {@link MONEY_RULES} constant
 * @description The money rules in order, each with the keys of its name and sentence
 */
export const MONEY_RULES = [
  { rule: MONEY_RULE.SIGNATURES, title: "about.ruleSignatures", text: "about.ruleSignaturesText" },
  { rule: MONEY_RULE.ACCOUNT, title: "about.ruleAccount", text: "about.ruleAccountText" },
  { rule: MONEY_RULE.REPORTS, title: "about.ruleReports", text: "about.ruleReportsText" },
  { rule: MONEY_RULE.UNPAID, title: "about.ruleUnpaid", text: "about.ruleUnpaidText" },
] as const satisfies readonly MoneyRule[];

/**
 * The {@link DOCUMENTS} constant
 * @description The documents a visitor can read, each with its title key, its Dutch name and its file; the files are still to come from AMIR
 */
export const DOCUMENTS = [
  { title: "about.docStatutes", dutchName: "statuten", href: PENDING_LINK },
  { title: "about.docPlan", dutchName: "beleidsplan", href: PENDING_LINK },
  { title: "about.docPay", dutchName: "beloningsbeleid", href: PENDING_LINK },
] as const satisfies readonly AboutDocument[];

/**
 * The {@link DOCUMENT_LANG} constant
 * @description The language the documents are written in
 */
export const DOCUMENT_LANG = "nl";

/**
 * The {@link TAX_PLACEHOLDER} constant
 * @description The marks in the tax status sentence that the registration numbers replace
 */
export const TAX_PLACEHOLDER = {
  KVK: "{kvk}",
  RSIN: "{rsin}",
} as const;

/**
 * The {@link TIMELINE_THREAD} constant
 * @description The gold stitched thread between the milestones: its dash and gap, and its width, in SVG units
 */
export const TIMELINE_THREAD = {
  DASH: "8 8",
  WIDTH: 3,
} as const;
