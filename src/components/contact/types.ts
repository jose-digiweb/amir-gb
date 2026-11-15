// Types
import type { AnswerLanguage, ContactError } from "../../lib/contact/types";
import type { CONTACT_FORM_STATE } from "./constants";

/**
 * The {@link ContactFormState} type
 * @description One of the {@link CONTACT_FORM_STATE} values
 */
export type ContactFormState = (typeof CONTACT_FORM_STATE)[keyof typeof CONTACT_FORM_STATE];

/**
 * The {@link ChoiceOption} type
 * @description One chip of a single choice: what it posts and what it says
 */
export type ChoiceOption = {
  value: string;
  label: string;
};

/**
 * The {@link ContactFormCopy} type
 * @description Every word the message form shows, in the page's language
 */
export type ContactFormCopy = {
  nameLabel: string;
  namePlaceholder: string;
  reachLabel: string;
  reachPlaceholder: string;
  languageLabel: string;
  languages: ChoiceOption[];
  topicLabel: string;
  topics: ChoiceOption[];
  messageLabel: string;
  messagePlaceholder: string;
  consent: string;
  privacy: string;
  send: string;
  sending: string;
  errors: Record<ContactError, string>;
  summaryTitles: string[];
  summaryFields: { name: string; reach: string; message: string; consent: string };
  sentOpener: string;
  sentTitle: string;
  sentText: string;
  languagesInSentence: Record<AnswerLanguage, string>;
  whatsapp: string;
  sendAnother: string;
  failedTitle: string;
  failedText: string;
  tryAgain: string;
};

/**
 * The {@link ContactFormLinks} type
 * @description The links the message form offers: WhatsApp and the privacy page
 */
export type ContactFormLinks = {
  whatsapp: string;
  privacy: string;
};
