// Dependencies
import { z } from "astro/zod";
import { ANSWER_LANGUAGES } from "../../site/constants";
import { CHECKBOX_ON } from "../forms/constants";
import { toOneLine } from "../forms/helpers";
import { CONTACT_FIELD, CONTACT_LIMIT, CONTACT_TOPICS } from "./constants";
import { checkContactValues } from "./helpers";

/**
 * The {@link CONTACT_INPUT} constant
 * @description The message form as it posts; each field that keeps the message from being sent becomes an error on that field, with its error's name
 */
export const CONTACT_INPUT = z
  .object({
    [CONTACT_FIELD.NAME]: z.string().trim().max(CONTACT_LIMIT.NAME).transform(toOneLine),
    [CONTACT_FIELD.REACH]: z.string().trim().max(CONTACT_LIMIT.REACH).transform(toOneLine),
    [CONTACT_FIELD.LANGUAGE]: z.enum(ANSWER_LANGUAGES),
    [CONTACT_FIELD.TOPIC]: z.enum(CONTACT_TOPICS).nullish(),
    [CONTACT_FIELD.MESSAGE]: z.string().trim().max(CONTACT_LIMIT.MESSAGE),
    [CONTACT_FIELD.CONSENT]: z.literal(CHECKBOX_ON).nullish(),
    [CONTACT_FIELD.TRAP]: z.string().nullish(),
  })
  .transform((input, context) => {
    const values = {
      name: input.name,
      reach: input.reach,
      language: input.language,
      topic: input.topic ?? undefined,
      message: input.message,
      consent: input.consent === CHECKBOX_ON,
    };
    const errors = checkContactValues(values);

    // Each field's error is reported on that field
    for (const [field, error] of Object.entries(errors)) {
      context.addIssue({ code: "custom", message: error, path: [field], input });
    }
    if (Object.keys(errors).length > 0) {
      return z.NEVER;
    }

    // A message that can be sent, and whether a robot filled the hidden field
    return { values, isTrapped: Boolean(input.website) };
  });
