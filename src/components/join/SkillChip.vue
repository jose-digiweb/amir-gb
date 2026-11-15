<script setup lang="ts">
// Dependencies
import { Check } from "@lucide/vue";
import { computed } from "vue";
import { JOIN_FIELD } from "../../lib/join/constants";

// Types
import type { JoinSkill } from "../../lib/join/types";

/**
 * The {@link Props} type
 * @description The props of the SkillChip component, one thing a volunteer can help with, which they tick on or off
 */
type Props = {
  /** The skill this chip adds. */
  value: JoinSkill;
  /** What it says. */
  label: string;
};

// Read the chip, the skills picked so far, and whether this one is among them
const props = defineProps<Props>();
const picked = defineModel<JoinSkill[]>({ required: true });
const isPicked = computed(() => picked.value.includes(props.value));
</script>

<template>
  <label class="relative flex">
    <input
      v-model="picked"
      type="checkbox"
      :name="JOIN_FIELD.SKILLS"
      :value="props.value"
      class="peer sr-only"
    />
    <span
      class="inline-flex h-control cursor-pointer touch-manipulation items-center gap-1.5 rounded-pill bg-surface px-4 type-button-sm text-text-heading inset-ring inset-ring-border-control transition-colors duration-base select-none peer-checked:bg-selected peer-checked:text-on-selected peer-checked:inset-ring-2 peer-checked:inset-ring-border-strong peer-focus-visible:outline-(length:--focus-width) peer-focus-visible:outline-offset-(--focus-offset) peer-focus-visible:outline-focus peer-focus-visible:outline-solid hover:bg-hover-quiet"
    >
      <Check v-if="isPicked" class="size-icon-sm" aria-hidden="true" />
      {{ props.label }}
    </span>
  </label>
</template>
