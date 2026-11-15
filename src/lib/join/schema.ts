// Dependencies
import { z } from "astro/zod";
import { ANSWER_LANGUAGES } from "../../site/constants";
import { CHECKBOX_ON } from "../forms/constants";
import { toOneLine } from "../forms/helpers";
import { JOIN_FIELD, JOIN_LIMIT, JOIN_MODE, JOIN_MODES, JOIN_SKILLS } from "./constants";
import { checkJoinValues, orderSkills } from "./helpers";

// Types
import type { JoinSkill } from "./types";

/**
 * The {@link JOIN_INPUT} constant
 * @description The sign-up form as it posts, an empty field arriving as null; each field that keeps the sign-up from being sent becomes an error on that field, with its error's name
 */
export const JOIN_INPUT = z
  .object({
    [JOIN_FIELD.MODE]: z.enum(JOIN_MODES),
    [JOIN_FIELD.NAME]: z.string().trim().max(JOIN_LIMIT.NAME).transform(toOneLine).nullish(),
    [JOIN_FIELD.EMAIL]: z.string().trim().max(JOIN_LIMIT.EMAIL).transform(toOneLine).nullish(),
    [JOIN_FIELD.PHONE]: z.string().trim().max(JOIN_LIMIT.PHONE).transform(toOneLine).nullish(),
    [JOIN_FIELD.PLACE]: z.string().trim().max(JOIN_LIMIT.PLACE).transform(toOneLine).nullish(),
    [JOIN_FIELD.LANGUAGE]: z.enum(ANSWER_LANGUAGES),
    [JOIN_FIELD.SKILLS]: z.array(z.enum(JOIN_SKILLS)).nullish(),
    [JOIN_FIELD.MESSAGE]: z.string().trim().max(JOIN_LIMIT.MESSAGE).nullish(),
    [JOIN_FIELD.CONSENT]: z.literal(CHECKBOX_ON).nullish(),
    [JOIN_FIELD.TRAP]: z.string().nullish(),
  })
  .transform((input, context) => {
    // Skills count only for a volunteer
    let skills: JoinSkill[] = [];
    if (input.mode === JOIN_MODE.VOLUNTEER && input.skills) {
      skills = orderSkills(input.skills);
    }
    const values = {
      mode: input.mode,
      name: input.name ?? "",
      email: input.email ?? "",
      phone: input.phone ?? "",
      place: input.place ?? "",
      language: input.language,
      skills,
      message: input.message ?? "",
      consent: input.consent === CHECKBOX_ON,
    };
    const errors = checkJoinValues(values);

    // Each field's error is reported on that field
    for (const [field, error] of Object.entries(errors)) {
      context.addIssue({ code: "custom", message: error, path: [field], input });
    }
    if (Object.keys(errors).length > 0) {
      return z.NEVER;
    }

    // A sign-up that can be sent, and whether a robot filled the hidden field
    return { values, isTrapped: Boolean(input[JOIN_FIELD.TRAP]) };
  });
