// Dependencies
import { JOIN_ERROR, JOIN_MODE } from "../../lib/join/constants";

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
