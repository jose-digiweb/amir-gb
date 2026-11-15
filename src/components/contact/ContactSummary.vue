<script setup lang="ts">
// Dependencies
import { CircleAlert } from "@lucide/vue";
import { CONTACT_FORM_ID } from "./constants";

/**
 * The {@link Props} type
 * @description The props of the ContactSummary component, the notice at the top of the form that names what to check
 */
type Props = {
  /** How many things to check, in words. */
  title: string;
  /** The fields to check, in one sentence. */
  text: string;
};

// Read the notice
const props = defineProps<Props>();
</script>

<template>
  <div
    :id="CONTACT_FORM_ID.SUMMARY"
    tabindex="-1"
    role="alert"
    class="flex gap-3 rounded-md bg-danger-bg p-4 text-text-heading"
  >
    <CircleAlert class="mt-0.5 size-icon-md shrink-0 text-danger" aria-hidden="true" />
    <div class="flex flex-col gap-1">
      <p class="type-h4">{{ props.title }}</p>
      <p class="type-body-sm text-text">{{ props.text }}</p>
    </div>
  </div>
</template>
