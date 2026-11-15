// Dependencies
import { LOCALE } from "../../i18n/constants";
import { getTranslations } from "../../i18n/helpers";
import { ANSWER_LANGUAGE_LABEL } from "../../site/constants";
import { EMAIL_PATTERN } from "../forms/constants";
import {
  JOIN_EMAIL_AT,
  JOIN_ERROR,
  JOIN_MODE,
  JOIN_MODE_LABEL,
  JOIN_NAME_SEPARATOR,
  JOIN_SKILL_LABEL,
  JOIN_SKILLS,
} from "./constants";

// Types
import type { JoinError, JoinErrors, JoinSkill, JoinValues } from "./types";

/**
 * The {@link checkJoinEmail} helper
 * @description What is wrong with an email address, if anything
 * @param {string} email - The email address, trimmed
 * @returns {JoinError | undefined} The error, or undefined when it can be used
 */
export function checkJoinEmail(email: string): JoinError | undefined {
  // Nothing typed
  if (!email) {
    return JOIN_ERROR.EMAIL_MISSING;
  }

  // A complete address
  if (EMAIL_PATTERN.test(email)) {
    return undefined;
  }

  // An address still missing its ending, or something that is not an address
  if (email.includes(JOIN_EMAIL_AT)) {
    return JOIN_ERROR.EMAIL_INCOMPLETE;
  }
  return JOIN_ERROR.EMAIL_INVALID;
}

/**
 * The {@link checkJoinValues} helper
 * @description Everything that keeps a sign-up from being sent, by field
 * @param {JoinValues} values - The sign-up as typed, trimmed
 * @returns {JoinErrors} The errors; empty when the sign-up can be sent
 */
export function checkJoinValues(values: JoinValues): JoinErrors {
  const errors: JoinErrors = {};

  // A name to welcome
  if (!values.name) {
    errors.name = JOIN_ERROR.NAME_MISSING;
  }

  // An address to confirm to
  const emailError = checkJoinEmail(values.email);
  if (emailError) {
    errors.email = emailError;
  }

  // Where they live
  if (!values.place) {
    errors.place = JOIN_ERROR.PLACE_MISSING;
  }

  // A volunteer says what they can help with
  if (values.mode === JOIN_MODE.VOLUNTEER && values.skills.length === 0) {
    errors.skills = JOIN_ERROR.SKILLS_MISSING;
  }

  // Leave to keep the details
  if (!values.consent) {
    errors.consent = JOIN_ERROR.CONSENT_MISSING;
  }

  // Every error found
  return errors;
}

/**
 * The {@link isJoinError} helper
 * @description Whether a value is one of the sign-up form's errors
 * @param {string | undefined} value - The value to check
 * @returns {boolean} True when it names a {@link JOIN_ERROR}
 */
export function isJoinError(value: string | undefined): value is JoinError {
  return Object.values(JOIN_ERROR).some((error) => error === value);
}

/**
 * The {@link getJoinMailLines} helper
 * @description The sign-up as AMIR-GB's volunteers read it, in Dutch, one fact per line
 * @param {JoinValues} values - The sign-up, checked
 * @returns {string[]} The email's lines
 */
export function getJoinMailLines(values: JoinValues): string[] {
  const t = getTranslations(LOCALE.NL);
  let phone = t["joinMail.notGiven"];
  if (values.phone) {
    phone = values.phone;
  }
  const lines = [
    `${t["joinMail.mode"]}: ${t[JOIN_MODE_LABEL[values.mode]]}`,
    `${t["joinMail.name"]}: ${values.name}`,
    `${t["joinMail.email"]}: ${values.email}`,
    `${t["joinMail.phone"]}: ${phone}`,
    `${t["joinMail.place"]}: ${values.place}`,
    `${t["joinMail.language"]}: ${t[ANSWER_LANGUAGE_LABEL[values.language]]}`,
  ];

  // A volunteer's skills, or a member's next step
  if (values.mode === JOIN_MODE.VOLUNTEER) {
    const skills = values.skills.map((skill) => t[JOIN_SKILL_LABEL[skill]]);
    lines.push(`${t["joinMail.skills"]}: ${skills.join(", ")}`);
  } else {
    lines.push("", t["joinMail.memberNext"]);
  }

  // Their own words, when they wrote any
  if (values.message) {
    lines.push("", values.message);
  }
  return lines;
}

/**
 * The {@link orderSkills} helper
 * @description Puts the skills a volunteer picked in the order the form shows them, whatever order they were ticked in
 * @param {readonly JoinSkill[]} picked - The skills as ticked
 * @returns {JoinSkill[]} The same skills in the form's order
 */
export function orderSkills(picked: readonly JoinSkill[]): JoinSkill[] {
  return JOIN_SKILLS.filter((skill) => picked.includes(skill));
}

/**
 * The {@link getFirstName} helper
 * @description The first word of a full name, which the welcome greets
 * @param {string} name - The full name, trimmed
 * @returns {string} The first name
 */
export function getFirstName(name: string): string {
  return name.split(JOIN_NAME_SEPARATOR)[0] ?? name;
}
