<script setup lang="ts">
// Dependencies
import { computed } from "vue";
import { FIELD_ID_SUFFIX } from "./constants";

// Components
import FieldError from "./FieldError.vue";

// Types
import type { InputHTMLAttributes } from "vue";

/**
 * The {@link Props} type
 * @description The props of the TextField component, one labelled line of text in a form, with its hint and its error
 */
type Props = {
  /** The input's id, which its label, hint and error hang from. */
  id: string;
  /** The field the value posts as. */
  name: string;
  /** What it asks. */
  label: string;
  /** The quiet note after the label on a field that can stay empty. */
  optionalNote?: string;
  /** The kind of text, which picks the phone's keyboard. */
  type?: InputHTMLAttributes["type"];
  /** What the browser may fill in. */
  autocomplete?: string;
  /** The keyboard a phone shows, when the type alone does not pick it. */
  inputmode?: InputHTMLAttributes["inputmode"];
  /** The longest value it takes. */
  maxlength: number;
  /** An example in the empty field. */
  placeholder?: string;
  /** A line under the field that helps answer it. */
  hint?: string;
  /** What to fix, once Send was pressed. */
  error?: string;
  /** The field has to be filled in: screen readers announce it, and the browser checks it until the form's script takes over. */
  required?: boolean;
  /** The field takes an address or a number, so the phone neither capitalises, corrects nor underlines it. */
  isIdentifier?: boolean;
};

// Read the field and its typed value
const props = withDefaults(defineProps<Props>(), { type: "text" });
const value = defineModel<string>({ required: true });

// The hint and the error describe the input when they show
const hintId = computed(() => `${props.id}${FIELD_ID_SUFFIX.HINT}`);
const errorId = computed(() => `${props.id}${FIELD_ID_SUFFIX.ERROR}`);
const describedBy = computed(() => {
  const ids: string[] = [];
  if (props.hint) {
    ids.push(hintId.value);
  }
  if (props.error) {
    ids.push(errorId.value);
  }
  return ids.join(" ") || undefined;
});
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
    <input
      :id="props.id"
      v-model="value"
      :type="props.type"
      :name="props.name"
      :autocomplete="props.autocomplete"
      :inputmode="props.inputmode"
      :maxlength="props.maxlength"
      :placeholder="props.placeholder"
      :aria-invalid="props.error ? 'true' : undefined"
      :required="props.required"
      :aria-describedby="describedBy"
      :autocapitalize="props.isIdentifier ? 'none' : undefined"
      :autocorrect="props.isIdentifier ? 'off' : undefined"
      :spellcheck="props.isIdentifier ? 'false' : undefined"
      class="h-control-lg rounded-md bg-surface px-4 type-body text-text inset-ring inset-ring-border-control placeholder:text-text-muted aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger"
    />
    <p v-if="props.hint" :id="hintId" class="type-body-sm text-text-muted">{{ props.hint }}</p>
    <FieldError v-if="props.error" :id="errorId" :text="props.error" />
  </div>
</template>
