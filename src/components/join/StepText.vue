<script setup lang="ts">
// Types
import type { FeeSentence } from "./types";

/**
 * The {@link Props} type
 * @description The props of the StepText component, a step's sentence with the fee marked as a fact still to come
 */
type Props = {
  /** The sentence, cut where the fee goes. */
  sentence: FeeSentence;
};

// Read the sentence
const props = defineProps<Props>();
</script>

<template>
  <span class="type-body-sm text-pretty text-text"
    >{{ props.sentence.before
    }}<mark v-if="props.sentence.fee" class="rounded-sm bg-warning-bg px-1 text-warning">{{
      props.sentence.fee
    }}</mark
    >{{ props.sentence.after }}</span
  >
</template>
