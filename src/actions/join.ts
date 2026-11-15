// Dependencies
import { ActionError, defineAction } from "astro:actions";
import { isForeignPost } from "../lib/actions/helpers";
import { sendJoinSignUp } from "../lib/join/mail";
import { JOIN_INPUT } from "../lib/join/schema";

/**
 * The {@link join} action
 * @description Sends a sign-up from the join page's form to AMIR-GB's inbox
 */
export const join = defineAction({
  accept: "form",
  input: JOIN_INPUT,
  handler: async ({ values, isTrapped }, context) => {
    // A post from another site is never sent
    if (isForeignPost(context.request, context.url)) {
      throw new ActionError({ code: "FORBIDDEN" });
    }

    // A robot that filled the hidden field is told it worked, and nothing is sent
    if (isTrapped) {
      return { sent: true };
    }

    // Send it; when it cannot go, the visitor keeps what they typed and is told
    const error = await sendJoinSignUp(values);
    if (error) {
      throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: error });
    }

    // On its way to AMIR-GB
    return { sent: true };
  },
});
