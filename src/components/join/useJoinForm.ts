// Dependencies
import { actions, isInputError } from "astro:actions";
import { computed, onMounted, ref } from "vue";
import { CHECKBOX_ON } from "../../lib/forms/constants";
import { formatList, listFieldLinks } from "../../lib/forms/helpers";
import {
  JOIN_CHECKED_FIELDS,
  JOIN_FIELD,
  JOIN_MODE,
  JOIN_PLACEHOLDER,
} from "../../lib/join/constants";
import { checkJoinValues, getFirstName, isJoinError, orderSkills } from "../../lib/join/helpers";
import { focusWhenDrawn, keepStandingErrors, readFieldErrors } from "../forms/helpers";
import { JOIN_FIELD_ID, JOIN_FORM_ID, JOIN_FORM_STATE, JOIN_START_FOCUS } from "./constants";

// Types
import type { Locale } from "../../i18n/types";
import type {
  JoinCheckedField,
  JoinError,
  JoinErrors,
  JoinMode,
  JoinSkill,
  JoinValues,
} from "../../lib/join/types";
import type { AnswerLanguage } from "../../site/types";
import type { JoinFormCopy, JoinFormStart, JoinFormState } from "./types";

/**
 * The {@link JoinFormOptions} type
 * @description What the sign-up form starts from: the page's language and the form's copy
 */
type JoinFormOptions = {
  locale: Locale;
  copy: JoinFormCopy;
  start?: JoinFormStart;
};

/**
 * The {@link useJoinForm} composable
 * @description The sign-up form's state: what was typed, its errors once Send was pressed, and sending, sent or not sent
 * @param {JoinFormOptions} options - The page's language and the copy
 * @returns {ReturnType<typeof useJoinForm>} The form's state and its handlers
 */
export function useJoinForm({ locale, copy, start }: JoinFormOptions) {
  const given = start?.values;
  const mode = ref<JoinMode>(given?.mode ?? JOIN_MODE.MEMBER);
  const name = ref(given?.name ?? "");
  const email = ref(given?.email ?? "");
  const phone = ref(given?.phone ?? "");
  const place = ref(given?.place ?? "");
  const language = ref<AnswerLanguage>(given?.language ?? locale);
  const skills = ref<JoinSkill[]>(given?.skills ?? []);
  const message = ref(given?.message ?? "");
  const consent = ref(given?.consent ?? false);
  const trap = ref("");
  const state = ref<JoinFormState>(start?.state ?? JOIN_FORM_STATE.EDITING);
  const serverErrors = ref<JoinErrors>(start?.errors ?? {});
  const shownErrors = ref<JoinErrors>({});
  const summaryFields = ref<JoinCheckedField[]>([]);
  const sent = ref<JoinValues | undefined>(getSentValues(start));

  // The sign-up as typed, trimmed the way the server reads it; skills count only for a volunteer
  const values = computed<JoinValues>(() => {
    let chosenSkills: JoinSkill[] = [];
    if (mode.value === JOIN_MODE.VOLUNTEER) {
      chosenSkills = orderSkills(skills.value);
    }
    return {
      mode: mode.value,
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      place: place.value.trim(),
      language: language.value,
      skills: chosenSkills,
      message: message.value.trim(),
      consent: consent.value,
    };
  });

  // Errors show once Send was pressed; typing clears each one once its field is fixed, never adds one
  const errors = computed<JoinErrors>(() =>
    keepStandingErrors(
      JOIN_CHECKED_FIELDS,
      shownErrors.value,
      checkJoinValues(values.value),
      serverErrors.value,
    ),
  );

  // The mode What happens next follows: the sent sign-up's once it is sent, the form's before
  const stepsMode = computed<JoinMode>(() => sent.value?.mode ?? mode.value);

  // The fields still to fix, so the summary shows while any is left
  const errorFields = computed(() => JOIN_CHECKED_FIELDS.filter((field) => errors.value[field]));

  // The summary's title and its sentence name the fields as they were at Send, so it does not change while the visitor types
  const summaryTitle = computed(() => copy.summaryTitles[summaryFields.value.length - 1] ?? "");
  const summaryParts = computed(() =>
    listFieldLinks(
      locale,
      summaryFields.value.map((field) => ({
        id: JOIN_FIELD_ID[field],
        name: copy.summaryFields[field],
      })),
    ),
  );

  /**
   * The {@link showErrors} helper
   * @description Shows the errors found at Send, and names their fields in the summary
   * @param {JoinErrors} found - The errors by field
   * @returns {void}
   */
  function showErrors(found: JoinErrors): void {
    shownErrors.value = found;
    summaryFields.value = JOIN_CHECKED_FIELDS.filter((field) => found[field]);
  }

  // Each field's sentence, empty when it is fine
  const errorText = (error: JoinError | undefined) => (error ? copy.errors[error] : "");

  // The welcome's title, by first name, and its sentence, for a member or a volunteer, with what they gave
  const sentTitle = computed(() => {
    const signUp = sent.value;
    if (!signUp) {
      return "";
    }
    let title = copy.sentMemberTitle;
    if (signUp.mode === JOIN_MODE.VOLUNTEER) {
      title = copy.sentVolunteerTitle;
    }
    return title.replace(JOIN_PLACEHOLDER.NAME, getFirstName(signUp.name));
  });
  const sentText = computed(() => {
    const signUp = sent.value;
    if (!signUp) {
      return "";
    }
    const talkIn = copy.languagesInSentence[signUp.language];

    // A volunteer hears about the skills they gave
    if (signUp.mode === JOIN_MODE.VOLUNTEER) {
      const skillNames = signUp.skills.map((skill) => copy.skillsInSentence[skill]);
      return copy.sentVolunteerText
        .replace(JOIN_PLACEHOLDER.LANGUAGE, talkIn)
        .replace(JOIN_PLACEHOLDER.SKILLS, formatList(locale, skillNames));
    }

    // A member hears where the payment details go
    return copy.sentMemberText
      .replace(JOIN_PLACEHOLDER.EMAIL, signUp.email)
      .replace(JOIN_PLACEHOLDER.LANGUAGE, talkIn);
  });

  /**
   * The {@link toFormData} helper
   * @description The form's fields as the action reads them
   * @returns {FormData} The fields
   */
  function toFormData(): FormData {
    const data = new FormData();
    data.set(JOIN_FIELD.MODE, values.value.mode);
    data.set(JOIN_FIELD.NAME, values.value.name);
    data.set(JOIN_FIELD.EMAIL, values.value.email);
    data.set(JOIN_FIELD.PLACE, values.value.place);
    data.set(JOIN_FIELD.LANGUAGE, values.value.language);
    data.set(JOIN_FIELD.TRAP, trap.value);

    // Optional fields go only when given
    if (values.value.phone) {
      data.set(JOIN_FIELD.PHONE, values.value.phone);
    }
    for (const skill of values.value.skills) {
      data.append(JOIN_FIELD.SKILLS, skill);
    }
    if (values.value.message) {
      data.set(JOIN_FIELD.MESSAGE, values.value.message);
    }
    if (consent.value) {
      data.set(JOIN_FIELD.CONSENT, CHECKBOX_ON);
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
    if (state.value === JOIN_FORM_STATE.SENDING) {
      return;
    }
    await send();
  }

  /**
   * The {@link send} helper
   * @description Checks the sign-up, sends it, and shows the welcome, the errors, or that it did not send
   * @returns {Promise<void>}
   */
  async function send(): Promise<void> {
    serverErrors.value = {};
    const found = checkJoinValues(values.value);
    showErrors(found);

    // Errors stay on the page, named at the top
    if (Object.keys(found).length > 0) {
      state.value = JOIN_FORM_STATE.EDITING;
      await focusWhenDrawn(JOIN_FORM_ID.SUMMARY);
      return;
    }

    // Send it, keeping every field as typed
    state.value = JOIN_FORM_STATE.SENDING;
    const { data, error } = await actions.join(toFormData()).catch((failure: Error) => ({
      data: undefined,
      error: failure,
    }));

    // The server found something the page did not
    if (error && isInputError(error)) {
      serverErrors.value = readFieldErrors(error.fields, JOIN_CHECKED_FIELDS, isJoinError);
      showErrors(serverErrors.value);
      state.value = JOIN_FORM_STATE.EDITING;
      await focusWhenDrawn(JOIN_FORM_ID.SUMMARY);
      return;
    }

    // It did not go: say so above the form, with everything still there
    if (error || !data?.sent) {
      state.value = JOIN_FORM_STATE.FAILED;
      await focusWhenDrawn(JOIN_FORM_ID.FAILED);
      return;
    }

    // Sent: the welcome takes the form's place
    sent.value = values.value;
    state.value = JOIN_FORM_STATE.SENT;
    await focusWhenDrawn(JOIN_FORM_ID.SENT);
  }

  // A form posted without JavaScript shows the server's errors, and points at what came back
  showErrors(serverErrors.value);
  onMounted(() => focusStart(start));

  // The form's state and its handlers
  return {
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
    summaryParts,
    errorText,
    sentTitle,
    sentText,
    stepsMode,
    onSubmit,
    send,
  };
}

/**
 * The {@link getSentValues} helper
 * @description The sign-up a form posted without JavaScript was thanked for, if it was
 * @param {JoinFormStart | undefined} start - Where the form starts
 * @returns {JoinValues | undefined} The sent sign-up
 */
function getSentValues(start: JoinFormStart | undefined): JoinValues | undefined {
  // Only a sent sign-up is thanked
  if (start?.state === JOIN_FORM_STATE.SENT) {
    return start.values;
  }

  // Any other start has nothing to thank for yet
  return undefined;
}

/**
 * The {@link focusStart} helper
 * @description Moves focus to what a form posted without JavaScript came back with: the thank you, the failure, or the errors
 * @param {JoinFormStart | undefined} start - Where the form starts
 * @returns {void}
 */
function focusStart(start: JoinFormStart | undefined): void {
  // A plain visit leaves focus where it is
  if (!start) {
    return;
  }

  // The thank you, the failure or the summary takes focus
  void focusWhenDrawn(JOIN_START_FOCUS[start.state]);
}
