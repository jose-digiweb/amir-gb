// Dependencies
import { CONTACT_FROM_ADDRESS } from "astro:env/server";
import { env } from "cloudflare:workers";
import { LOCALE } from "../../i18n/constants";
import { getTranslations } from "../../i18n/helpers";
import { CONTACT } from "../../site/constants";
import { INBOX_ERROR, INBOX_LINE_BREAK, INBOX_LOG } from "./constants";

// Types
import type { InboxEmail, InboxError } from "./types";

/**
 * The {@link sendToInbox} helper
 * @description Emails AMIR-GB's inbox through Cloudflare Email Service, from the site's own address
 * @param {InboxEmail} email - The subject, the lines and the address to reply to
 * @returns {Promise<InboxError | undefined>} Why it was not sent, or undefined once it is on its way
 */
export async function sendToInbox(email: InboxEmail): Promise<InboxError | undefined> {
  // Without an address on AMIR's own domain to send from, nothing can be sent
  if (!CONTACT_FROM_ADDRESS) {
    console.error(INBOX_LOG.NOT_SET_UP);
    return INBOX_ERROR.NOT_SET_UP;
  }

  // Send it under the website's name, and log why when Email Service refuses
  const t = getTranslations(LOCALE.NL);
  try {
    await env.FORM_INBOX.send({
      to: CONTACT.EMAIL,
      from: { email: CONTACT_FROM_ADDRESS, name: t["formMail.sender"] },
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.lines.join(INBOX_LINE_BREAK),
    });
    return undefined;
  } catch (error) {
    console.error(INBOX_LOG.SEND_FAILED, error);
    return INBOX_ERROR.SEND_FAILED;
  }
}
