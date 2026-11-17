// Dependencies
import { isContactError } from "../../lib/contact/helpers";
import { readFieldErrors } from "../forms/helpers";
import { isInputError } from "astro:actions";
import { getTranslations } from "../../i18n/helpers";
import {
  CONTACT_CHECKED_FIELDS,
  CONTACT_ERROR,
  CONTACT_TOPICS,
  CONTACT_TOPIC_LABEL,
} from "../../lib/contact/constants";
import {
  ANSWER_LANGUAGE,
  ANSWER_LANGUAGE_IN_SENTENCE,
  ANSWER_LANGUAGE_LABEL,
  ANSWER_LANGUAGES,
} from "../../site/constants";
import { getOpenerItems } from "../ui/helpers";
import {
  CONTACT_ERROR_LABEL,
  CONTACT_FORM_STATE,
  CONTACT_SENT_OPENER_LANGS,
  CONTACT_SUMMARY_TITLE,
} from "./constants";

// Types
import type { ContactResult } from "../../lib/contact/types";
import type { ActionError } from "astro:actions";
import type { Locale } from "../../i18n/types";
import type { ContactFormCopy, ContactFormStart } from "./types";

/**
 * The {@link getContactFormCopy} helper
 * @description Every word the message form shows, in the page's language, for the Vue island
 * @param {Locale} locale - The page's language
 * @returns {ContactFormCopy} The form's copy
 */
export function getContactFormCopy(locale: Locale): ContactFormCopy {
  const t = getTranslations(locale);
  return {
    nameLabel: t["contactPage.nameLabel"],
    namePlaceholder: t["contactPage.namePlaceholder"],
    reachLabel: t["contactPage.reachLabel"],
    reachPlaceholder: t["contactPage.reachPlaceholder"],
    languageLabel: t["contactPage.languageLabel"],
    languages: ANSWER_LANGUAGES.map((value) => ({ value, label: t[ANSWER_LANGUAGE_LABEL[value]] })),
    topicLabel: t["contactPage.topicLabel"],
    topics: CONTACT_TOPICS.map((value) => ({ value, label: t[CONTACT_TOPIC_LABEL[value]] })),
    messageLabel: t["contactPage.messageLabel"],
    messagePlaceholder: t["contactPage.messagePlaceholder"],
    consent: t["contactPage.consent"],
    privacy: t["footer.privacy"],
    send: t["contactPage.send"],
    sending: t["contactPage.sending"],
    errors: {
      [CONTACT_ERROR.NAME_MISSING]: t[CONTACT_ERROR_LABEL[CONTACT_ERROR.NAME_MISSING]],
      [CONTACT_ERROR.REACH_MISSING]: t[CONTACT_ERROR_LABEL[CONTACT_ERROR.REACH_MISSING]],
      [CONTACT_ERROR.EMAIL_INCOMPLETE]: t[CONTACT_ERROR_LABEL[CONTACT_ERROR.EMAIL_INCOMPLETE]],
      [CONTACT_ERROR.REACH_INVALID]: t[CONTACT_ERROR_LABEL[CONTACT_ERROR.REACH_INVALID]],
      [CONTACT_ERROR.MESSAGE_MISSING]: t[CONTACT_ERROR_LABEL[CONTACT_ERROR.MESSAGE_MISSING]],
      [CONTACT_ERROR.CONSENT_MISSING]: t[CONTACT_ERROR_LABEL[CONTACT_ERROR.CONSENT_MISSING]],
    },
    summaryTitles: CONTACT_SUMMARY_TITLE.map((key) => t[key]),
    summaryFields: {
      name: t["contactPage.summaryField.name"],
      reach: t["contactPage.summaryField.reach"],
      message: t["contactPage.summaryField.message"],
      consent: t["contactPage.summaryField.consent"],
    },
    sentOpener: getOpenerItems(t["contactPage.sentOpener"], CONTACT_SENT_OPENER_LANGS),
    sentTitle: t["contactPage.sentTitle"],
    sentText: t["contactPage.sentText"],
    languagesInSentence: {
      [ANSWER_LANGUAGE.NL]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.NL]],
      [ANSWER_LANGUAGE.EN]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.EN]],
      [ANSWER_LANGUAGE.PT]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.PT]],
      [ANSWER_LANGUAGE.KRIOL]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.KRIOL]],
    },
    whatsapp: t["contact.whatsapp"],
    sendAnother: t["contactPage.sendAnother"],
    failedTitle: t["contactPage.failedTitle"],
    failedText: t["contactPage.failedText"],
    tryAgain: t["contactPage.tryAgain"],
  };
}

/**
 * The {@link getContactFormStart} helper
 * @description Where the message form starts after it was posted without JavaScript: thanked, with the server's errors, or not sent with the message given back
 * @param {ContactResult | undefined} data - The contact action's result, when it ran
 * @param {ActionError | undefined} error - The contact action's error, when it failed
 * @returns {ContactFormStart | undefined} The form's start, or nothing when the page was not posted
 */
export function getContactFormStart(
  data: ContactResult | undefined,
  error: ActionError | undefined,
): ContactFormStart | undefined {
  // Input the server refused shows its errors
  if (error && isInputError(error)) {
    return {
      state: CONTACT_FORM_STATE.EDITING,
      errors: readFieldErrors(error.fields, CONTACT_CHECKED_FIELDS, isContactError),
    };
  }

  // Any other error means it did not go
  if (error) {
    return { state: CONTACT_FORM_STATE.FAILED };
  }

  // A message that reached AMIR-GB is thanked; one that did not is given back
  if (data) {
    return {
      state: data.sent ? CONTACT_FORM_STATE.SENT : CONTACT_FORM_STATE.FAILED,
      values: data.values,
    };
  }

  // A plain visit starts empty
  return undefined;
}
