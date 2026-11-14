// Dependencies
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { DONATE_ERROR, DONATION, FREQUENCY, PAGE_SHOW } from "../../../lib/donate/constants";
import { checkAmount, getChoiceLabel, getChosenAmount } from "../../../lib/donate/helpers";

// Types
import type { Locale } from "../../../i18n/types";
import type { DonateError, DonateFormCopy, Frequency } from "../../../lib/donate/types";

/**
 * The {@link DonateFormOptions} type
 * @description What the donation form starts from: the page's language, its copy and the error of a failed try
 */
type DonateFormOptions = {
  locale: Locale;
  copy: DonateFormCopy;
  initialError?: DonateError;
};

/**
 * The {@link useDonateForm} composable
 * @description The donation form's state: how often, the preset or typed amount, its error, the button's words, and the wait while Stripe opens
 * @param {DonateFormOptions} options - The page's language, the copy and a starting error
 * @returns {ReturnType<typeof useDonateForm>} The form's state and its submit handler
 */
export function useDonateForm({ locale, copy, initialError }: DonateFormOptions) {
  const frequency = ref<Frequency>(FREQUENCY.ONCE);
  const preset = ref<number | null>(DONATION.DEFAULT_AMOUNT);
  const other = ref("");
  const error = ref<DonateError | undefined>(initialError);
  const isBusy = ref(false);

  // The amount in cents, from the typed field when it has text, otherwise from the preset
  const amountCents = computed(() => getChosenAmount(preset.value?.toString(), other.value));

  // The amount's own error, shown under the field
  const amountError = computed(() => {
    // Stripe not answering is not the amount's fault
    if (error.value === DONATE_ERROR.START_FAILED) {
      return undefined;
    }

    // Any other error is about the amount
    return error.value;
  });

  // The error's sentence in the page's language
  const errorText = computed(() => {
    // Over the largest gift
    if (error.value === DONATE_ERROR.TOO_LARGE) {
      return copy.tooLarge;
    }

    // Under the smallest gift, or no amount
    if (error.value === DONATE_ERROR.TOO_SMALL) {
      return copy.tooSmall;
    }

    // Stripe did not start the payment
    return copy.startFailed;
  });

  // The button repeats the choice, says Donate alone without a valid amount, and says where it goes while it waits
  const submitLabel = computed(() => {
    // While Stripe opens
    if (isBusy.value) {
      return copy.taking;
    }

    // Without an amount that can be given
    if (amountError.value || checkAmount(amountCents.value)) {
      return copy.submit;
    }

    // The choice's amount, with "a month" for a monthly gift
    const choice = { frequency: frequency.value, amountCents: amountCents.value ?? 0 };
    return getChoiceLabel(locale, choice, copy.submitOnce, copy.submitMonthly);
  });

  // A monthly gift adds that it can stop any time
  const secureLabel = computed(() => {
    // Monthly
    if (frequency.value === FREQUENCY.MONTHLY) {
      return copy.secureMonthly;
    }

    // Once
    return copy.secure;
  });

  // Typing an amount unpicks the presets and clears an old error
  watch(other, (text) => {
    // Text in the field unpicks the presets
    if (text.trim()) {
      preset.value = null;
    }

    // Any change clears the old error
    error.value = undefined;
  });

  // Picking a preset empties the typed field
  watch(preset, (amount) => {
    // Only a picked preset empties the field
    if (amount !== null) {
      other.value = "";
    }
  });

  /**
   * The {@link onSubmit} handler
   * @description Stops a second press and an amount that cannot be given, otherwise lets the form go to Stripe and shows the wait
   * @param {SubmitEvent} event - The form's submit
   * @returns {void}
   */
  function onSubmit(event: SubmitEvent): void {
    // A second press while Stripe opens does nothing
    if (isBusy.value) {
      event.preventDefault();
      return;
    }

    // An amount that cannot be given stays here with its reason
    const reason = checkAmount(amountCents.value);
    if (reason) {
      event.preventDefault();
      error.value = reason;
      return;
    }

    // Anything else goes to Stripe
    error.value = undefined;
    isBusy.value = true;
  }

  /**
   * The {@link onPageShow} handler
   * @description Ends the wait when the donor comes back to this page with the back button
   * @param {PageTransitionEvent} event - The page being shown again
   * @returns {void}
   */
  function onPageShow(event: PageTransitionEvent): void {
    // A page restored from the browser's history is no longer waiting
    if (event.persisted) {
      isBusy.value = false;
    }
  }

  // Listen for the back button only while the form is on the page
  onMounted(() => window.addEventListener(PAGE_SHOW, onPageShow));
  onBeforeUnmount(() => window.removeEventListener(PAGE_SHOW, onPageShow));

  // Everything the form renders and its submit handler
  return {
    frequency,
    preset,
    other,
    error,
    amountError,
    errorText,
    isBusy,
    submitLabel,
    secureLabel,
    onSubmit,
  };
}
