// Dependencies
import { CONTACT_FROM_ADDRESS } from "astro:env/server";
import { env } from "cloudflare:workers";
import { getTranslations } from "../../i18n/helpers";
import { LOCALE } from "../../i18n/constants";
import { CONTACT } from "../../site/constants";
import {
  ANSWER_LANGUAGE_LABEL,
  CONTACT_MAIL_ERROR,
  CONTACT_MAIL_LINE_BREAK,
  CONTACT_MAIL_LOG,
  CONTACT_PLACEHOLDER,
  CONTACT_TOPIC_LABEL,
} from "./constants";
import { isEmailLike } from "./helpers";

// Types
import type { ContactMailError, ContactValues } from "./types";

/**
 * The {@link sendContactMessage} helper
 * @description Emails a message to AMIR-GB's inbox through Cloudflare Email Service, in Dutch, with the visitor as the address to reply to when they gave an email
 * @param {ContactValues} values - The message, checked
 * @returns {Promise<ContactMailError | undefined>} Why it was not sent, or undefined once it is on its way
 */
export async function sendContactMessage(
  values: ContactValues,
): Promise<ContactMailError | undefined> {
  // Without an address on AMIR's own domain to send from, nothing can be sent
  if (!CONTACT_FROM_ADDRESS) {
    console.error(CONTACT_MAIL_LOG.NOT_SET_UP);
    return CONTACT_MAIL_ERROR.NOT_SET_UP;
  }

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
  const lines = [
    `${t["contactMail.name"]}: ${values.name}`,
    `${t["contactMail.reach"]}: ${values.reach}`,
    `${t["contactMail.language"]}: ${t[ANSWER_LANGUAGE_LABEL[values.language]]}`,
    `${t["contactMail.topic"]}: ${topic}`,
    "",
    values.message,
  ];

  // Send it, and log why when Email Service refuses
  try {
    await env.FORM_INBOX.send({
      to: CONTACT.EMAIL,
      from: { email: CONTACT_FROM_ADDRESS, name: t["contactMail.sender"] },
      replyTo,
      subject: t["contactMail.subject"].replace(CONTACT_PLACEHOLDER.NAME, values.name),
      text: lines.join(CONTACT_MAIL_LINE_BREAK),
    });
    return undefined;
  } catch (error) {
    console.error(CONTACT_MAIL_LOG.SEND_FAILED, error);
    return CONTACT_MAIL_ERROR.SEND_FAILED;
  }
}
