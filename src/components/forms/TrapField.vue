<script setup lang="ts">
// Dependencies
import { FORM_TRAP_FIELD } from "../../lib/forms/constants";

/**
 * The TrapField component
 * @description The hidden field only robots fill in; a form that posts it filled is told it worked and nothing is sent
 */

// Read what a robot typed, which people never see
const value = defineModel<string>({ required: true });
</script>

<template>
  <input
    v-model="value"
    type="text"
    :name="FORM_TRAP_FIELD"
    tabindex="-1"
    autocomplete="off"
    aria-hidden="true"
    class="hidden"
  />
</template>
