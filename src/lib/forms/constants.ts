/**
 * The {@link FORM_TRAP_FIELD} constant
 * @description The hidden field that only robots fill in; a form that posts it filled is never sent
 */
export const FORM_TRAP_FIELD = "website";

/**
 * The {@link CHECKBOX_ON} constant
 * @description What a ticked checkbox posts
 */
export const CHECKBOX_ON = "on";

/**
 * The {@link EMAIL_PATTERN} constant
 * @description An email address: a name, an @ and a domain with a dot
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The {@link LINE_BREAKS} constant
 * @description One or more line breaks in a row, folded into a space where a value must stay on one line
 */
export const LINE_BREAKS = /[\r\n]+/g;

/**
 * The {@link INBOX_LINE_BREAK} constant
 * @description What joins the lines of an email to the inbox
 */
export const INBOX_LINE_BREAK = "\n";

/**
 * The {@link INBOX_ERROR} constant
 * @description Why an email to the inbox could not be sent
 */
export const INBOX_ERROR = {
  NOT_SET_UP: "not-set-up",
  SEND_FAILED: "send-failed",
} as const;

/**
 * The {@link INBOX_LOG} constant
 * @description The Worker log lines for an email that did not send
 */
export const INBOX_LOG = {
  NOT_SET_UP: "[forms] CONTACT_FROM_ADDRESS is not set; the email was not sent",
  SEND_FAILED: "[forms] Email Service did not send the email",
} as const;

/**
 * The {@link SUMMARY_SENTENCE} constant
 * @description What the error summary's sentence ends with, and what turns a field's id into a link to it
 */
export const SUMMARY_SENTENCE = {
  FULL_STOP: ".",
  FRAGMENT: "#",
} as const;
