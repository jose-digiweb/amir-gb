// Dependencies
import { LANGUAGE_TAG } from "../../i18n/constants";

/**
 * The {@link RETURN_TONE} constant
 * @description The colour of a return card's round mark: green for a gift, neutral for a stop, red for a failure
 */
export const RETURN_TONE = {
  SUCCESS: "success",
  NEUTRAL: "neutral",
  DANGER: "danger",
} as const;

/**
 * The {@link GIFT_THANKS_OPENER_LANGS} constant
 * @description The language of each thank you in a gift's label: English, Dutch and Kriolu
 */
export const GIFT_THANKS_OPENER_LANGS = [
  LANGUAGE_TAG.ENGLISH,
  LANGUAGE_TAG.DUTCH,
  LANGUAGE_TAG.KRIOL,
] as const;
