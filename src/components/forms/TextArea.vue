<script setup lang="ts">
// Dependencies
import { computed } from "vue";
import { FIELD_ID_SUFFIX } from "./constants";

// Components
import FieldError from "./FieldError.vue";

/**
 * The {@link Props} type
 * @description The props of the TextArea component, a labelled box for a few lines of text in a form, with its error
 */
type Props = {
  /** The box's id, which its label and error hang from. */
  id: string;
  /** The field the text posts as. */
  name: string;
  /** What it asks. */
  label: string;
  /** The quiet note after the label on a box that can stay empty. */
  optionalNote?: string;
  /** The longest text it takes. */
  maxlength: number;
  /** An example in the empty box. */
  placeholder?: string;
  /** What to fix, once Send was pressed. */
  error?: string;
  /** The field has to be filled in, which screen readers announce. */
  required?: boolean;
};

// Read the box and its typed text
const props = defineProps<Props>();
const value = defineModel<string>({ required: true });

// The error describes the box when it shows
const errorId = computed(() => `${props.id}${FIELD_ID_SUFFIX.ERROR}`);
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="props.id"
      class="flex flex-wrap items-baseline gap-x-1 type-field-label text-text-heading"
    >
      <span>{{ props.label }}</span>
      <span v-if="props.optionalNote" class="font-text font-normal text-text-muted">
        {{ props.optionalNote }}
      </span>
    </label>
    <textarea
      :id="props.id"
      v-model="value"
      :name="props.name"
      rows="5"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-required="props.required ? 'true' : undefined"
      :aria-describedby="props.error ? errorId : undefined"
      class="min-h-36 resize-y rounded-md bg-surface px-4 py-3 type-body text-text inset-ring inset-ring-border-control placeholder:text-text-muted aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger"
    ></textarea>
    <FieldError v-if="props.error" :id="errorId" :text="props.error" />
  </div>
</template>
