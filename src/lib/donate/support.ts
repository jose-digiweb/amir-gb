// Dependencies
import { isInputError } from "astro:actions";
import {
  DONATE_ERROR,
  DONATE_FIELD,
  DONATE_PAGE_CACHE,
  GIFT_STATE,
  PRIVATE_PAGE,
} from "./constants";
import { isStoppedReturn, readGiftReturn } from "./helpers";
import { readCheckoutSession } from "./stripe";

// Types
import type { AstroGlobal } from "astro";
import type { ActionError } from "astro:actions";
import type { DonateError, DonateResult, SupportState } from "./types";

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
  const fieldError = error.fields[DONATE_FIELD.OTHER]?.[0];
  if (fieldError === DONATE_ERROR.TOO_LARGE) {
    return DONATE_ERROR.TOO_LARGE;
  }

  // Typed text that is not an amount says so
  if (fieldError === DONATE_ERROR.NOT_AN_AMOUNT) {
    return DONATE_ERROR.NOT_AN_AMOUNT;
  }

  // Any other input error is an amount too small to give
  return DONATE_ERROR.TOO_SMALL;
}

/**
 * The {@link getCheckoutUrl} helper
 * @description Stripe's payment page a just posted gift goes to, when the action made one
 * @param {DonateResult | undefined} result - The donate action's result, if the form was just posted
 * @returns {string | undefined} The payment page's address
 */
export function getCheckoutUrl(result: DonateResult | undefined): string | undefined {
  // Only a result with a payment page has somewhere to go
  if (result && "url" in result) {
    return result.url;
  }

  // Anything else stays on the page
  return undefined;
}

/**
 * The {@link getSupportState} helper
 * @description What the Support section shows for a request: a return from Stripe, the form with the error of a failed try, or the plain form
 * @param {URL} url - The page's address
 * @param {ActionError | undefined} error - The donate action's error when the form was just posted without JavaScript
 * @param {DonateResult} [result] - The donate action's result when the form was just posted
 * @returns {Promise<SupportState>} The state to render
 */
export async function getSupportState(
  url: URL,
  error: ActionError | undefined,
  result?: DonateResult,
): Promise<SupportState> {
  // A failed try keeps the form, with its error
  if (error) {
    return { state: GIFT_STATE.FORM, error: getFormError(error) };
  }

  // Stripe did not answer: the form says so and keeps the donor's choice
  if (result && "failedChoice" in result) {
    return {
      state: GIFT_STATE.FORM,
      error: DONATE_ERROR.START_FAILED,
      choice: result.failedChoice,
    };
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
 * @description Tells browsers and Cloudflare not to keep a page that shows one donor's gift, and search engines not to list it
 * @param {Headers} headers - The page's response headers
 * @returns {void}
 */
export function keepPagePrivate(headers: Headers): void {
  // No cache keeps the page, and no search engine lists it
  headers.set(PRIVATE_PAGE.HEADER, PRIVATE_PAGE.VALUE);
  headers.set(PRIVATE_PAGE.ROBOTS_HEADER, PRIVATE_PAGE.ROBOTS_VALUE);
}

/**
 * The {@link cacheDonatePage} helper
 * @description Caches the Donate page with the plain form at the edge, which is the same for everyone
 * @param {AstroGlobal["cache"]} cache - The page route's cache, set before rendering starts so the headers carry it
 * @returns {void}
 */
export function cacheDonatePage(cache: Pick<AstroGlobal["cache"], "enabled" | "set">): void {
  // Without a cache provider, as in development, there is nothing to set
  if (!cache.enabled) {
    return;
  }

  // Keep the page until the next deploy
  cache.set({ maxAge: DONATE_PAGE_CACHE.MAX_AGE });
}
