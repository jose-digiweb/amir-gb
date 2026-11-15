// Dependencies
import { LOCALE } from "../../i18n/constants";
import { getTranslations } from "../../i18n/helpers";
import { sendToInbox } from "../forms/mail";
import { JOIN_MODE, JOIN_PLACEHOLDER } from "./constants";
import { getJoinMailLines } from "./helpers";

// Types
import type { InboxError } from "../forms/types";
import type { JoinValues } from "./types";

/**
 * The {@link sendJoinSignUp} helper
 * @description Emails a sign-up to AMIR-GB's inbox, with the visitor as the address to reply to
 * @param {JoinValues} values - The sign-up, checked
 * @returns {Promise<InboxError | undefined>} Why it was not sent, or undefined once it is on its way
 */
export async function sendJoinSignUp(values: JoinValues): Promise<InboxError | undefined> {
  // The subject says what the sign-up is for and who sent it
  const t = getTranslations(LOCALE.NL);
  let subject = t["joinMail.subjectMember"];
  if (values.mode === JOIN_MODE.VOLUNTEER) {
    subject = t["joinMail.subjectVolunteer"];
  }

  // Send it to the inbox
  return sendToInbox({
    subject: subject.replace(JOIN_PLACEHOLDER.NAME, values.name),
    replyTo: values.email,
    lines: getJoinMailLines(values),
  });
}
