// Dependencies
import { FORM_TRAP_FIELD } from "../forms/constants";

/**
 * The {@link CONTACT_FIELD} constant
 * @description The names of the message form's fields, as the form posts them; `website` is a trap field people never see
 */
export const CONTACT_FIELD = {
  NAME: "name",
  REACH: "reach",
  LANGUAGE: "language",
  TOPIC: "topic",
  MESSAGE: "message",
  CONSENT: "consent",
  TRAP: FORM_TRAP_FIELD,
} as const;

/**
 * The {@link CONTACT_TOPIC} constant
 * @description What a message can be about
 */
export const CONTACT_TOPIC = {
  HELP: "help",
  MEMBERSHIP: "membership",
  VOLUNTEERING: "volunteering",
  PARTNERSHIP: "partnership",
  OTHER: "other",
} as const;

/**
 * The {@link CONTACT_TOPICS} constant
 * @description The topics in the order the form shows them
 */
export const CONTACT_TOPICS = [
  CONTACT_TOPIC.HELP,
  CONTACT_TOPIC.MEMBERSHIP,
  CONTACT_TOPIC.VOLUNTEERING,
  CONTACT_TOPIC.PARTNERSHIP,
  CONTACT_TOPIC.OTHER,
] as const;

/**
 * The {@link CONTACT_ERROR} constant
 * @description What can be wrong with a message before it is sent, one per field
 */
export const CONTACT_ERROR = {
  NAME_MISSING: "name-missing",
  REACH_MISSING: "reach-missing",
  EMAIL_INCOMPLETE: "email-incomplete",
  REACH_INVALID: "reach-invalid",
  MESSAGE_MISSING: "message-missing",
  CONSENT_MISSING: "consent-missing",
} as const;

/**
 * The {@link CONTACT_LIMIT} constant
 * @description The longest name, address and message the form takes, and the fewest digits a phone number has
 */
export const CONTACT_LIMIT = {
  NAME: 100,
  REACH: 120,
  MESSAGE: 4000,
  PHONE_DIGITS: 8,
} as const;

/**
 * The {@link REACH_PATTERN} constant
 * @description How the form tells an email address from a phone number and checks a phone number
 */
export const REACH_PATTERN = {
  AT: "@",
  PHONE: /^[+\d\s().-]+$/,
  DIGIT: /\d/g,
} as const;

/**
 * The {@link OPENING_HOURS} constant
 * @description When AMIR-GB answers, by weekday (0 is Sunday), in the Netherlands' time
 */
export const OPENING_HOURS = [
  { days: [1, 2, 3, 4, 5], opens: "08:00", closes: "20:00" },
  { days: [0, 6], opens: "10:00", closes: "16:00" },
] as const;

/**
 * The {@link OPENING_TIME_ZONE} constant
 * @description The time zone the opening hours are in
 */
export const OPENING_TIME_ZONE = "Europe/Amsterdam";

/**
 * The {@link OPENING_STATUS} constant
 * @description The data attributes the opening hours card fills in once the page knows the time
 */
export const OPENING_STATUS = {
  ROOT: "[data-opening-hours]",
  STATUS: "[data-opening-status]",
  ROW: "[data-opening-days]",
  OPEN: "open",
  CLOSED: "closed",
  STATE: "state",
  TODAY: "today",
} as const;

/**
 * The {@link QR_CODE} constant
 * @description The WhatsApp QR code: its error correction and the quiet margin around it, in modules
 */
export const QR_CODE = {
  CORRECTION: "M",
  MARGIN: 2,
} as const;

/**
 * The {@link CONTACT_PLACEHOLDER} constant
 * @description The marks in the contact page's copy that a time, a day, a name, a language or an address replaces
 */
export const CONTACT_PLACEHOLDER = {
  TIME: "{time}",
  DAY: "{day}",
  NAME: "{name}",
  LANGUAGE: "{language}",
  REACH: "{reach}",
} as const;

/**
 * The {@link CONTACT_TOPIC_LABEL} constant
 * @description The translation key of each topic's name
 */
export const CONTACT_TOPIC_LABEL = {
  [CONTACT_TOPIC.HELP]: "contactPage.topic.help",
  [CONTACT_TOPIC.MEMBERSHIP]: "contactPage.topic.membership",
  [CONTACT_TOPIC.VOLUNTEERING]: "contactPage.topic.volunteering",
  [CONTACT_TOPIC.PARTNERSHIP]: "contactPage.topic.partnership",
  [CONTACT_TOPIC.OTHER]: "contactPage.topic.other",
} as const;

/**
 * The {@link CONTACT_CHECKED_FIELDS} constant
 * @description The fields that can keep a message from being sent, in the order the form shows them
 */
export const CONTACT_CHECKED_FIELDS = [
  CONTACT_FIELD.NAME,
  CONTACT_FIELD.REACH,
  CONTACT_FIELD.MESSAGE,
  CONTACT_FIELD.CONSENT,
] as const;
