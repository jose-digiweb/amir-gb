// Dependencies
import { TILE_COLOUR } from "../../lib/content/constants";
import { PENDING_LINK, VALUE } from "../../site/constants";

// Types
import type {
  AboutDocument,
  AboutDrawingLayout,
  Aim,
  BoardMember,
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
 * @description The values in order, each with its tint and the keys of its name, its Kriolu word if it has one, and its sentence
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
 * @description The language tag of Kriolu, Guinea-Bissau Creole, for words written in it
 */
export const KRIOL_LANG = "pov";

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
 * The {@link ABOUT_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the About us boards: the logo under a stitched arc carrying the motto and an arc of woven beads, a woven star on top
 */
export const ABOUT_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 392, cropX: 0, cropY: 0 },
    dots: { centreX: 195, centreY: 228, radius: 260, step: 28 },
    arc: { path: "M30 286 A165 165 0 0 1 360 286", stitch: { width: 2.5, dash: "8 7" } },
    beads: { centreX: 195, centreY: 286, radius: 122, count: 13, size: 16 },
    disc: { centreX: 195, centreY: 286, size: 140 },
    chips: [],
    founded: null,
    sparkles: [
      { x: 179, y: 105, size: 32, isRinged: true },
      { x: 23, y: 113, size: 14, isRinged: true },
      { x: 353, y: 113, size: 14, isRinged: false },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 1080, cropX: 0, cropY: 440 },
    dots: { centreX: 505, centreY: 728, radius: 450, step: 40 },
    arc: { path: "M243 820 A262 262 0 0 1 767 820", stitch: { width: 3, dash: "8 7" } },
    beads: { centreX: 505, centreY: 820, radius: 196, count: 17, size: 22 },
    disc: { centreX: 505, centreY: 820, size: 190 },
    chips: [
      { value: VALUE.SOLIDARITY, x: 290, y: 686 },
      { value: VALUE.WELCOME, x: 413, y: 568 },
      { value: VALUE.UNITY, x: 597, y: 568 },
      { value: VALUE.DIGNITY, x: 715, y: 686 },
    ],
    founded: { x: 505, y: 961 },
    sparkles: [
      { x: 482, y: 536, size: 45, isRinged: true },
      { x: 173, y: 780, size: 20, isRinged: true },
      { x: 828, y: 851, size: 18, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 880, cropX: 560, cropY: 0 },
    dots: { centreX: 1010, centreY: 490, radius: 590, step: 48 },
    arc: { path: "M695 600 A315 315 0 0 1 1325 600", stitch: { width: 3, dash: "8 7" } },
    beads: { centreX: 1010, centreY: 600, radius: 236, count: 17, size: 22 },
    disc: { centreX: 1010, centreY: 600, size: 230 },
    chips: [
      { value: VALUE.SOLIDARITY, x: 712, y: 480 },
      { value: VALUE.WELCOME, x: 869, y: 311 },
      { value: VALUE.UNITY, x: 1151, y: 311 },
      { value: VALUE.DIGNITY, x: 1290, y: 480 },
    ],
    founded: { x: 1010, y: 761 },
    sparkles: [
      { x: 988, y: 262, size: 45, isRinged: true },
      { x: 625, y: 560, size: 20, isRinged: true },
      { x: 1386, y: 631, size: 18, isRinged: false },
    ],
  },
} as const satisfies Record<string, AboutDrawingLayout>;
