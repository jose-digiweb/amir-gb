// Dependencies
import { ActionError, defineAction } from "astro:actions";
import { isForeignPost } from "../lib/actions/helpers";
import { sendJoinSignUp } from "../lib/join/mail";
import { JOIN_INPUT } from "../lib/join/schema";

// Types
import type { JoinResult } from "../lib/join/types";

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
      return { sent: true, values } satisfies JoinResult;
    }

    // Send it; when it cannot go, the visitor is told and gets what they typed back
    const error = await sendJoinSignUp(values);
    if (error) {
      return { sent: false, values } satisfies JoinResult;
    }

    // On its way to AMIR-GB
    return { sent: true, values } satisfies JoinResult;
  },
});
