<script setup lang="ts">
// Dependencies
import { JOIN_FIELD } from "../../lib/join/constants";

// Types
import type { JoinMode } from "../../lib/join/types";

/**
 * The {@link Props} type
 * @description The props of the JoinModeChoice component, one side of the Member or Volunteer switch
 */
type Props = {
  /** The radio's id, which the page's mode links point at. */
  id: string;
  /** The mode this side picks. */
  value: JoinMode;
  /** Its name. */
  label: string;
};

// Read the side's mode and name, and the switch's picked mode
const props = defineProps<Props>();
const picked = defineModel<JoinMode>({ required: true });
</script>

<template>
  <label class="relative flex">
    <input
      :id="props.id"
      v-model="picked"
      type="radio"
      :name="JOIN_FIELD.MODE"
      :value="props.value"
      class="peer sr-only scroll-mt-32"
    />
    <span
      class="grid h-control flex-1 cursor-pointer touch-manipulation place-items-center rounded-pill type-button text-text-muted transition-colors duration-base select-none peer-checked:bg-surface peer-checked:text-text-heading peer-checked:shadow-sm peer-focus-visible:outline-(length:--focus-width) peer-focus-visible:outline-offset-(--focus-offset) peer-focus-visible:outline-focus peer-focus-visible:outline-solid"
    >
      {{ props.label }}
    </span>
  </label>
</template>
