<script setup lang="ts">
// Dependencies
import { LoaderCircle, Send } from "@lucide/vue";
import { CONTACT_FIELD, CONTACT_LIMIT } from "../../lib/contact/constants";
import { CONTACT_FORM_ID, CONTACT_FORM_STATE } from "./constants";
import { useContactForm } from "./useContactForm";

// Components
import ChoiceChip from "./ChoiceChip.vue";
import ContactFailed from "./ContactFailed.vue";
import ContactSent from "./ContactSent.vue";
import ContactSummary from "./ContactSummary.vue";
import FieldError from "./FieldError.vue";

// Types
import type { Locale } from "../../i18n/types";
import type { ContactFormCopy, ContactFormLinks } from "./types";

/**
 * The {@link Props} type
 * @description The props of the ContactForm component, the message form: name, how to answer, the language, the topic, the message and leave to use the details
 */
type Props = {
  /** The page's language, which the answer language starts on. */
  locale: Locale;
  /** The form's copy in that language. */
  copy: ContactFormCopy;
  /** The WhatsApp and privacy links. */
  links: ContactFormLinks;
};

// Read the props and the form's state
const props = defineProps<Props>();
const {
  name,
  reach,
  language,
  topic,
  message,
  consent,
  trap,
  state,
  errors,
  errorFields,
  summaryTitle,
  summaryText,
  errorText,
  sentTitle,
  sentText,
  onSubmit,
  send,
  startAgain,
} = useContactForm({ locale: props.locale, copy: props.copy });
</script>

<template>
  <ContactSent
    v-if="state === CONTACT_FORM_STATE.SENT"
    :opener="props.copy.sentOpener"
    :title="sentTitle"
    :text="sentText"
    :whatsapp="props.copy.whatsapp"
    :whatsapp-href="props.links.whatsapp"
    :send-another="props.copy.sendAnother"
    @again="startAgain"
  />
  <form
    v-else
    method="post"
    novalidate
    class="flex flex-col gap-5 desktop:gap-6"
    @submit="onSubmit"
  >
    <ContactSummary v-if="errorFields.length > 0" :title="summaryTitle" :text="summaryText" />
    <ContactFailed
      v-if="state === CONTACT_FORM_STATE.FAILED"
      :title="props.copy.failedTitle"
      :text="props.copy.failedText"
      :try-again="props.copy.tryAgain"
      :whatsapp="props.copy.whatsapp"
      :whatsapp-href="props.links.whatsapp"
      @retry="send"
    />
    <fieldset
      :disabled="state === CONTACT_FORM_STATE.SENDING"
      class="flex flex-col gap-5 transition-opacity duration-base disabled:opacity-60 desktop:gap-6"
    >
      <div class="flex flex-col gap-5 desktop:grid desktop:grid-cols-2 desktop:gap-4">
        <div class="flex flex-col gap-2">
          <label :for="CONTACT_FORM_ID.NAME" class="type-field-label text-text-heading">
            {{ props.copy.nameLabel }}
          </label>
          <input
            :id="CONTACT_FORM_ID.NAME"
            v-model="name"
            type="text"
            :name="CONTACT_FIELD.NAME"
            autocomplete="name"
            :maxlength="CONTACT_LIMIT.NAME"
            :placeholder="props.copy.namePlaceholder"
            :aria-invalid="errors.name ? 'true' : undefined"
            :aria-describedby="errors.name ? `${CONTACT_FORM_ID.NAME}-error` : undefined"
            class="h-control-lg rounded-md bg-surface px-4 type-body text-text inset-ring inset-ring-border-control placeholder:text-text-muted aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger"
          />
          <FieldError
            v-if="errors.name"
            :id="`${CONTACT_FORM_ID.NAME}-error`"
            :text="errorText(errors.name)"
          />
        </div>
        <div class="flex flex-col gap-2">
          <label :for="CONTACT_FORM_ID.REACH" class="type-field-label text-text-heading">
            {{ props.copy.reachLabel }}
          </label>
          <input
            :id="CONTACT_FORM_ID.REACH"
            v-model="reach"
            type="text"
            :name="CONTACT_FIELD.REACH"
            autocomplete="email"
            inputmode="email"
            :maxlength="CONTACT_LIMIT.REACH"
            :placeholder="props.copy.reachPlaceholder"
            :aria-invalid="errors.reach ? 'true' : undefined"
            :aria-describedby="errors.reach ? `${CONTACT_FORM_ID.REACH}-error` : undefined"
            class="h-control-lg rounded-md bg-surface px-4 type-body text-text inset-ring inset-ring-border-control placeholder:text-text-muted aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger"
          />
          <FieldError
            v-if="errors.reach"
            :id="`${CONTACT_FORM_ID.REACH}-error`"
            :text="errorText(errors.reach)"
          />
        </div>
      </div>

      <fieldset class="flex flex-col gap-2.5">
        <legend class="mb-2.5 type-field-label text-text-heading">
          {{ props.copy.languageLabel }}
        </legend>
        <div class="flex flex-wrap gap-2">
          <ChoiceChip
            v-for="option in props.copy.languages"
            :key="option.value"
            v-model="language"
            :name="CONTACT_FIELD.LANGUAGE"
            :value="option.value"
            :label="option.label"
          />
        </div>
      </fieldset>

      <fieldset class="flex flex-col gap-2.5">
        <legend class="mb-2.5 type-field-label text-text-heading">
          {{ props.copy.topicLabel }}
        </legend>
        <div class="flex flex-wrap gap-2">
          <ChoiceChip
            v-for="option in props.copy.topics"
            :key="option.value"
            v-model="topic"
            :name="CONTACT_FIELD.TOPIC"
            :value="option.value"
            :label="option.label"
          />
        </div>
      </fieldset>

      <div class="flex flex-col gap-2">
        <label :for="CONTACT_FORM_ID.MESSAGE" class="type-field-label text-text-heading">
          {{ props.copy.messageLabel }}
        </label>
        <textarea
          :id="CONTACT_FORM_ID.MESSAGE"
          v-model="message"
          :name="CONTACT_FIELD.MESSAGE"
          rows="5"
          :maxlength="CONTACT_LIMIT.MESSAGE"
          :placeholder="props.copy.messagePlaceholder"
          :aria-invalid="errors.message ? 'true' : undefined"
          :aria-describedby="errors.message ? `${CONTACT_FORM_ID.MESSAGE}-error` : undefined"
          class="min-h-36 resize-y rounded-md bg-surface px-4 py-3 type-body text-text inset-ring inset-ring-border-control placeholder:text-text-muted aria-invalid:inset-ring-2 aria-invalid:inset-ring-danger"
        ></textarea>
        <FieldError
          v-if="errors.message"
          :id="`${CONTACT_FORM_ID.MESSAGE}-error`"
          :text="errorText(errors.message)"
        />
      </div>

      <input
        v-model="trap"
        type="text"
        :name="CONTACT_FIELD.TRAP"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
        class="hidden"
      />

      <div class="flex flex-col gap-2">
        <div class="flex items-start gap-3">
          <input
            :id="CONTACT_FORM_ID.CONSENT"
            v-model="consent"
            type="checkbox"
            :name="CONTACT_FIELD.CONSENT"
            :aria-invalid="errors.consent ? 'true' : undefined"
            :aria-describedby="errors.consent ? `${CONTACT_FORM_ID.CONSENT}-error` : undefined"
            class="mt-0.5 size-6 shrink-0 cursor-pointer rounded-sm accent-text-heading"
          />
          <label :for="CONTACT_FORM_ID.CONSENT" class="type-body-sm text-text">
            {{ props.copy.consent }}
            <a
              :href="props.links.privacy"
              class="font-semibold text-link underline underline-offset-3"
            >
              {{ props.copy.privacy }}
            </a>
          </label>
        </div>
        <FieldError
          v-if="errors.consent"
          :id="`${CONTACT_FORM_ID.CONSENT}-error`"
          :text="errorText(errors.consent)"
        />
      </div>
    </fieldset>

    <button
      type="submit"
      :disabled="state === CONTACT_FORM_STATE.SENDING"
      :aria-busy="state === CONTACT_FORM_STATE.SENDING ? 'true' : undefined"
      class="inline-flex h-control-lg w-full touch-manipulation items-center justify-center gap-2 rounded-pill bg-primary px-8 type-button text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed disabled:cursor-progress tablet:w-auto tablet:self-start [&_svg]:size-icon-md [&_svg]:shrink-0"
    >
      <LoaderCircle
        v-if="state === CONTACT_FORM_STATE.SENDING"
        class="motion-safe:animate-spin"
        aria-hidden="true"
      />
      <Send v-else aria-hidden="true" />
      {{ state === CONTACT_FORM_STATE.SENDING ? props.copy.sending : props.copy.send }}
    </button>
  </form>
</template>
