// Dependencies
import { z } from "astro/zod";
import { LOCALES } from "../../i18n/constants";
import { DONATE_FIELD, FREQUENCIES } from "./constants";
import { checkAmount, getChosenAmount } from "./helpers";

/**
 * The {@link DONATE_INPUT} constant
 * @description The donation form as it posts: how often, the preset or typed amount, and the page's language; an amount that cannot be given becomes an error on the typed field
 */
export const DONATE_INPUT = z
  .object({
    [DONATE_FIELD.FREQUENCY]: z.enum(FREQUENCIES),
    [DONATE_FIELD.AMOUNT]: z.string().nullish(),
    [DONATE_FIELD.OTHER]: z.string().nullish(),
    [DONATE_FIELD.LOCALE]: z.enum(LOCALES),
  })
  .transform((input, context) => {
    const amountCents = getChosenAmount(input.amount, input.other);
    const error = checkAmount(amountCents);

    // An amount that cannot be given is reported on the typed field, with its error's name
    if (error || amountCents === null) {
      context.addIssue({ code: "custom", message: error, path: [DONATE_FIELD.OTHER], input });
      return z.NEVER;
    }

    // A valid gift, with the page's language for Stripe
    return {
      choice: { frequency: input.frequency, amountCents },
      locale: input.locale,
    };
  });
