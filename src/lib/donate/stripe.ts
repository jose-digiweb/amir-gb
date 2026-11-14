// Dependencies
import { STRIPE_SECRET_KEY } from "astro:env/server";
import Stripe from "stripe";
import { getCheckoutParams } from "./checkout";
import { GIFT_STATE, STRIPE_LOG } from "./constants";
import { getSessionState } from "./helpers";

// Types
import type { Locale } from "../../i18n/types";
import type { GiftChoice, SupportState } from "./types";

/**
 * The {@link getStripe} helper
 * @description A Stripe client on fetch, which Cloudflare Workers support, or nothing when no key is set
 * @returns {Stripe | undefined} The client, or undefined without STRIPE_SECRET_KEY
 */
function getStripe(): Stripe | undefined {
  // Without a key there is no client
  if (!STRIPE_SECRET_KEY) {
    return undefined;
  }

  // A client that talks to Stripe through fetch
  return new Stripe(STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient() });
}

/**
 * The {@link startCheckout} helper
 * @description Creates the Checkout Session for a gift and returns the address of Stripe's payment page
 * @param {GiftChoice} choice - The donor's choice
 * @param {Locale} locale - The page's language
 * @param {string} pageUrl - The full address of the page's home, where Stripe sends the donor back
 * @returns {Promise<string | undefined>} Stripe's payment page, or nothing when the session could not be made
 */
export async function startCheckout(
  choice: GiftChoice,
  locale: Locale,
  pageUrl: string,
): Promise<string | undefined> {
  const stripe = getStripe();

  // Without a client no payment can start
  if (!stripe) {
    return undefined;
  }

  // Stripe refusing or not answering also means no payment
  try {
    const session = await stripe.checkout.sessions.create(
      getCheckoutParams(choice, locale, pageUrl),
    );
    return session.url ?? undefined;
  } catch (error) {
    console.error(STRIPE_LOG.START_FAILED, error);
    return undefined;
  }
}

/**
 * The {@link readCheckoutSession} helper
 * @description Reads the Checkout Session a donor came back from and returns what the Support section shows
 * @param {string} sessionId - The session's id from the return address
 * @returns {Promise<SupportState>} Paid, paid monthly, on its way, or failed
 */
export async function readCheckoutSession(sessionId: string): Promise<SupportState> {
  const stripe = getStripe();

  // Without a client the result cannot be read, and nothing is claimed
  if (!stripe) {
    return { state: GIFT_STATE.FAILED };
  }

  // A session Stripe does not know, or no answer, shows as failed
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return getSessionState({
      mode: session.mode,
      status: session.status,
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
    });
  } catch (error) {
    console.error(STRIPE_LOG.READ_FAILED, error);
    return { state: GIFT_STATE.FAILED };
  }
}
