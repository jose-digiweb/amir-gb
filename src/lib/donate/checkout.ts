// Dependencies
import { CHECKOUT, CHECKOUT_LOCALE, FREQUENCY } from "./constants";
import { getReturnUrls } from "./helpers";

// Types
import type Stripe from "stripe";
import type { Locale } from "../../i18n/types";
import type { GiftChoice } from "./types";

/**
 * The {@link getLineItem} helper
 * @description The one line of a gift: the amount on AMIR-GB's gift product, every month for a monthly gift
 * @param {GiftChoice} choice - The donor's choice
 * @returns {Stripe.Checkout.SessionCreateParams.LineItem} The line item for Checkout
 */
function getLineItem(choice: GiftChoice): Stripe.Checkout.SessionCreateParams.LineItem {
  const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData = {
    currency: CHECKOUT.CURRENCY,
    product: CHECKOUT.PRODUCT,
    unit_amount: choice.amountCents,
  };

  // A monthly gift repeats every month
  if (choice.frequency === FREQUENCY.MONTHLY) {
    priceData.recurring = { interval: CHECKOUT.INTERVAL };
  }

  // One gift of the chosen amount
  return { quantity: CHECKOUT.QUANTITY, price_data: priceData };
}

/**
 * The {@link getCheckoutParams} helper
 * @description The Checkout Session for a gift: a payment for a one-off gift, a subscription for a monthly one, in the page's language, with the payment methods the Stripe Dashboard turns on
 * @param {GiftChoice} choice - The donor's choice
 * @param {Locale} locale - The page's language
 * @param {string} pageUrl - The full address of the page's home, where Stripe sends the donor back
 * @returns {Stripe.Checkout.SessionCreateParams} The parameters for creating the session
 */
export function getCheckoutParams(
  choice: GiftChoice,
  locale: Locale,
  pageUrl: string,
): Stripe.Checkout.SessionCreateParams {
  const { success, cancel } = getReturnUrls(pageUrl, choice);
  const params: Stripe.Checkout.SessionCreateParams = {
    mode: CHECKOUT.MODE_PAYMENT,
    line_items: [getLineItem(choice)],
    locale: CHECKOUT_LOCALE[locale],
    success_url: success,
    cancel_url: cancel,
    integration_identifier: CHECKOUT.INTEGRATION,
  };

  // A monthly gift is a subscription
  if (choice.frequency === FREQUENCY.MONTHLY) {
    return { ...params, mode: CHECKOUT.MODE_SUBSCRIPTION };
  }

  // A one-off gift says Donate on Stripe's button
  return { ...params, submit_type: CHECKOUT.SUBMIT_TYPE };
}
