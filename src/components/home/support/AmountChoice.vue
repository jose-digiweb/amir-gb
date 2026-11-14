<script setup lang="ts">
// Dependencies
import { DONATE_FIELD } from "../../../lib/donate/constants";

/**
 * The {@link Props} type
 * @description The props of the AmountChoice component, one preset amount of the donation form
 */
type Props = {
  /** The amount in euros. */
  amount: number;
  /** The amount as the page's language writes it. */
  label: string;
};

// Read the amount and how it reads, and the form's picked preset
const props = defineProps<Props>();
const picked = defineModel<number | null>({ required: true });
</script>

<template>
  <label class="relative flex">
    <input
      v-model="picked"
      type="radio"
      :name="DONATE_FIELD.AMOUNT"
      :value="props.amount"
      class="peer sr-only"
    />
    <span
      class="amount grid h-16 flex-1 cursor-pointer place-items-center rounded-md type-h2 font-extrabold text-text-heading transition-colors duration-base select-none peer-checked:bg-selected peer-checked:text-on-selected peer-focus-visible:outline-(length:--focus-width) peer-focus-visible:outline-offset-(--focus-offset) peer-focus-visible:outline-focus peer-focus-visible:outline-solid hover:bg-hover-quiet"
    >
      {{ props.label }}
    </span>
  </label>
</template>

<style scoped>
.amount {
  box-shadow: inset 0 0 0 var(--border-width-control) var(--border-control);
}

:checked + .amount {
  box-shadow: inset 0 0 0 calc(var(--border-width-control) + var(--border-width))
    var(--border-strong);
}
</style>
