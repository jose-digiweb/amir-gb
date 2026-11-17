<script setup lang="ts">
// Dependencies
import { computed } from "vue";
import { FIELD_ID_SUFFIX } from "./constants";

// Components
import FieldError from "./FieldError.vue";

/**
 * The {@link Props} type
 * @description The props of the ConsentField component, the tick that gives leave to use the details, with a link to the privacy page
 */
type Props = {
  /** The checkbox's id, which its label and error hang from. */
  id: string;
  /** The field the tick posts as. */
  name: string;
  /** What the visitor agrees to. */
  text: string;
  /** The link's words. */
  linkLabel: string;
  /** The privacy page. */
  href: string;
  /** What to fix, once Send was pressed. */
  error?: string;
  /** The field has to be filled in, which screen readers announce. */
  required?: boolean;
};

// Read the tick and whether it is ticked
const props = defineProps<Props>();
const ticked = defineModel<boolean>({ required: true });

// The error describes the checkbox when it shows
const errorId = computed(() => `${props.id}${FIELD_ID_SUFFIX.ERROR}`);
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-start gap-3">
      <input
        :id="props.id"
        v-model="ticked"
        type="checkbox"
        :name="props.name"
        :aria-invalid="props.error ? 'true' : undefined"
        :aria-required="props.required ? 'true' : undefined"
        :aria-describedby="props.error ? errorId : undefined"
        class="mt-0.5 size-6 shrink-0 cursor-pointer rounded-sm accent-text-heading"
      />
      <label :for="props.id" class="type-body-sm text-text">
        {{ props.text }}
        <a :href="props.href" class="font-semibold text-link underline underline-offset-3">
          {{ props.linkLabel }}
        </a>
      </label>
    </div>
    <FieldError v-if="props.error" :id="errorId" :text="props.error" />
  </div>
</template>
