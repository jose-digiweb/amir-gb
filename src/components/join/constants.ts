// Dependencies
import { LANGUAGE_TAG } from "../../i18n/constants";
import { TILE_COLOUR } from "../../lib/content/constants";
import { JOIN_ERROR, JOIN_MODE } from "../../lib/join/constants";
import { CHIP_SIZE } from "../opening/constants";

// Types
import type { JoinCheckedField } from "../../lib/join/types";
import type { JoinDrawingLayout } from "./types";

/**
 * The {@link JOIN_FORM_STATE} constant
 * @description Where the sign-up form is: being filled in, sending, sent, or not sent
 */
export const JOIN_FORM_STATE = {
  EDITING: "editing",
  SENDING: "sending",
  SENT: "sent",
  FAILED: "failed",
} as const;

/**
 * The {@link JOIN_FORM_ID} constant
 * @description The ids the form's parts are found and labelled by; the two mode ids are also the links that pick a mode
 */
export const JOIN_FORM_ID = {
  SUMMARY: "join-summary",
  FAILED: "join-failed",
  SENT: "join-sent-title",
  MEMBER: "join-as-member",
  VOLUNTEER: "join-as-volunteer",
  NAME: "join-name",
  EMAIL: "join-email",
  PHONE: "join-phone",
  PLACE: "join-place",
  SKILLS: "join-skills",
  MESSAGE: "join-message",
  CONSENT: "join-consent",
} as const;

/**
 * The {@link JOIN_FORM_HASH} constant
 * @description Where a post without JavaScript lands on the page: the sign-up section
 */
export const JOIN_FORM_HASH = "#sign-up";

/**
 * The {@link JOIN_START_FOCUS} constant
 * @description What takes focus when the sign-up form comes back from a post without JavaScript
 */
export const JOIN_START_FOCUS = {
  [JOIN_FORM_STATE.EDITING]: JOIN_FORM_ID.SUMMARY,
  [JOIN_FORM_STATE.SENDING]: JOIN_FORM_ID.SUMMARY,
  [JOIN_FORM_STATE.SENT]: JOIN_FORM_ID.SENT,
  [JOIN_FORM_STATE.FAILED]: JOIN_FORM_ID.FAILED,
} as const;

/**
 * The {@link JOIN_FIELD_ID} constant
 * @description The id of each field the error summary links to
 */
export const JOIN_FIELD_ID = {
  name: JOIN_FORM_ID.NAME,
  email: JOIN_FORM_ID.EMAIL,
  place: JOIN_FORM_ID.PLACE,
  skills: JOIN_FORM_ID.SKILLS,
  consent: JOIN_FORM_ID.CONSENT,
} as const satisfies Record<JoinCheckedField, string>;

/**
 * The {@link JOIN_MODE_ID} constant
 * @description The id of each mode's radio, which a link names to pick that mode
 */
export const JOIN_MODE_ID = {
  [JOIN_MODE.MEMBER]: JOIN_FORM_ID.MEMBER,
  [JOIN_MODE.VOLUNTEER]: JOIN_FORM_ID.VOLUNTEER,
} as const;

/**
 * The {@link WORD_JOINER} constant
 * @description An invisible mark that keeps the line from breaking where it sits, such as after the hyphen in AMIR-GB
 */
export const WORD_JOINER = "\u2060";

/**
 * The {@link HYPHEN} constant
 * @description The hyphen in the association's name
 */
export const HYPHEN = "-";

/**
 * The {@link LINK_SELECTOR} constant
 * @description The element a click on a link lands in, which the mode links are found by
 */
export const LINK_SELECTOR = "a";

/**
 * The {@link HASH_SIGN} constant
 * @description What starts the part of an address that names a place on the page
 */
export const HASH_SIGN = "#";

/**
 * The {@link JOIN_ERROR_LABEL} constant
 * @description The translation key of each error's sentence, shown under its field
 */
export const JOIN_ERROR_LABEL = {
  [JOIN_ERROR.NAME_MISSING]: "joinPage.error.name-missing",
  [JOIN_ERROR.EMAIL_MISSING]: "joinPage.error.email-missing",
  [JOIN_ERROR.EMAIL_INCOMPLETE]: "joinPage.error.email-incomplete",
  [JOIN_ERROR.EMAIL_INVALID]: "joinPage.error.email-invalid",
  [JOIN_ERROR.PLACE_MISSING]: "joinPage.error.place-missing",
  [JOIN_ERROR.SKILLS_MISSING]: "joinPage.error.skills-missing",
  [JOIN_ERROR.CONSENT_MISSING]: "joinPage.error.consent-missing",
} as const;

/**
 * The {@link JOIN_SUMMARY_TITLE} constant
 * @description The translation keys of the error summary's title, by how many things there are to check
 */
export const JOIN_SUMMARY_TITLE = [
  "joinPage.summary.1",
  "joinPage.summary.2",
  "joinPage.summary.3",
  "joinPage.summary.4",
  "joinPage.summary.5",
] as const;

/**
 * The {@link JOIN_WAY} constant
 * @description The four ways to take part
 */
export const JOIN_WAY = {
  MEMBER: "member",
  VOLUNTEER: "volunteer",
  PARTNER: "partner",
  GIVE: "give",
} as const;

/**
 * The {@link MEMBER_CARD_BEADS} constant
 * @description The woven strip along the member card's edge, in a member piece's units: its height, and where each plain and ringed piece starts
 */
export const MEMBER_CARD_BEADS = {
  HEIGHT: 177,
  PLAIN: [0, 60, 120],
  RINGED: [30, 90, 150],
} as const;

/**
 * The {@link WHATSAPP_SHARE} constant
 * @description The WhatsApp link that opens a new message with the text that follows it, for the visitor to send to anyone
 */
export const WHATSAPP_SHARE = "https://wa.me/?text=";

/**
 * The {@link SEAT_TINTS} constant
 * @description The tints round the circle of seats, from the top seat clockwise, repeating
 */
export const SEAT_TINTS = [
  TILE_COLOUR.GOLD,
  TILE_COLOUR.FOREST,
  TILE_COLOUR.BRICK,
  TILE_COLOUR.NAVY,
] as const;

/**
 * The {@link SEAT_CIRCLE} constant
 * @description How many seats the full circle has, and the turn of the first one, at the top
 */
export const SEAT_CIRCLE = {
  COUNT: 12,
  START_TURN: -90,
} as const;

/**
 * The {@link JOIN_PHOTO_SIZES} constant
 * @description The joined hands' sizes, shared by the three drawings so the page fetches one photo; the breakpoints repeat --breakpoint-desktop and --breakpoint-tablet
 */
export const JOIN_PHOTO_SIZES = "(min-width: 1180px) 220px, (min-width: 700px) 190px, 41vw";

/**
 * The {@link JOIN_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the Join in boards: the joined hands in a circle of seats, one of them open for you
 */
export const JOIN_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 372, cropX: 0, cropY: 0 },
    dots: { centreX: 240, centreY: 196, radius: 260, step: 28 },
    photo: { centreX: 300, centreY: 196, size: 160 },
    seats: { radius: 132, size: 50, places: [5, 6, 7, 8, 9, 10], open: 7 },
    inner: null,
    chip: { x: 108, y: 318, size: CHIP_SIZE.SMALL, thread: null },
    sparkles: [
      { x: 22, y: 102, size: 16, isRinged: true },
      { x: 18, y: 344, size: 14, isRinged: false },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 960, cropX: 0, cropY: 380 },
    dots: { centreX: 560, centreY: 660, radius: 450, step: 40 },
    photo: { centreX: 560, centreY: 660, size: 190 },
    seats: { radius: 185, size: 62, places: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], open: 8 },
    inner: "M560 529 A131 131 0 1 1 560 791 A131 131 0 1 1 560 529",
    chip: { x: 300, y: 856, size: CHIP_SIZE.REGULAR, thread: "M392 788 Q388 822 350 842" },
    sparkles: [
      { x: 291, y: 511, size: 18, isRinged: true },
      { x: 791, y: 461, size: 18, isRinged: false },
      { x: 222, y: 852, size: 16, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 860, cropX: 560, cropY: 0 },
    dots: { centreX: 1050, centreY: 450, radius: 590, step: 48 },
    photo: { centreX: 1050, centreY: 450, size: 220 },
    seats: { radius: 215, size: 72, places: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], open: 8 },
    inner: "M1050 297 A153 153 0 1 1 1050 603 A153 153 0 1 1 1050 297",
    chip: { x: 754, y: 678, size: CHIP_SIZE.REGULAR, thread: "M854 598 Q850 638 804 662" },
    sparkles: [
      { x: 709, y: 209, size: 22, isRinged: true },
      { x: 1381, y: 161, size: 18, isRinged: false },
      { x: 1390, y: 710, size: 20, isRinged: true },
    ],
  },
} as const satisfies Record<string, JoinDrawingLayout>;

/**
 * The {@link JOIN_STITCH} constant
 * @description How the opening's threads are sewn: the inner circle and the thread to Your place
 */
export const JOIN_STITCH = { width: 1.75, dash: "6 6" } as const;

/**
 * The {@link JOIN_SENT_OPENER_LANGS} constant
 * @description The language of each welcome over the sign-up's thank you: Dutch, English and Kriolu
 */
export const JOIN_SENT_OPENER_LANGS = [
  LANGUAGE_TAG.DUTCH,
  LANGUAGE_TAG.ENGLISH,
  LANGUAGE_TAG.KRIOL,
] as const;
