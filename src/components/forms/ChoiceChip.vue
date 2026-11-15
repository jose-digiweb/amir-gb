<script setup lang="ts">
// Dependencies
import { Check } from "@lucide/vue";

/**
 * The {@link Props} type
 * @description The props of the ChoiceChip component, one chip of a single choice in a form
 */
type Props = {
  /** The field the choice posts as. */
  name: string;
  /** What this chip picks. */
  value: string;
  /** What it says. */
  label: string;
};

// Read the chip, and the choice's picked value
const props = defineProps<Props>();
const picked = defineModel<string>({ required: true });
</script>

<template>
  <label class="relative flex">
    <input
      v-model="picked"
      type="radio"
      :name="props.name"
      :value="props.value"
      class="peer sr-only"
    />
    <span
      class="inline-flex h-control cursor-pointer touch-manipulation items-center gap-1.5 rounded-pill bg-surface px-4 type-button-sm text-text-heading inset-ring inset-ring-border-control transition-colors duration-base select-none peer-checked:bg-selected peer-checked:text-on-selected peer-checked:inset-ring-2 peer-checked:inset-ring-border-strong peer-focus-visible:outline-(length:--focus-width) peer-focus-visible:outline-offset-(--focus-offset) peer-focus-visible:outline-focus peer-focus-visible:outline-solid hover:bg-hover-quiet"
    >
      <Check v-if="picked === props.value" class="size-icon-sm" aria-hidden="true" />
      {{ props.label }}
    </span>
  </label>
</template>
