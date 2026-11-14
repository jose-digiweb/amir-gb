// Dependencies
import { isInputError } from "astro:actions";
import { DONATE_ERROR, DONATE_FIELD, GIFT_STATE, PRIVATE_PAGE } from "./constants";
import { isStoppedReturn, readGiftReturn } from "./helpers";
import { readCheckoutSession } from "./stripe";

// Types
import type { ActionError } from "astro:actions";
import type { DonateError, SupportState } from "./types";

/**
 * The {@link getFormError} helper
 * @description The error a failed try of the donation form shows: the amount's own error, or that the payment could not start
 * @param {ActionError} error - The donate action's error
 * @returns {DonateError} The error to show
 */
function getFormError(error: ActionError): DonateError {
  // An error that is not about the input means Stripe did not start the payment
  if (!isInputError(error)) {
    return DONATE_ERROR.START_FAILED;
  }

  // An amount over the largest gift says so
  if (error.fields[DONATE_FIELD.OTHER]?.[0] === DONATE_ERROR.TOO_LARGE) {
    return DONATE_ERROR.TOO_LARGE;
  }

  // Any other input error is an amount too small to give
  return DONATE_ERROR.TOO_SMALL;
}

/**
 * The {@link getSupportState} helper
 * @description What the Support section shows for a request: a return from Stripe, the form with the error of a failed try, or the plain form
 * @param {URL} url - The page's address
 * @param {ActionError | undefined} error - The donate action's error when the form was just posted without JavaScript
 * @returns {Promise<SupportState>} The state to render
 */
export async function getSupportState(
  url: URL,
  error: ActionError | undefined,
): Promise<SupportState> {
  // A failed try keeps the form, with its error
  if (error) {
    return { state: GIFT_STATE.FORM, error: getFormError(error) };
  }

  // A plain visit shows the form
  const giftReturn = readGiftReturn(url);
  if (!giftReturn) {
    return { state: GIFT_STATE.FORM };
  }

  // A donor who stopped sees their choice again
  if (isStoppedReturn(giftReturn)) {
    return { state: GIFT_STATE.STOPPED, choice: giftReturn.stopped };
  }

  // A donor who paid, or tried to, sees what Stripe says
  return readCheckoutSession(giftReturn.sessionId);
}

/**
 * The {@link isPrivateState} helper
 * @description Whether a state belongs to one donor, so its page must never be cached
 * @param {SupportState} support - The Support section's state
 * @returns {boolean} True for any return from Stripe or a failed try
 */
export function isPrivateState(support: SupportState): boolean {
  // Only the plain form, without an error, is the same for everyone
  if (support.state === GIFT_STATE.FORM) {
    return support.error !== undefined;
  }

  // Every result of a gift is the donor's own
  return true;
}

/**
 * The {@link keepPagePrivate} helper
 * @description Tells browsers and Cloudflare not to keep a page that shows one donor's gift
 * @param {Headers} headers - The page's response headers
 * @returns {void}
 */
export function keepPagePrivate(headers: Headers): void {
  headers.set(PRIVATE_PAGE.HEADER, PRIVATE_PAGE.VALUE);
}
