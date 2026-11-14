<script setup lang="ts">
// Dependencies
import { DONATE_FIELD } from "../../../lib/donate/constants";

// Types
import type { Frequency } from "../../../lib/donate/types";

/**
 * The {@link Props} type
 * @description The props of the FrequencyChoice component, one side of the Once or Monthly switch
 */
type Props = {
  /** The frequency this side picks. */
  value: Frequency;
  /** Its name. */
  label: string;
};

// Read the side's frequency and name, and the switch's picked frequency
const props = defineProps<Props>();
const picked = defineModel<Frequency>({ required: true });
</script>

<template>
  <label class="relative flex">
    <input
      v-model="picked"
      type="radio"
      :name="DONATE_FIELD.FREQUENCY"
      :value="props.value"
      class="peer sr-only"
    />
    <span
      class="grid h-control flex-1 cursor-pointer place-items-center rounded-pill type-button text-text-muted transition-colors duration-base select-none peer-checked:bg-surface peer-checked:text-text-heading peer-checked:shadow-sm peer-focus-visible:outline-(length:--focus-width) peer-focus-visible:outline-offset-(--focus-offset) peer-focus-visible:outline-focus peer-focus-visible:outline-solid"
    >
      {{ props.label }}
    </span>
  </label>
</template>
