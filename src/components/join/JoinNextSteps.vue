<script setup lang="ts">
// Components
import StepText from "./StepText.vue";

// Types
import type { JoinStepCopy } from "./types";

/**
 * The {@link Props} type
 * @description The props of the JoinNextSteps component, What happens next for a member or a volunteer, under its opener
 */
type Props = {
  /** The steps for the mode the form is on. */
  steps: JoinStepCopy[];
};

// Read the steps; the opener comes from the page as the default slot
const props = defineProps<Props>();
</script>

<template>
  <div class="flex flex-col gap-4">
    <slot />
    <ol class="flex flex-col gap-4">
      <li v-for="(step, index) in props.steps" :key="step.title" class="flex gap-4">
        <span
          class="grid size-10 shrink-0 place-items-center rounded-full bg-surface type-h4 font-extrabold text-text-heading inset-ring-2 inset-ring-accent"
        >
          {{ index + 1 }}
        </span>
        <span class="flex flex-col gap-0.5 pt-2">
          <span class="type-h4 text-text-heading">{{ step.title }}</span>
          <StepText :sentence="step.sentence" />
        </span>
      </li>
    </ol>
  </div>
</template>
