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
