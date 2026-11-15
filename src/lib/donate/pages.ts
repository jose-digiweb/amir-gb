// Dependencies
import { getPagePath } from "../../i18n/helpers";
import { ROUTE } from "../../site/constants";
import { withTrailingSlash } from "../../site/helpers";

// Types
import type { GiftPageRoute } from "./types";

/**
 * The {@link getGiftPageRoute} helper
 * @description The page a gift was started from, so Stripe sends the donor back to it: the Donate page, or the home page for any other path
 * @param {string} pathname - The path the form was posted to, in any language
 * @returns {GiftPageRoute} The page's route in the default language
 */
export function getGiftPageRoute(pathname: string): GiftPageRoute {
  // A gift from the Donate page, in any language, returns there
  if (withTrailingSlash(getPagePath(pathname)) === ROUTE.DONATE) {
    return ROUTE.DONATE;
  }

  // Any other gift returns to the home page's Support section
  return ROUTE.HOME;
}
