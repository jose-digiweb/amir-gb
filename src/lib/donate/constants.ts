// Dependencies
import { LOCALE } from "../../i18n/constants";

/**
 * The {@link DONATION} constant
 * @description The donation widget's preset amounts in euros, the one picked to start with, and the limits of a gift in cents
 */
export const DONATION = {
  AMOUNTS: [10, 25, 50],
  DEFAULT_AMOUNT: 25,
  CURRENCY: "EUR",
  CENTS_PER_EURO: 100,
  MIN_CENTS: 100,
  MAX_CENTS: 1_000_000,
} as const;

/**
 * The {@link FREQUENCY} constant
 * @description How often a gift is given
 */
export const FREQUENCY = {
  ONCE: "once",
  MONTHLY: "monthly",
} as const;

/**
 * The {@link FREQUENCIES} constant
 * @description Every frequency, in the order the switch shows them
 */
export const FREQUENCIES = [FREQUENCY.ONCE, FREQUENCY.MONTHLY] as const;

/**
 * The {@link DONATE_ERROR} constant
 * @description Why a gift could not go to Stripe: an amount under the smallest or over the largest, or Stripe not answering
 */
export const DONATE_ERROR = {
  TOO_SMALL: "too-small",
  TOO_LARGE: "too-large",
  START_FAILED: "start-failed",
} as const;

/**
 * The {@link DONATE_FIELD} constant
 * @description The names of the donation form's fields, as the form posts them
 */
export const DONATE_FIELD = {
  FREQUENCY: "frequency",
  AMOUNT: "amount",
  OTHER: "other",
  LOCALE: "locale",
} as const;

/**
 * The {@link AMOUNT_TEXT} constant
 * @description What a typed amount may hold, and the marks it may carry: a euro sign, spaces, dots and commas
 */
export const AMOUNT_TEXT = {
  NOISE: /[€\s]/g,
  SEPARATORS: /[.,]/g,
  DIGITS: /^\d+$/,
  DECIMALS_MAX: 2,
  THOUSANDS_GROUP: 3,
  EMPTY: "",
  DOT: ".",
} as const;

/**
 * The {@link PAGE_SHOW} constant
 * @description The event a page fires when the back button shows it again from the browser's history
 */
export const PAGE_SHOW = "pageshow";

/**
 * The {@link AMOUNT_PLACEHOLDER} constant
 * @description The mark in a sentence of copy that the amount replaces
 */
export const AMOUNT_PLACEHOLDER = "{amount}";

/**
 * The {@link GIFT_STATE} constant
 * @description What the Support section shows: the form, or the result of a return from Stripe
 */
export const GIFT_STATE = {
  FORM: "form",
  PAID: "paid",
  PAID_MONTHLY: "paid-monthly",
  PROCESSING: "processing",
  STOPPED: "stopped",
  FAILED: "failed",
} as const;

/**
 * The {@link GIFT_RETURN} constant
 * @description The query a return from Stripe carries: the session, or the stopped marker with the choice
 */
export const GIFT_RETURN = {
  PARAM: "gift",
  STOPPED: "stopped",
  FREQUENCY: "frequency",
  AMOUNT: "amount",
  SESSION_PREFIX: "cs_",
  SESSION_PLACEHOLDER: "{CHECKOUT_SESSION_ID}",
  HASH: "#support",
} as const;

/**
 * The {@link CHECKOUT} constant
 * @description The fixed parts of a Stripe Checkout Session for a gift
 */
export const CHECKOUT = {
  PRODUCT: "amir_gb_gift",
  CURRENCY: "eur",
  QUANTITY: 1,
  MODE_PAYMENT: "payment",
  MODE_SUBSCRIPTION: "subscription",
  INTERVAL: "month",
  SUBMIT_TYPE: "donate",
  INTEGRATION: "amir-gb-gift-qhwtrbkz",
  STATUS_COMPLETE: "complete",
  PAYMENT_UNPAID: "unpaid",
} as const;

/**
 * The {@link CHECKOUT_LOCALE} constant
 * @description The language Stripe Checkout shows for each of the site's languages
 */
export const CHECKOUT_LOCALE = {
  [LOCALE.NL]: "nl",
  [LOCALE.EN]: "en",
  [LOCALE.PT]: "pt",
} as const;

/**
 * The {@link WHATSAPP_SHARE} constant
 * @description WhatsApp's link that opens a new message with a text, and the query it reads
 */
export const WHATSAPP_SHARE = {
  URL: "https://wa.me/",
  PARAM: "text",
} as const;

/**
 * The {@link STRIPE_LOG} constant
 * @description What the Worker's logs say when Stripe refuses or does not answer
 */
export const STRIPE_LOG = {
  START_FAILED: "Stripe Checkout could not start a gift",
  READ_FAILED: "Stripe Checkout could not read a returned session",
} as const;

/**
 * The {@link ORIGIN_HEADER} constant
 * @description The request header that names the site a form was posted from
 */
export const ORIGIN_HEADER = "origin";

/**
 * The {@link PRIVATE_PAGE} constant
 * @description The cache header for a page that shows one donor's gift, so no cache keeps it
 */
export const PRIVATE_PAGE = {
  HEADER: "Cache-Control",
  VALUE: "private, no-store",
} as const;

/**
 * The {@link BANK_TRANSFER} constant
 * @description AMIR-GB's Rabobank account for gifts by bank transfer; a placeholder in the real number's shape until AMIR sends it
 */
export const BANK_TRANSFER = {
  IBAN: "NL00 RABO 0000 0000 00",
} as const;

/**
 * The {@link COPY_ACCOUNT} constant
 * @description The copy button's hooks and how long its copied state stays, in milliseconds
 */
export const COPY_ACCOUNT = {
  ROOT: "[data-copy-account]",
  BUTTON: "[data-copy-account-button]",
  COPIED: "copied",
  VALUE_ATTRIBUTE: "data-copy-account",
  RESET_MS: 3000,
  CLICK: "click",
  SPACES: /\s+/g,
} as const;
