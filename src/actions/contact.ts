// Dependencies
import { ActionError, defineAction } from "astro:actions";
import { isForeignPost } from "../lib/actions/helpers";
import { sendContactMessage } from "../lib/contact/mail";
import { CONTACT_INPUT } from "../lib/contact/schema";

/**
 * The {@link contact} action
 * @description Sends a message from the Contact page's form to AMIR-GB's inbox
 */
export const contact = defineAction({
  accept: "form",
  input: CONTACT_INPUT,
  handler: async ({ values, isTrapped }, context) => {
    // A post from another site is never sent
    if (isForeignPost(context.request, context.url)) {
      throw new ActionError({ code: "FORBIDDEN" });
    }

    // A robot that filled the hidden field is told it worked, and nothing is sent
    if (isTrapped) {
      return { sent: true };
    }

    // Send it; when it cannot go, the visitor keeps their text and is told
    const error = await sendContactMessage(values);
    if (error) {
      throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: error });
    }

    // On its way to AMIR-GB
    return { sent: true };
  },
});
