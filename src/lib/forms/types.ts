// Types
import type { INBOX_ERROR } from "./constants";

/**
 * The {@link InboxError} type
 * @description One of the {@link INBOX_ERROR} values
 */
export type InboxError = (typeof INBOX_ERROR)[keyof typeof INBOX_ERROR];

/**
 * The {@link InboxEmail} type
 * @description An email to AMIR-GB's inbox: its subject, its lines and, when the visitor gave one, the address to reply to
 */
export type InboxEmail = {
  subject: string;
  lines: string[];
  replyTo?: string;
};

/**
 * The {@link SummaryField} type
 * @description A field the error summary names: the id it links to and its name as a sentence writes it
 */
export type SummaryField = {
  id: string;
  name: string;
};

/**
 * The {@link SummaryPart} type
 * @description A piece of the error summary's sentence: a field's name that links to it, or the words between
 */
export type SummaryPart = {
  text: string;
  href?: string;
};
