// Dependencies
import { CONTACT_ERROR } from "../../lib/contact/constants";

// Types
import type { ContactDrawingLayout } from "./types";

/**
 * The {@link CONTACT_ERROR_LABEL} constant
 * @description The translation key of each error's sentence, shown under its field
 */
export const CONTACT_ERROR_LABEL = {
  [CONTACT_ERROR.NAME_MISSING]: "contactPage.error.name-missing",
  [CONTACT_ERROR.REACH_MISSING]: "contactPage.error.reach-missing",
  [CONTACT_ERROR.EMAIL_INCOMPLETE]: "contactPage.error.email-incomplete",
  [CONTACT_ERROR.REACH_INVALID]: "contactPage.error.reach-invalid",
  [CONTACT_ERROR.MESSAGE_MISSING]: "contactPage.error.message-missing",
  [CONTACT_ERROR.CONSENT_MISSING]: "contactPage.error.consent-missing",
} as const;

/**
 * The {@link CONTACT_SUMMARY_TITLE} constant
 * @description The translation keys of the error summary's title, by how many things there are to check
 */
export const CONTACT_SUMMARY_TITLE = [
  "contactPage.summary.1",
  "contactPage.summary.2",
  "contactPage.summary.3",
  "contactPage.summary.4",
] as const;

/**
 * The {@link CONTACT_FORM_STATE} constant
 * @description Where the message form is: being filled in, sending, sent, or not sent
 */
export const CONTACT_FORM_STATE = {
  EDITING: "editing",
  SENDING: "sending",
  SENT: "sent",
  FAILED: "failed",
} as const;

/**
 * The {@link CONTACT_FORM_ID} constant
 * @description The ids the form's parts are found and labelled by
 */
export const CONTACT_FORM_ID = {
  SUMMARY: "contact-summary",
  FAILED: "contact-failed",
  SENT: "contact-sent-title",
  NAME: "contact-name",
  REACH: "contact-reach",
  MESSAGE: "contact-message",
  CONSENT: "contact-consent",
} as const;

/**
 * The {@link MUD_WEAVE} constant
 * @description The weave behind the address card: one 24 by 12 cell of six short threads, in SVG units
 */
export const MUD_WEAVE = {
  WIDTH: 24,
  HEIGHT: 12,
  THREADS: [
    { x: 0, y: 1 },
    { x: 18, y: 1 },
    { x: 3, y: 5 },
    { x: 15, y: 5 },
    { x: 6, y: 9 },
    { x: 12, y: 9 },
  ],
  THREAD_WIDTH: 6,
  THREAD_HEIGHT: 2.2,
} as const;

/**
 * The {@link CONTACT_PLACEHOLDER_LEGAL} constant
 * @description The marks in the legal line that the registration numbers replace
 */
export const CONTACT_PLACEHOLDER_LEGAL = {
  KVK: "{kvk}",
  RSIN: "{rsin}",
} as const;

/**
 * The {@link MESSAGE_ANCHOR} constant
 * @description The id of the message section, which the opening's "Or write a message" link goes down to
 */
export const MESSAGE_ANCHOR = "message";

/**
 * The {@link WELCOME_LANGUAGE} constant
 * @description The languages the opening's bubbles say welcome in, as their language tags
 */
export const WELCOME_LANGUAGE = {
  DUTCH: "nl",
  PORTUGUESE: "pt",
  KRIOL: "pov",
  ENGLISH: "en",
} as const;

/**
 * The {@link WELCOME_COPY} constant
 * @description The translation keys of each bubble's welcome and of its language's name
 */
export const WELCOME_COPY = {
  [WELCOME_LANGUAGE.DUTCH]: {
    GREETING: "contactPage.welcomeDutch",
    LANGUAGE: "contactPage.welcomeDutchName",
  },
  [WELCOME_LANGUAGE.PORTUGUESE]: {
    GREETING: "contactPage.welcomePortuguese",
    LANGUAGE: "contactPage.welcomePortugueseName",
  },
  [WELCOME_LANGUAGE.KRIOL]: {
    GREETING: "contactPage.welcomeKriol",
    LANGUAGE: "contactPage.welcomeKriolName",
  },
  [WELCOME_LANGUAGE.ENGLISH]: {
    GREETING: "contactPage.welcomeEnglish",
    LANGUAGE: "contactPage.welcomeEnglishName",
  },
} as const;

/**
 * The {@link BUBBLE_TAIL} constant
 * @description The corner of a welcome bubble nearest the centre, drawn as its tail
 */
export const BUBBLE_TAIL = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  BOTTOM_RIGHT: "bottom-right",
  BOTTOM_LEFT: "bottom-left",
} as const;

/**
 * The {@link BUBBLE_BOX} constant
 * @description The box a welcome bubble is centred in, wide enough for the longest welcome
 */
export const BUBBLE_BOX = {
  WIDTH: 240,
  HEIGHT: 120,
} as const;

/**
 * The {@link CONTACT_DRAWINGS} constant
 * @description The opening's drawing per screen size, from the Contact boards: the logo in its ring of beads and the welcome bubbles joined to it
 */
export const CONTACT_DRAWINGS = {
  PHONE: {
    frame: { width: 390, height: 360, cropX: 0, cropY: 0 },
    dots: { centreX: 220, centreY: 190, radius: 260, step: 28 },
    ring: { centreX: 300, centreY: 190, radius: 111, count: 18, size: 18 },
    gaps: [12, 13, 14, 15],
    disc: { centreX: 300, centreY: 190, size: 150 },
    threads: {
      paths: ["M128 132 Q190 130 214 160", "M118 262 Q180 270 214 232"],
      stitch: { width: 1.5, dash: "6 6" },
    },
    bubbles: [
      { language: WELCOME_LANGUAGE.KRIOL, x: 92, y: 116, tail: BUBBLE_TAIL.BOTTOM_RIGHT },
      { language: WELCOME_LANGUAGE.PORTUGUESE, x: 84, y: 268, tail: BUBBLE_TAIL.TOP_RIGHT },
    ],
    sparkles: [
      { x: 22, y: 102, size: 16, isRinged: true },
      { x: 25, y: 313, size: 14, isRinged: false },
      { x: 193, y: 323, size: 14, isRinged: true },
    ],
  },
  TABLET: {
    frame: { width: 834, height: 1000, cropX: 0, cropY: 400 },
    dots: { centreX: 580, centreY: 640, radius: 450, step: 40 },
    ring: { centreX: 580, centreY: 640, radius: 133, count: 22, size: 22 },
    gaps: [],
    disc: { centreX: 580, centreY: 640, size: 180 },
    threads: {
      paths: [
        "M385 545 Q482 568 473 588",
        "M680 440 Q630 516 635 530",
        "M690 815 Q635 752 640 736",
        "M410 795 Q495 742 486 725",
      ],
      stitch: { width: 1.75, dash: "6 6" },
    },
    bubbles: [
      { language: WELCOME_LANGUAGE.DUTCH, x: 330, y: 520, tail: BUBBLE_TAIL.BOTTOM_RIGHT },
      { language: WELCOME_LANGUAGE.PORTUGUESE, x: 720, y: 410, tail: BUBBLE_TAIL.BOTTOM_LEFT },
      { language: WELCOME_LANGUAGE.KRIOL, x: 735, y: 845, tail: BUBBLE_TAIL.TOP_LEFT },
      { language: WELCOME_LANGUAGE.ENGLISH, x: 360, y: 820, tail: BUBBLE_TAIL.TOP_RIGHT },
    ],
    sparkles: [
      { x: 790, y: 320, size: 20, isRinged: false },
      { x: 131, y: 681, size: 18, isRinged: true },
      { x: 551, y: 951, size: 18, isRinged: false },
    ],
  },
  DESKTOP: {
    frame: { width: 1440, height: 860, cropX: 560, cropY: 0 },
    dots: { centreX: 1050, centreY: 450, radius: 590, step: 48 },
    ring: { centreX: 1050, centreY: 450, radius: 147, count: 26, size: 22 },
    gaps: [],
    disc: { centreX: 1050, centreY: 450, size: 200 },
    threads: {
      paths: [
        "M870 270 Q990 330 956 356",
        "M1240 255 Q1115 322 1149 349",
        "M1250 625 Q1120 568 1154 541",
        "M865 620 Q988 565 954 538",
      ],
      stitch: { width: 1.75, dash: "6 6" },
    },
    bubbles: [
      { language: WELCOME_LANGUAGE.DUTCH, x: 805, y: 235, tail: BUBBLE_TAIL.BOTTOM_RIGHT },
      { language: WELCOME_LANGUAGE.PORTUGUESE, x: 1300, y: 215, tail: BUBBLE_TAIL.BOTTOM_LEFT },
      { language: WELCOME_LANGUAGE.KRIOL, x: 1315, y: 660, tail: BUBBLE_TAIL.TOP_LEFT },
      { language: WELCOME_LANGUAGE.ENGLISH, x: 800, y: 655, tail: BUBBLE_TAIL.TOP_RIGHT },
    ],
    sparkles: [
      { x: 689, y: 419, size: 22, isRinged: false },
      { x: 1169, y: 109, size: 22, isRinged: true },
      { x: 1411, y: 441, size: 18, isRinged: false },
      { x: 991, y: 771, size: 18, isRinged: true },
    ],
  },
} as const satisfies Record<string, ContactDrawingLayout>;
