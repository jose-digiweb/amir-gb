<script setup lang="ts">
// Dependencies
import { LoaderCircle, Send } from "@lucide/vue";
import { CONTACT_FIELD, CONTACT_LIMIT } from "../../lib/contact/constants";
import { CONTACT_FORM_ID, CONTACT_FORM_STATE } from "./constants";
import { useFormEnhanced } from "../forms/useFormEnhanced";
import { useContactForm } from "./useContactForm";

// Components
import ChoiceChip from "../forms/ChoiceChip.vue";
import ConsentField from "../forms/ConsentField.vue";
import FormFailed from "../forms/FormFailed.vue";
import FormSummary from "../forms/FormSummary.vue";
import TextArea from "../forms/TextArea.vue";
import TextField from "../forms/TextField.vue";
import TrapField from "../forms/TrapField.vue";
import ContactSent from "./ContactSent.vue";

// Types
import type { Locale } from "../../i18n/types";
import type { ContactFormCopy, ContactFormLinks, ContactFormStart } from "./types";

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
  /** Where the form posts without JavaScript: the contact action on its own small page. */
  action: string;
  /** Where the form starts after a post without JavaScript. */
  start?: ContactFormStart;
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
  summaryParts,
  errorText,
  sentTitle,
  sentText,
  onSubmit,
  send,
  startAgain,
} = useContactForm({ locale: props.locale, copy: props.copy, start: props.start });

// The browser checks the required fields until this form's script takes over
const isEnhanced = useFormEnhanced();
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
    :action="props.action"
    :novalidate="isEnhanced"
    class="flex flex-col gap-5 desktop:gap-6"
    @submit="onSubmit"
  >
    <FormSummary
      v-if="errorFields.length > 0"
      :id="CONTACT_FORM_ID.SUMMARY"
      :title="summaryTitle"
      :parts="summaryParts"
    />
    <FormFailed
      v-if="state === CONTACT_FORM_STATE.FAILED"
      :id="CONTACT_FORM_ID.FAILED"
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
        <TextField
          :id="CONTACT_FORM_ID.NAME"
          v-model="name"
          :name="CONTACT_FIELD.NAME"
          :label="props.copy.nameLabel"
          autocomplete="name"
          required
          :maxlength="CONTACT_LIMIT.NAME"
          :placeholder="props.copy.namePlaceholder"
          :error="errorText(errors.name)"
        />
        <TextField
          :id="CONTACT_FORM_ID.REACH"
          v-model="reach"
          :name="CONTACT_FIELD.REACH"
          :label="props.copy.reachLabel"
          autocomplete="email"
          required
          is-identifier
          :maxlength="CONTACT_LIMIT.REACH"
          :placeholder="props.copy.reachPlaceholder"
          :error="errorText(errors.reach)"
        />
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

      <TextArea
        :id="CONTACT_FORM_ID.MESSAGE"
        v-model="message"
        :name="CONTACT_FIELD.MESSAGE"
        :label="props.copy.messageLabel"
        required
        :maxlength="CONTACT_LIMIT.MESSAGE"
        :placeholder="props.copy.messagePlaceholder"
        :error="errorText(errors.message)"
      />

      <TrapField v-model="trap" />

      <ConsentField
        :id="CONTACT_FORM_ID.CONSENT"
        v-model="consent"
        :name="CONTACT_FIELD.CONSENT"
        :text="props.copy.consent"
        :link-label="props.copy.privacy"
        :href="props.links.privacy"
        required
        :error="errorText(errors.consent)"
      />
    </fieldset>

    <p role="status" class="sr-only">
      {{ state === CONTACT_FORM_STATE.SENDING ? props.copy.sending : "" }}
    </p>
    <button
      type="submit"
      :aria-busy="state === CONTACT_FORM_STATE.SENDING ? 'true' : undefined"
      class="inline-flex h-control-lg w-full touch-manipulation items-center justify-center gap-2 rounded-pill bg-primary px-8 type-button text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed aria-busy:cursor-progress tablet:w-auto tablet:self-start [&_svg]:size-icon-md [&_svg]:shrink-0"
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
