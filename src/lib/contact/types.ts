// Types
import type { AnswerLanguage } from "../../site/types";
import type { CONTACT_ERROR, CONTACT_FIELD, CONTACT_TOPIC } from "./constants";

/**
 * The {@link ContactField} type
 * @description One of the {@link CONTACT_FIELD} values
 */
export type ContactField = (typeof CONTACT_FIELD)[keyof typeof CONTACT_FIELD];

/**
 * The {@link ContactTopic} type
 * @description One of the {@link CONTACT_TOPIC} values
 */
export type ContactTopic = (typeof CONTACT_TOPIC)[keyof typeof CONTACT_TOPIC];

/**
 * The {@link ContactError} type
 * @description One of the {@link CONTACT_ERROR} values
 */
export type ContactError = (typeof CONTACT_ERROR)[keyof typeof CONTACT_ERROR];

/**
 * The {@link ContactValues} type
 * @description A message as the visitor typed it
 */
export type ContactValues = {
  name: string;
  reach: string;
  language: AnswerLanguage;
  topic?: ContactTopic;
  message: string;
  consent: boolean;
};

/**
 * The {@link ContactErrors} type
 * @description What is wrong with a message, by the field it belongs to
 */
export type ContactErrors = {
  name?: ContactError;
  reach?: ContactError;
  message?: ContactError;
  consent?: ContactError;
};

/**
 * The {@link OpeningStatus} type
 * @description Whether AMIR-GB answers now, and when that changes: the time, and how many days from today
 */
export type OpeningStatus = {
  isOpen: boolean;
  time: string;
  weekday: number;
  daysAway: number;
};

/**
 * The {@link QrDrawing} type
 * @description A QR code as one SVG path, with the size of its square in modules
 */
export type QrDrawing = {
  size: number;
  path: string;
};

/**
 * The {@link ContactCheckedField} type
 * @description A field that can keep a message from being sent
 */
export type ContactCheckedField = keyof ContactErrors;

/**
 * The {@link ContactResult} type
 * @description What the contact action returns: whether the message reached AMIR-GB, and the message itself, so a page posted without JavaScript can thank the visitor or give their text back
 */
export type ContactResult = {
  sent: boolean;
  values: ContactValues;
};
