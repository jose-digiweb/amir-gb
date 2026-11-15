<script setup lang="ts">
// Dependencies
import { CircleAlert } from "@lucide/vue";

/**
 * The {@link Props} type
 * @description The props of the FieldError component, the sentence under a field that says what to fix
 */
type Props = {
  /** The id the field points at with aria-describedby. */
  id: string;
  /** What to fix. */
  text: string;
};

// Read the sentence
const props = defineProps<Props>();
</script>

<template>
  <p :id="props.id" class="flex items-start gap-2 type-body-sm font-semibold text-danger">
    <CircleAlert class="mt-0.5 size-icon-sm shrink-0" aria-hidden="true" />
    {{ props.text }}
  </p>
</template>
