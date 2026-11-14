// Dependencies
import { INTL_LOCALE } from "../../i18n/constants";
import {
  AMOUNT_PLACEHOLDER,
  AMOUNT_TEXT,
  CHECKOUT,
  COPY_ACCOUNT,
  DONATE_ERROR,
  DONATION,
  FREQUENCIES,
  FREQUENCY,
  GIFT_RETURN,
  GIFT_STATE,
  WHATSAPP_SHARE,
} from "./constants";

// Types
import type { Locale, Translations } from "../../i18n/types";
import type {
  AmountError,
  CheckoutSessionResult,
  DonateFormCopy,
  Frequency,
  GiftChoice,
  GiftReturn,
  SupportState,
} from "./types";

/**
 * The {@link isFrequency} helper
 * @description Whether a value is one of the {@link FREQUENCIES}, once or monthly
 * @param {string | null | undefined} value - The value to check
 * @returns {boolean} True when the value is once or monthly
 */
export function isFrequency(value: string | null | undefined): value is Frequency {
  return FREQUENCIES.some((frequency) => frequency === value);
}

/**
 * The {@link parseAmount} helper
 * @description Reads an amount in euros as a donor types it, with a comma or a dot for cents and dots or commas between thousands
 * @param {string} text - The typed amount, for example "12,50", "12.50" or "1.000"
 * @returns {number | null} The amount in cents, or null when the text is not an amount
 */
export function parseAmount(text: string): number | null {
  const clean = text.replace(AMOUNT_TEXT.NOISE, AMOUNT_TEXT.EMPTY);
  const parts = clean.split(AMOUNT_TEXT.SEPARATORS);

  // Every part between the marks must be digits
  if (!parts.every((part) => AMOUNT_TEXT.DIGITS.test(part))) {
    return null;
  }

  // Without a mark the text is whole euros
  const last = parts.at(-1) ?? AMOUNT_TEXT.EMPTY;
  if (parts.length === 1) {
    return Number(last) * DONATION.CENTS_PER_EURO;
  }

  // A last group of three digits means the marks only group thousands
  if (last.length === AMOUNT_TEXT.THOUSANDS_GROUP) {
    return Number(parts.join(AMOUNT_TEXT.EMPTY)) * DONATION.CENTS_PER_EURO;
  }

  // A last group of more than two digits is not an amount
  if (last.length > AMOUNT_TEXT.DECIMALS_MAX) {
    return null;
  }

  // Otherwise the last mark separates the cents
  const euros = parts.slice(0, -1).join(AMOUNT_TEXT.EMPTY);
  return Math.round(Number(`${euros}${AMOUNT_TEXT.DOT}${last}`) * DONATION.CENTS_PER_EURO);
}

/**
 * The {@link checkAmount} helper
 * @description Whether an amount can be given online, between the smallest and the largest gift
 * @param {number | null} cents - The amount in cents, or null when none was given
 * @returns {AmountError | undefined} The amount's error, or nothing when it can be given
 */
export function checkAmount(cents: number | null): AmountError | undefined {
  // No amount, or one under the smallest gift
  if (cents === null || cents < DONATION.MIN_CENTS) {
    return DONATE_ERROR.TOO_SMALL;
  }

  // An amount over the largest online gift
  if (cents > DONATION.MAX_CENTS) {
    return DONATE_ERROR.TOO_LARGE;
  }

  // Anything else can be given
  return undefined;
}

/**
 * The {@link getChosenAmount} helper
 * @description The amount a donor chose: the typed amount when there is one, otherwise the preset
 * @param {string | null | undefined} preset - The picked preset in euros
 * @param {string | null | undefined} other - The typed amount
 * @returns {number | null} The amount in cents, or null when neither is an amount
 */
export function getChosenAmount(
  preset: string | null | undefined,
  other: string | null | undefined,
): number | null {
  // A typed amount wins over the preset
  if (other?.trim()) {
    return parseAmount(other);
  }

  // Otherwise the preset, if one was picked
  if (preset) {
    return parseAmount(preset);
  }

  // Neither was given
  return null;
}

/**
 * The {@link formatAmount} helper
 * @description An amount in the page's language: whole euros without cents, others with two decimals
 * @param {Locale} locale - The page's language
 * @param {number} cents - The amount in cents
 * @returns {string} The amount as the language writes it, for example "€25", "€ 12,50" or "25 €"
 */
export function formatAmount(locale: Locale, cents: number): string {
  const isWhole = cents % DONATION.CENTS_PER_EURO === 0;
  const digits = isWhole ? 0 : AMOUNT_TEXT.DECIMALS_MAX;
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: "currency",
    currency: DONATION.CURRENCY,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(cents / DONATION.CENTS_PER_EURO);
}

/**
 * The {@link fillAmount} helper
 * @description Puts an amount into a sentence of copy at its {@link AMOUNT_PLACEHOLDER}
 * @param {string} template - The copy with the placeholder
 * @param {string} amount - The amount as the page's language writes it
 * @returns {string} The sentence with the amount
 */
export function fillAmount(template: string, amount: string): string {
  return template.replace(AMOUNT_PLACEHOLDER, amount);
}

/**
 * The {@link getChoiceLabel} helper
 * @description The donate button's words for a choice: the amount, and "a month" for a monthly gift
 * @param {Locale} locale - The page's language
 * @param {GiftChoice} choice - How often and how much
 * @param {string} onceTemplate - The one-off button copy with its amount placeholder
 * @param {string} monthlyTemplate - The monthly button copy with its amount placeholder
 * @returns {string} The button's words
 */
export function getChoiceLabel(
  locale: Locale,
  choice: GiftChoice,
  onceTemplate: string,
  monthlyTemplate: string,
): string {
  const amount = formatAmount(locale, choice.amountCents);

  // A monthly gift says so after the amount
  if (choice.frequency === FREQUENCY.MONTHLY) {
    return fillAmount(monthlyTemplate, amount);
  }

  // A one-off gift repeats the amount
  return fillAmount(onceTemplate, amount);
}

/**
 * The {@link toEuroText} helper
 * @description An amount in cents as the plain euros a form posts, for example "12.5"
 * @param {number} cents - The amount in cents
 * @returns {string} The amount in euros
 */
export function toEuroText(cents: number): string {
  return String(cents / DONATION.CENTS_PER_EURO);
}

/**
 * The {@link readGiftReturn} helper
 * @description Reads a return from Stripe in a page's address: a Checkout Session, or the choice of a donor who stopped
 * @param {URL} url - The page's address
 * @returns {GiftReturn | undefined} What the return carries, or nothing when the address is not a return
 */
export function readGiftReturn(url: URL): GiftReturn | undefined {
  const value = url.searchParams.get(GIFT_RETURN.PARAM);

  // A Checkout Session id is read from Stripe
  if (value?.startsWith(GIFT_RETURN.SESSION_PREFIX)) {
    return { sessionId: value };
  }

  // Anything but the stopped marker is not a return
  if (value !== GIFT_RETURN.STOPPED) {
    return undefined;
  }

  // A stopped return keeps the choice when it is still a valid one
  const frequency = url.searchParams.get(GIFT_RETURN.FREQUENCY);
  const amountCents = Number(url.searchParams.get(GIFT_RETURN.AMOUNT));
  if (!isFrequency(frequency) || !Number.isInteger(amountCents) || checkAmount(amountCents)) {
    return undefined;
  }
  return { stopped: { frequency, amountCents } };
}

/**
 * The {@link isStoppedReturn} helper
 * @description Whether a return from Stripe is a donor who stopped, rather than a session to read
 * @param {GiftReturn} giftReturn - The return
 * @returns {boolean} True when it carries the stopped choice
 */
export function isStoppedReturn(
  giftReturn: GiftReturn,
): giftReturn is Extract<GiftReturn, { stopped: GiftChoice }> {
  return GIFT_RETURN.STOPPED in giftReturn;
}

/**
 * The {@link getSessionState} helper
 * @description The result a donor sees for a Checkout Session they came back from
 * @param {CheckoutSessionResult} session - The parts of the session that decide it
 * @returns {SupportState} Paid, paid monthly, still on its way, or failed
 */
export function getSessionState(session: CheckoutSessionResult): SupportState {
  const amountCents = session.amountTotal ?? 0;

  // A session that did not complete charged nothing
  if (session.status !== CHECKOUT.STATUS_COMPLETE || amountCents === 0) {
    return { state: GIFT_STATE.FAILED };
  }

  // A monthly gift has started, even while its first SEPA debit waits for the bank
  if (session.mode === CHECKOUT.MODE_SUBSCRIPTION) {
    return { state: GIFT_STATE.PAID_MONTHLY, amountCents };
  }

  // A one-off gift still waiting for the bank, as SEPA Direct Debit does
  if (session.paymentStatus === CHECKOUT.PAYMENT_UNPAID) {
    return { state: GIFT_STATE.PROCESSING, amountCents };
  }

  // A paid one-off gift
  return { state: GIFT_STATE.PAID, amountCents };
}

/**
 * The {@link getReturnUrls} helper
 * @description Where Stripe sends a donor back: the Support section of their page, with the session or with their choice when they stop
 * @param {string} pageUrl - The full address of the page's home, without query or hash
 * @param {GiftChoice} choice - The donor's choice
 * @returns {{ success: string; cancel: string }} The success and cancel addresses for Checkout
 */
export function getReturnUrls(
  pageUrl: string,
  choice: GiftChoice,
): { success: string; cancel: string } {
  // Stripe fills in the session id, so the placeholder stays unencoded
  const success = `${pageUrl}?${GIFT_RETURN.PARAM}=${GIFT_RETURN.SESSION_PLACEHOLDER}${GIFT_RETURN.HASH}`;

  // A donor who stops comes back with the choice they made
  const stopped = new URLSearchParams({
    [GIFT_RETURN.PARAM]: GIFT_RETURN.STOPPED,
    [GIFT_RETURN.FREQUENCY]: choice.frequency,
    [GIFT_RETURN.AMOUNT]: String(choice.amountCents),
  });
  return { success, cancel: `${pageUrl}?${stopped.toString()}${GIFT_RETURN.HASH}` };
}

/**
 * The {@link getWhatsAppShareHref} helper
 * @description A link that opens WhatsApp with a message and the page's address, for the donor to send to a friend
 * @param {string} text - The message in the page's language
 * @param {string} pageUrl - The address to share
 * @returns {string} The WhatsApp link
 */
export function getWhatsAppShareHref(text: string, pageUrl: string): string {
  const query = new URLSearchParams({ [WHATSAPP_SHARE.PARAM]: `${text} ${pageUrl}` });
  return `${WHATSAPP_SHARE.URL}?${query.toString()}`;
}

/**
 * The {@link getDonateFormCopy} helper
 * @description The donation form's copy in the page's language, for the Vue island that cannot read the dictionaries itself
 * @param {Translations} t - The page's copy
 * @returns {DonateFormCopy} The form's words
 */
export function getDonateFormCopy(t: Translations): DonateFormCopy {
  return {
    form: t["donate.form"],
    frequency: t["donate.frequency"],
    once: t["donate.once"],
    monthly: t["donate.monthly"],
    amount: t["donate.amount"],
    other: t["donate.other"],
    otherLabel: t["donate.otherLabel"],
    submit: t["donate.submit"],
    submitOnce: t["donate.submitOnce"],
    submitMonthly: t["donate.submitMonthly"],
    taking: t["donate.taking"],
    secure: t["donate.secure"],
    secureMonthly: t["donate.secureMonthly"],
    tooSmall: t["donate.tooSmall"],
    tooLarge: t["donate.tooLarge"],
    startFailed: t["donate.startFailed"],
  };
}

/**
 * The {@link enableCopyAccount} helper
 * @description Lets the bank transfer bar's button copy the account number and show it was copied for a few seconds
 * @returns {void}
 */
export function enableCopyAccount(): void {
  for (const root of document.querySelectorAll<HTMLElement>(COPY_ACCOUNT.ROOT)) {
    const button = root.querySelector<HTMLButtonElement>(COPY_ACCOUNT.BUTTON);
    button?.addEventListener(COPY_ACCOUNT.CLICK, () => copyAccount(root));
  }
}

/**
 * The {@link copyAccount} helper
 * @description Copies the account number without spaces and marks the bar copied until the reset
 * @param {HTMLElement} root - The bank transfer bar
 * @returns {Promise<void>}
 */
async function copyAccount(root: HTMLElement): Promise<void> {
  const iban = (root.getAttribute(COPY_ACCOUNT.VALUE_ATTRIBUTE) ?? "").replace(
    COPY_ACCOUNT.SPACES,
    "",
  );

  // A blocked clipboard leaves the bar as it was, the number stays readable to copy by hand
  try {
    await navigator.clipboard.writeText(iban);
  } catch {
    return;
  }

  // Show the copied state, then return to the copy button
  root.dataset[COPY_ACCOUNT.COPIED] = "";
  window.setTimeout(() => {
    delete root.dataset[COPY_ACCOUNT.COPIED];
  }, COPY_ACCOUNT.RESET_MS);
}
