<script setup lang="ts">
// Dependencies
import { LoaderCircle, Send } from "@lucide/vue";
import { computed } from "vue";
import { JOIN_FIELD, JOIN_LIMIT, JOIN_MODE } from "../../lib/join/constants";
import { FIELD_ID_SUFFIX } from "../forms/constants";
import { JOIN_FORM_ID, JOIN_FORM_STATE, JOIN_MODE_ID } from "./constants";
import { useJoinForm } from "./useJoinForm";
import { useJoinModeLinks } from "./useJoinModeLinks";

// Components
import ChoiceChip from "../forms/ChoiceChip.vue";
import ConsentField from "../forms/ConsentField.vue";
import FieldError from "../forms/FieldError.vue";
import FormFailed from "../forms/FormFailed.vue";
import FormSummary from "../forms/FormSummary.vue";
import TextArea from "../forms/TextArea.vue";
import TextField from "../forms/TextField.vue";
import TrapField from "../forms/TrapField.vue";
import JoinModeChoice from "./JoinModeChoice.vue";
import JoinNextSteps from "./JoinNextSteps.vue";
import JoinSent from "./JoinSent.vue";
import SkillChip from "./SkillChip.vue";

// Types
import type { Locale } from "../../i18n/types";
import type { JoinFormCopy, JoinFormLinks } from "./types";

/**
 * The {@link Props} type
 * @description The props of the JoinSignUp component, the sign-up form on its card and What happens next, which follows the form's mode
 */
type Props = {
  /** The page's language, which the language to talk in starts on. */
  locale: Locale;
  /** The form's copy in that language. */
  copy: JoinFormCopy;
  /** The privacy, WhatsApp, What's on and tell a friend links. */
  links: JoinFormLinks;
};

// Read the props and the form's state, and let the page's mode links pick the mode
const props = defineProps<Props>();
const {
  mode,
  name,
  email,
  phone,
  place,
  language,
  skills,
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
  stepsMode,
  onSubmit,
  send,
} = useJoinForm({ locale: props.locale, copy: props.copy });
useJoinModeLinks(mode);

// Skills show for a volunteer, and the next steps follow the mode
const isVolunteer = computed(() => mode.value === JOIN_MODE.VOLUNTEER);
const steps = computed(() => {
  if (stepsMode.value === JOIN_MODE.VOLUNTEER) {
    return props.copy.volunteerSteps;
  }
  return props.copy.memberSteps;
});
const skillsErrorId = `${JOIN_FORM_ID.SKILLS}${FIELD_ID_SUFFIX.ERROR}`;
</script>

<template>
  <div
    class="rounded-xl bg-surface p-5 shadow-md tablet:col-span-2 tablet:p-8 desktop:col-span-7 desktop:col-start-5 desktop:row-span-3 desktop:row-start-1 desktop:self-start"
  >
    <JoinSent
      v-if="state === JOIN_FORM_STATE.SENT"
      :opener="props.copy.sentOpener"
      :title="sentTitle"
      :text="sentText"
      :see-whats-on="props.copy.seeWhatsOn"
      :whats-on-href="props.links.whatsOn"
      :tell-friend="props.copy.tellFriend"
      :tell-friend-href="props.links.tellFriend"
    />
    <form
      v-else
      method="post"
      novalidate
      class="flex flex-col gap-5 desktop:gap-6"
      @submit="onSubmit"
    >
      <FormSummary
        v-if="errorFields.length > 0"
        :id="JOIN_FORM_ID.SUMMARY"
        :title="summaryTitle"
        :text="summaryText"
      />
      <FormFailed
        v-if="state === JOIN_FORM_STATE.FAILED"
        :id="JOIN_FORM_ID.FAILED"
        :title="props.copy.failedTitle"
        :text="props.copy.failedText"
        :try-again="props.copy.tryAgain"
        :whatsapp="props.copy.whatsapp"
        :whatsapp-href="props.links.whatsapp"
        @retry="send"
      />
      <fieldset
        :disabled="state === JOIN_FORM_STATE.SENDING"
        class="flex flex-col gap-5 transition-opacity duration-base disabled:opacity-60 desktop:gap-6"
      >
        <fieldset class="flex flex-col">
          <legend class="mb-2.5 type-field-label text-text-heading">
            {{ props.copy.modeLabel }}
          </legend>
          <div class="grid grid-cols-2 rounded-pill bg-surface-sunken p-1">
            <JoinModeChoice
              v-for="option in props.copy.modes"
              :id="JOIN_MODE_ID[option.value]"
              :key="option.value"
              v-model="mode"
              :value="option.value"
              :label="option.label"
            />
          </div>
        </fieldset>

        <div class="flex flex-col gap-5 tablet:grid tablet:grid-cols-2 tablet:gap-4">
          <TextField
            :id="JOIN_FORM_ID.NAME"
            v-model="name"
            :name="JOIN_FIELD.NAME"
            :label="props.copy.nameLabel"
            autocomplete="name"
            required
            :maxlength="JOIN_LIMIT.NAME"
            :placeholder="props.copy.namePlaceholder"
            :error="errorText(errors.name)"
          />
          <TextField
            :id="JOIN_FORM_ID.EMAIL"
            v-model="email"
            :name="JOIN_FIELD.EMAIL"
            :label="props.copy.emailLabel"
            type="email"
            autocomplete="email"
            required
            is-identifier
            :maxlength="JOIN_LIMIT.EMAIL"
            :error="errorText(errors.email)"
          />
          <TextField
            :id="JOIN_FORM_ID.PHONE"
            v-model="phone"
            :name="JOIN_FIELD.PHONE"
            :label="props.copy.phoneLabel"
            :optional-note="props.copy.optional"
            type="tel"
            autocomplete="tel"
            :maxlength="JOIN_LIMIT.PHONE"
          />
          <TextField
            :id="JOIN_FORM_ID.PLACE"
            v-model="place"
            :name="JOIN_FIELD.PLACE"
            :label="props.copy.placeLabel"
            autocomplete="address-level2"
            required
            :maxlength="JOIN_LIMIT.PLACE"
            :hint="props.copy.placeHint"
            :error="errorText(errors.place)"
          />
        </div>

        <fieldset class="flex flex-col">
          <legend class="mb-2.5 type-field-label text-text-heading">
            {{ props.copy.languageLabel }}
          </legend>
          <div class="flex flex-wrap gap-2">
            <ChoiceChip
              v-for="option in props.copy.languages"
              :key="option.value"
              v-model="language"
              :name="JOIN_FIELD.LANGUAGE"
              :value="option.value"
              :label="option.label"
            />
          </div>
        </fieldset>

        <fieldset
          v-if="isVolunteer"
          :id="JOIN_FORM_ID.SKILLS"
          :aria-describedby="errors.skills ? skillsErrorId : undefined"
          class="flex flex-col gap-2"
        >
          <legend class="mb-2.5 type-field-label text-text-heading">
            {{ props.copy.skillsLabel }}
          </legend>
          <div class="flex flex-wrap gap-2">
            <SkillChip
              v-for="option in props.copy.skills"
              :key="option.value"
              v-model="skills"
              :value="option.value"
              :label="option.label"
            />
          </div>
          <FieldError v-if="errors.skills" :id="skillsErrorId" :text="errorText(errors.skills)" />
        </fieldset>

        <TextArea
          :id="JOIN_FORM_ID.MESSAGE"
          v-model="message"
          :name="JOIN_FIELD.MESSAGE"
          :label="props.copy.messageLabel"
          :optional-note="props.copy.optional"
          :maxlength="JOIN_LIMIT.MESSAGE"
          :placeholder="props.copy.messagePlaceholder"
        />

        <TrapField v-model="trap" />

        <ConsentField
          :id="JOIN_FORM_ID.CONSENT"
          v-model="consent"
          :name="JOIN_FIELD.CONSENT"
          :text="props.copy.consent"
          :link-label="props.copy.privacy"
          :href="props.links.privacy"
          required
          :error="errorText(errors.consent)"
        />
      </fieldset>

      <p role="status" class="sr-only">
        {{ state === JOIN_FORM_STATE.SENDING ? props.copy.sending : "" }}
      </p>
      <button
        type="submit"
        :aria-busy="state === JOIN_FORM_STATE.SENDING ? 'true' : undefined"
        class="inline-flex h-control-lg w-full touch-manipulation items-center justify-center gap-2 rounded-pill bg-primary px-8 type-button text-on-primary transition-[background-color,scale] duration-fast ease-standard select-none hover:bg-primary-hover active:scale-97 active:bg-primary-pressed aria-busy:cursor-progress tablet:w-auto tablet:self-start [&_svg]:size-icon-md [&_svg]:shrink-0"
      >
        <LoaderCircle
          v-if="state === JOIN_FORM_STATE.SENDING"
          class="motion-safe:animate-spin"
          aria-hidden="true"
        />
        <Send v-else aria-hidden="true" />
        {{ state === JOIN_FORM_STATE.SENDING ? props.copy.sending : props.copy.send }}
      </button>
    </form>
  </div>
  <JoinNextSteps :steps="steps" class="tablet:col-span-2 desktop:col-span-4">
    <slot />
  </JoinNextSteps>
</template>
