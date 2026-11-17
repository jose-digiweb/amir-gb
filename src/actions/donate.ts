// Dependencies
import { ActionError, defineAction } from "astro:actions";
import { getRelativeLocaleUrl } from "astro:i18n";
import { isForeignPost } from "../lib/actions/helpers";
import { getGiftPageRoute } from "../lib/donate/pages";
import { DONATE_INPUT } from "../lib/donate/schema";
import { startCheckout } from "../lib/donate/stripe";

/**
 * The {@link donate} action
 * @description Starts a gift: makes the Stripe Checkout Session for the donor's choice and returns its payment page, which the page it was posted from redirects to, or the choice back when Stripe did not answer
 */
export const donate = defineAction({
  accept: "form",
  input: DONATE_INPUT,
  handler: async ({ choice, locale }, context) => {
    // A post from another site never starts a payment
    if (isForeignPost(context.request, context.url)) {
      throw new ActionError({ code: "FORBIDDEN" });
    }

    // Make the payment page, with the page the gift was started from to come back to
    const route = getGiftPageRoute(context.url.pathname);
    const pageUrl = new URL(getRelativeLocaleUrl(locale, route), context.url.origin).href;
    const url = await startCheckout(choice, locale, pageUrl);

    // Without a payment page the donor stays on the form, told, with their choice kept
    if (!url) {
      return { failedChoice: choice };
    }

    // Stripe's payment page for this gift
    return { url };
  },
});
