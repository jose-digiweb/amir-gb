// Dependencies
import { ActionError, defineAction } from "astro:actions";
import { getRelativeLocaleUrl } from "astro:i18n";
import { DONATE_ERROR, ORIGIN_HEADER } from "../lib/donate/constants";
import { DONATE_INPUT } from "../lib/donate/schema";
import { startCheckout } from "../lib/donate/stripe";
import { ROUTE } from "../site/constants";

/**
 * The {@link donate} action
 * @description Starts a gift: makes the Stripe Checkout Session for the donor's choice and returns its payment page, which the home page redirects to
 */
export const donate = defineAction({
  accept: "form",
  input: DONATE_INPUT,
  handler: async ({ choice, locale }, context) => {
    const origin = context.request.headers.get(ORIGIN_HEADER);

    // A post from another site never starts a payment, as the built Worker has no origin check of its own
    if (origin && origin !== context.url.origin) {
      throw new ActionError({ code: "FORBIDDEN" });
    }

    // Make the payment page, with the page's home to come back to
    const pageUrl = new URL(getRelativeLocaleUrl(locale, ROUTE.HOME), context.url.origin).href;
    const url = await startCheckout(choice, locale, pageUrl);

    // Without a payment page the donor stays on the form and is told
    if (!url) {
      throw new ActionError({ code: "SERVICE_UNAVAILABLE", message: DONATE_ERROR.START_FAILED });
    }

    // Stripe's payment page for this gift
    return { url };
  },
});
