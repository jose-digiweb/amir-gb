// Dependencies
import { CONTACT_ERROR } from "../../lib/contact/constants";

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
