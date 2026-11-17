// Dependencies
import { getTranslations } from "../../i18n/helpers";
import { CONTACT_ERROR, CONTACT_TOPIC_LABEL, CONTACT_TOPICS } from "../../lib/contact/constants";
import {
  ANSWER_LANGUAGE,
  ANSWER_LANGUAGE_IN_SENTENCE,
  ANSWER_LANGUAGE_LABEL,
  ANSWER_LANGUAGES,
} from "../../site/constants";
import { getOpenerItems } from "../ui/helpers";
import { CONTACT_ERROR_LABEL, CONTACT_SENT_OPENER_LANGS, CONTACT_SUMMARY_TITLE } from "./constants";

// Types
import type { Locale } from "../../i18n/types";
import type { ContactFormCopy } from "./types";

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
