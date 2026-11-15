// Dependencies
import { FORM_TRAP_FIELD } from "../forms/constants";

/**
 * The {@link JOIN_FIELD} constant
 * @description The names of the sign-up form's fields, as the form posts them; `website` is a trap field people never see
 */
export const JOIN_FIELD = {
  MODE: "mode",
  NAME: "name",
  EMAIL: "email",
  PHONE: "phone",
  PLACE: "place",
  LANGUAGE: "language",
  SKILLS: "skills",
  MESSAGE: "message",
  CONSENT: "consent",
  TRAP: FORM_TRAP_FIELD,
} as const;

/**
 * The {@link JOIN_MODE} constant
 * @description What a sign-up is for: becoming a member or volunteering
 */
export const JOIN_MODE = {
  MEMBER: "member",
  VOLUNTEER: "volunteer",
} as const;

/**
 * The {@link JOIN_MODES} constant
 * @description The sign-up modes in the order the form shows them
 */
export const JOIN_MODES = [JOIN_MODE.MEMBER, JOIN_MODE.VOLUNTEER] as const;

/**
 * The {@link JOIN_SKILL} constant
 * @description What a volunteer can help with
 */
export const JOIN_SKILL = {
  TEACHING: "teaching",
  HEALTH: "health",
  LAW: "law",
  TRANSLATION: "translation",
  LOGISTICS: "logistics",
  EVENTS: "events",
  OTHER: "other",
} as const;

/**
 * The {@link JOIN_SKILLS} constant
 * @description The skills in the order the form shows them
 */
export const JOIN_SKILLS = [
  JOIN_SKILL.TEACHING,
  JOIN_SKILL.HEALTH,
  JOIN_SKILL.LAW,
  JOIN_SKILL.TRANSLATION,
  JOIN_SKILL.LOGISTICS,
  JOIN_SKILL.EVENTS,
  JOIN_SKILL.OTHER,
] as const;

/**
 * The {@link JOIN_ERROR} constant
 * @description What can be wrong with a sign-up before it is sent, one per field
 */
export const JOIN_ERROR = {
  NAME_MISSING: "name-missing",
  EMAIL_MISSING: "email-missing",
  EMAIL_INCOMPLETE: "email-incomplete",
  EMAIL_INVALID: "email-invalid",
  PLACE_MISSING: "place-missing",
  SKILLS_MISSING: "skills-missing",
  CONSENT_MISSING: "consent-missing",
} as const;

/**
 * The {@link JOIN_LIMIT} constant
 * @description The longest name, email, phone number, place and message the form takes
 */
export const JOIN_LIMIT = {
  NAME: 100,
  EMAIL: 120,
  PHONE: 30,
  PLACE: 80,
  MESSAGE: 2000,
} as const;

/**
 * The {@link JOIN_EMAIL_AT} constant
 * @description The sign every email address holds, which tells an unfinished address from something else
 */
export const JOIN_EMAIL_AT = "@";

/**
 * The {@link JOIN_NAME_SEPARATOR} constant
 * @description What separates the words of a full name, so the welcome can greet the first one
 */
export const JOIN_NAME_SEPARATOR = /\s+/;

/**
 * The {@link JOIN_CHECKED_FIELDS} constant
 * @description The fields that can keep a sign-up from being sent, in the order the form shows them
 */
export const JOIN_CHECKED_FIELDS = [
  JOIN_FIELD.NAME,
  JOIN_FIELD.EMAIL,
  JOIN_FIELD.PLACE,
  JOIN_FIELD.SKILLS,
  JOIN_FIELD.CONSENT,
] as const;

/**
 * The {@link JOIN_PLACEHOLDER} constant
 * @description The marks in the join page's copy that a name, an address, a language, skills or the fee replace
 */
export const JOIN_PLACEHOLDER = {
  NAME: "{name}",
  EMAIL: "{email}",
  LANGUAGE: "{language}",
  SKILLS: "{skills}",
  FEE: "{fee}",
  YEAR: "{year}",
  URL: "{url}",
} as const;

/**
 * The {@link JOIN_MODE_LABEL} constant
 * @description The translation key of each mode's name
 */
export const JOIN_MODE_LABEL = {
  [JOIN_MODE.MEMBER]: "joinPage.mode.member",
  [JOIN_MODE.VOLUNTEER]: "joinPage.mode.volunteer",
} as const;

/**
 * The {@link JOIN_SKILL_LABEL} constant
 * @description The translation key of each skill's name on its chip
 */
export const JOIN_SKILL_LABEL = {
  [JOIN_SKILL.TEACHING]: "joinPage.skill.teaching",
  [JOIN_SKILL.HEALTH]: "joinPage.skill.health",
  [JOIN_SKILL.LAW]: "joinPage.skill.law",
  [JOIN_SKILL.TRANSLATION]: "joinPage.skill.translation",
  [JOIN_SKILL.LOGISTICS]: "joinPage.skill.logistics",
  [JOIN_SKILL.EVENTS]: "joinPage.skill.events",
  [JOIN_SKILL.OTHER]: "joinPage.skill.other",
} as const;

/**
 * The {@link JOIN_SKILL_IN_SENTENCE} constant
 * @description The translation key of each skill as a sentence names it ("about translation")
 */
export const JOIN_SKILL_IN_SENTENCE = {
  [JOIN_SKILL.TEACHING]: "joinPage.skillInSentence.teaching",
  [JOIN_SKILL.HEALTH]: "joinPage.skillInSentence.health",
  [JOIN_SKILL.LAW]: "joinPage.skillInSentence.law",
  [JOIN_SKILL.TRANSLATION]: "joinPage.skillInSentence.translation",
  [JOIN_SKILL.LOGISTICS]: "joinPage.skillInSentence.logistics",
  [JOIN_SKILL.EVENTS]: "joinPage.skillInSentence.events",
  [JOIN_SKILL.OTHER]: "joinPage.skillInSentence.other",
} as const;
