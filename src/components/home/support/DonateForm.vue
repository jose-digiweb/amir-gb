<script setup lang="ts">
// Dependencies
import { CircleAlert, Heart, LoaderCircle, Lock } from "@lucide/vue";
import { DONATE_FIELD, DONATION, FREQUENCY } from "../../../lib/donate/constants";
import { formatAmount } from "../../../lib/donate/helpers";
import { useDonateForm } from "./useDonateForm";

// Components
import AmountChoice from "./AmountChoice.vue";
import FrequencyChoice from "./FrequencyChoice.vue";

// Types
import type { Locale } from "../../../i18n/types";
import type { DonateError, DonateFormCopy } from "../../../lib/donate/types";

/**
 * The {@link Props} type
 * @description The props of the DonateForm component, the calm donation form: how often, how much, one button that goes to Stripe
 */
type Props = {
  /** The page's language, for amounts and for Stripe. */
  locale: Locale;
  /** The form's copy in that language. */
  copy: DonateFormCopy;
  /** Where the form posts: the donate action on this page. */
  action: string;
  /** The error of a try that came back from the server. */
  initialError?: DonateError;
};

// Read the props, the form's state and the presets as the page's language writes them
const props = defineProps<Props>();
const form = useDonateForm({
  locale: props.locale,
  copy: props.copy,
  initialError: props.initialError,
});
const {
  frequency,
  preset,
  other,
  amountError,
  error,
  errorText,
  isBusy,
  submitLabel,
  secureLabel,
} = form;
const presets = DONATION.AMOUNTS.map((amount) => ({
  amount,
  label: formatAmount(props.locale, amount * DONATION.CENTS_PER_EURO),
}));
</script>

<template>
  <form
    method="post"
    :action="props.action"
    :aria-label="props.copy.form"
    class="flex flex-col gap-4 rounded-xl bg-surface p-6 text-text shadow-md desktop:gap-5 desktop:p-8"
    @submit="form.onSubmit"
  >
    <input type="hidden" :name="DONATE_FIELD.LOCALE" :value="props.locale" />
    <fieldset :class="{ 'opacity-50': isBusy }">
      <legend class="sr-only">{{ props.copy.frequency }}</legend>
      <div class="grid grid-cols-2 rounded-pill bg-surface-sunken p-1">
        <FrequencyChoice v-model="frequency" :value="FREQUENCY.ONCE" :label="props.copy.once" />
        <FrequencyChoice
          v-model="frequency"
          :value="FREQUENCY.MONTHLY"
          :label="props.copy.monthly"
        />
      </div>
    </fieldset>
    <fieldset :class="{ 'opacity-50': isBusy }">
      <legend class="sr-only">{{ props.copy.amount }}</legend>
      <div class="grid grid-cols-3 gap-2.5">
        <AmountChoice
          v-for="choice in presets"
          :key="choice.amount"
          v-model="preset"
          :amount="choice.amount"
          :label="choice.label"
        />
      </div>
    </fieldset>
    <label
      class="flex h-control-lg items-center gap-2 rounded-pill bg-surface-sunken px-5 font-semibold text-text-muted focus-within:outline-(length:--focus-width) focus-within:outline-offset-(--focus-offset) focus-within:outline-focus focus-within:outline-solid"
      :class="{
        'opacity-50': isBusy,
        'text-text-heading ring-2 ring-danger ring-inset': amountError,
      }"
    >
      <span aria-hidden="true">€</span>
      <input
        v-model="other"
        type="text"
        :name="DONATE_FIELD.OTHER"
        inputmode="decimal"
        autocomplete="off"
        :placeholder="props.copy.other"
        :aria-label="props.copy.otherLabel"
        :aria-invalid="amountError ? 'true' : undefined"
        :aria-describedby="amountError ? 'donate-error' : undefined"
        class="h-full min-w-0 flex-1 bg-transparent type-body text-text outline-none placeholder:text-text-muted"
      />
    </label>
    <p
      v-if="amountError"
      id="donate-error"
      role="alert"
      class="-mt-1.5 flex items-center gap-2 px-2 type-body-sm font-semibold text-danger"
    >
      <CircleAlert class="size-icon-sm shrink-0" aria-hidden="true" />
      {{ errorText }}
    </p>
    <button
      type="submit"
      :aria-busy="isBusy ? 'true' : undefined"
      class="inline-flex h-control-lg w-full shrink-0 touch-manipulation items-center justify-center gap-2 rounded-pill bg-primary px-6 type-button whitespace-nowrap text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed [&_svg]:size-icon-md [&_svg]:shrink-0"
    >
      <LoaderCircle v-if="isBusy" class="motion-safe:animate-spin" aria-hidden="true" />
      <Heart v-else aria-hidden="true" />
      {{ submitLabel }}
    </button>
    <p
      v-if="error && !amountError"
      role="alert"
      class="-mt-1.5 flex items-start gap-2 px-2 type-body-sm font-semibold text-danger"
    >
      <CircleAlert class="mt-0.5 size-icon-sm shrink-0" aria-hidden="true" />
      {{ errorText }}
    </p>
    <p class="flex items-center justify-center gap-1.5 type-small text-text-muted">
      <Lock class="size-icon-sm" aria-hidden="true" />
      {{ secureLabel }}
    </p>
  </form>
</template>
