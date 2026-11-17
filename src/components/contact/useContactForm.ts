// Dependencies
import { actions, isInputError } from "astro:actions";
import { computed, onMounted, ref } from "vue";
import {
  CONTACT_CHECKED_FIELDS,
  CONTACT_FIELD,
  CONTACT_PLACEHOLDER,
} from "../../lib/contact/constants";
import { checkContactValues, isContactError } from "../../lib/contact/helpers";
import { CHECKBOX_ON } from "../../lib/forms/constants";
import { listFieldLinks } from "../../lib/forms/helpers";
import { focusWhenDrawn, keepStandingErrors, readFieldErrors } from "../forms/helpers";
import {
  CONTACT_FIELD_ID,
  CONTACT_FORM_ID,
  CONTACT_FORM_STATE,
  CONTACT_START_FOCUS,
} from "./constants";

// Types
import type { Locale } from "../../i18n/types";
import type {
  ContactCheckedField,
  ContactError,
  ContactErrors,
  ContactTopic,
} from "../../lib/contact/types";
import type { AnswerLanguage } from "../../site/types";
import type { ContactFormCopy, ContactFormStart, ContactFormState } from "./types";

/**
 * The {@link ContactFormOptions} type
 * @description What the message form starts from: the page's language and the form's copy
 */
type ContactFormOptions = {
  locale: Locale;
  copy: ContactFormCopy;
  start?: ContactFormStart;
};

/**
 * The {@link useContactForm} composable
 * @description The message form's state: what was typed, its errors once Send was pressed, and sending, sent or not sent
 * @param {ContactFormOptions} options - The page's language and the copy
 * @returns {ReturnType<typeof useContactForm>} The form's state and its handlers
 */
export function useContactForm({ locale, copy, start }: ContactFormOptions) {
  const given = start?.values;
  const name = ref(given?.name ?? "");
  const reach = ref(given?.reach ?? "");
  const language = ref<AnswerLanguage>(given?.language ?? locale);
  const topic = ref<ContactTopic | "">(given?.topic ?? "");
  const message = ref(given?.message ?? "");
  const consent = ref(given?.consent ?? false);
  const trap = ref("");
  const state = ref<ContactFormState>(start?.state ?? CONTACT_FORM_STATE.EDITING);
  const serverErrors = ref<ContactErrors>(start?.errors ?? {});
  const shownErrors = ref<ContactErrors>({});
  const summaryFields = ref<ContactCheckedField[]>([]);
  const sentName = ref(given?.name ?? "");
  const sentReach = ref(given?.reach ?? "");
  const sentLanguage = ref<AnswerLanguage>(given?.language ?? locale);

  // The message as typed, trimmed the way the server reads it
  const values = computed(() => ({
    name: name.value.trim(),
    reach: reach.value.trim(),
    language: language.value,
    message: message.value.trim(),
    consent: consent.value,
  }));

  // Errors show once Send was pressed; typing clears each one once its field is fixed, never adds one
  const errors = computed<ContactErrors>(() =>
    keepStandingErrors(
      CONTACT_CHECKED_FIELDS,
      shownErrors.value,
      checkContactValues(values.value),
      serverErrors.value,
    ),
  );

  // The fields still to fix, so the summary shows while any is left
  const errorFields = computed(() => CONTACT_CHECKED_FIELDS.filter((field) => errors.value[field]));

  // The summary's title and its sentence name the fields as they were at Send, so it does not change while the visitor types
  const summaryTitle = computed(() => copy.summaryTitles[summaryFields.value.length - 1] ?? "");
  const summaryParts = computed(() =>
    listFieldLinks(
      locale,
      summaryFields.value.map((field) => ({
        id: CONTACT_FIELD_ID[field],
        name: copy.summaryFields[field],
      })),
    ),
  );

  /**
   * The {@link showErrors} helper
   * @description Shows the errors found at Send, and names their fields in the summary
   * @param {ContactErrors} found - The errors by field
   * @returns {void}
   */
  function showErrors(found: ContactErrors): void {
    shownErrors.value = found;
    summaryFields.value = CONTACT_CHECKED_FIELDS.filter((field) => found[field]);
  }

  // Each field's sentence, empty when it is fine
  const errorText = (error: ContactError | undefined) => (error ? copy.errors[error] : "");

  // The thank you's title and sentence, with the name, language and address the message gave
  const sentTitle = computed(() =>
    copy.sentTitle.replace(CONTACT_PLACEHOLDER.NAME, sentName.value),
  );
  const sentText = computed(() =>
    copy.sentText
      .replace(CONTACT_PLACEHOLDER.LANGUAGE, copy.languagesInSentence[sentLanguage.value])
      .replace(CONTACT_PLACEHOLDER.REACH, sentReach.value),
  );

  /**
   * The {@link toFormData} helper
   * @description The form's fields as the action reads them
   * @returns {FormData} The fields
   */
  function toFormData(): FormData {
    const data = new FormData();
    data.set(CONTACT_FIELD.NAME, values.value.name);
    data.set(CONTACT_FIELD.REACH, values.value.reach);
    data.set(CONTACT_FIELD.LANGUAGE, values.value.language);
    data.set(CONTACT_FIELD.MESSAGE, values.value.message);
    data.set(CONTACT_FIELD.TRAP, trap.value);

    // Optional fields go only when given
    if (topic.value) {
      data.set(CONTACT_FIELD.TOPIC, topic.value);
    }
    if (consent.value) {
      data.set(CONTACT_FIELD.CONSENT, CHECKBOX_ON);
    }
    return data;
  }

  /**
   * The {@link onSubmit} helper
   * @description Sends the form in place of a page load
   * @param {SubmitEvent} event - The form's submit
   * @returns {Promise<void>}
   */
  async function onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    // A second press while it sends does nothing
    if (state.value === CONTACT_FORM_STATE.SENDING) {
      return;
    }
    await send();
  }

  /**
   * The {@link send} helper
   * @description Checks the message, sends it, and shows sent, the errors, or that it did not send
   * @returns {Promise<void>}
   */
  async function send(): Promise<void> {
    serverErrors.value = {};
    const found = checkContactValues(values.value);
    showErrors(found);

    // Errors stay on the page, named at the top
    if (Object.keys(found).length > 0) {
      state.value = CONTACT_FORM_STATE.EDITING;
      await focusWhenDrawn(CONTACT_FORM_ID.SUMMARY);
      return;
    }

    // Send it, keeping every field as typed
    state.value = CONTACT_FORM_STATE.SENDING;
    const { data, error } = await actions.contact(toFormData()).catch((failure: Error) => ({
      data: undefined,
      error: failure,
    }));

    // The server found something the page did not
    if (error && isInputError(error)) {
      serverErrors.value = readFieldErrors(error.fields, CONTACT_CHECKED_FIELDS, isContactError);
      showErrors(serverErrors.value);
      state.value = CONTACT_FORM_STATE.EDITING;
      await focusWhenDrawn(CONTACT_FORM_ID.SUMMARY);
      return;
    }

    // It did not go: say so above the form, with the text still there
    if (error || !data?.sent) {
      state.value = CONTACT_FORM_STATE.FAILED;
      await focusWhenDrawn(CONTACT_FORM_ID.FAILED);
      return;
    }

    // Sent: the thank you takes the form's place
    sentName.value = values.value.name;
    sentReach.value = values.value.reach;
    sentLanguage.value = values.value.language;
    state.value = CONTACT_FORM_STATE.SENT;
    await focusWhenDrawn(CONTACT_FORM_ID.SENT);
  }

  /**
   * The {@link startAgain} helper
   * @description Empties the form for another message, keeping the chosen language
   * @returns {Promise<void>}
   */
  async function startAgain(): Promise<void> {
    name.value = "";
    reach.value = "";
    topic.value = "";
    message.value = "";
    consent.value = false;
    showErrors({});
    state.value = CONTACT_FORM_STATE.EDITING;
    await focusWhenDrawn(CONTACT_FORM_ID.NAME);
  }

  // A form posted without JavaScript shows the server's errors, and points at what came back
  showErrors(serverErrors.value);
  onMounted(() => focusStart(start));

  // The form's state and its handlers
  return {
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
  };
}

/**
 * The {@link focusStart} helper
 * @description Moves focus to what a form posted without JavaScript came back with: the thank you, the failure, or the errors
 * @param {ContactFormStart | undefined} start - Where the form starts
 * @returns {void}
 */
function focusStart(start: ContactFormStart | undefined): void {
  // A plain visit leaves focus where it is
  if (!start) {
    return;
  }

  // The thank you, the failure or the summary takes focus
  void focusWhenDrawn(CONTACT_START_FOCUS[start.state]);
}
