// Types
import type { DONATE_ERROR, FREQUENCY, GIFT_STATE } from "./constants";

/**
 * The {@link Frequency} type
 * @description One of the {@link FREQUENCY} values
 */
export type Frequency = (typeof FREQUENCY)[keyof typeof FREQUENCY];

/**
 * The {@link DonateError} type
 * @description One of the {@link DONATE_ERROR} values
 */
export type DonateError = (typeof DONATE_ERROR)[keyof typeof DONATE_ERROR];

/**
 * The {@link AmountError} type
 * @description An error that belongs to the amount itself, shown under the field
 */
export type AmountError = Exclude<DonateError, typeof DONATE_ERROR.START_FAILED>;

/**
 * The {@link GiftChoice} type
 * @description What a donor chose: how often, and how much in cents
 */
export type GiftChoice = {
  frequency: Frequency;
  amountCents: number;
};

/**
 * The {@link SupportState} type
 * @description What the Support section shows: the form, with an error when the last try failed, or the result of a return from Stripe
 */
export type SupportState =
  | { state: typeof GIFT_STATE.FORM; error?: DonateError }
  | { state: typeof GIFT_STATE.PAID; amountCents: number }
  | { state: typeof GIFT_STATE.PAID_MONTHLY; amountCents: number }
  | { state: typeof GIFT_STATE.PROCESSING; amountCents: number }
  | { state: typeof GIFT_STATE.STOPPED; choice: GiftChoice }
  | { state: typeof GIFT_STATE.FAILED };

/**
 * The {@link GiftReturn} type
 * @description What a return from Stripe carries: a Checkout Session to read, or the choice of a donor who stopped
 */
export type GiftReturn = { sessionId: string } | { stopped: GiftChoice };

/**
 * The {@link CheckoutSessionResult} type
 * @description The parts of a Checkout Session that decide the result a donor sees
 */
export type CheckoutSessionResult = {
  mode: string;
  status: string | null;
  paymentStatus: string;
  amountTotal: number | null;
};

/**
 * The {@link DonateFormCopy} type
 * @description The donation form's copy in the page's language, passed to the Vue island
 */
export type DonateFormCopy = {
  form: string;
  frequency: string;
  once: string;
  monthly: string;
  amount: string;
  other: string;
  otherLabel: string;
  submit: string;
  submitOnce: string;
  submitMonthly: string;
  taking: string;
  secure: string;
  secureMonthly: string;
  tooSmall: string;
  tooLarge: string;
  startFailed: string;
};
