// Dependencies
import { getTranslations } from "../../i18n/helpers";
import { LOCALE } from "../../i18n/constants";
import { ANSWER_LANGUAGE_LABEL } from "../../site/constants";
import { sendToInbox } from "../forms/mail";
import { CONTACT_PLACEHOLDER, CONTACT_TOPIC_LABEL } from "./constants";
import { isEmailLike } from "./helpers";

// Types
import type { InboxError } from "../forms/types";
import type { ContactValues } from "./types";

/**
 * The {@link sendContactMessage} helper
 * @description Emails a message to AMIR-GB's inbox, in Dutch, with the visitor as the address to reply to when they gave an email
 * @param {ContactValues} values - The message, checked
 * @returns {Promise<InboxError | undefined>} Why it was not sent, or undefined once it is on its way
 */
export async function sendContactMessage(values: ContactValues): Promise<InboxError | undefined> {
  // Write it for AMIR's volunteers, who read Dutch
  const t = getTranslations(LOCALE.NL);
  let topic = t["contactMail.noTopic"];
  if (values.topic) {
    topic = t[CONTACT_TOPIC_LABEL[values.topic]];
  }
  let replyTo: string | undefined;
  if (isEmailLike(values.reach)) {
    replyTo = values.reach;
  }

  // Send it to the inbox
  return sendToInbox({
    subject: t["contactMail.subject"].replace(CONTACT_PLACEHOLDER.NAME, values.name),
    replyTo,
    lines: [
      `${t["contactMail.name"]}: ${values.name}`,
      `${t["contactMail.reach"]}: ${values.reach}`,
      `${t["contactMail.language"]}: ${t[ANSWER_LANGUAGE_LABEL[values.language]]}`,
      `${t["contactMail.topic"]}: ${topic}`,
      "",
      values.message,
    ],
  });
}
