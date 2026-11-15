// Dependencies
import { nextTick } from "vue";

// Types
import type { ServerFieldErrors } from "./types";

/**
 * The {@link focusWhenDrawn} helper
 * @description Moves focus to a part of a form once the page has drawn it
 * @param {string} id - The part's id
 * @returns {Promise<void>}
 */
export async function focusWhenDrawn(id: string): Promise<void> {
  await nextTick();
  document.getElementById(id)?.focus();
}

/**
 * The {@link readFieldErrors} helper
 * @description The errors an action found, by field, keeping only the fields and the errors the form knows
 * @param {ServerFieldErrors} fields - The action's input errors
 * @param {readonly F[]} checked - The fields the form checks
 * @param {(value: string | undefined) => value is E} isKnown - Whether a value is one of the form's errors
 * @returns {Partial<Record<F, E>>} The errors by field
 */
export function readFieldErrors<F extends string, E extends string>(
  fields: ServerFieldErrors,
  checked: readonly F[],
  isKnown: (value: string | undefined) => value is E,
): Partial<Record<F, E>> {
  const found: Partial<Record<F, E>> = {};

  // Each checked field takes its first error, when it is one the form can show
  for (const field of checked) {
    const error = fields[field]?.[0];
    if (isKnown(error)) {
      found[field] = error;
    }
  }
  return found;
}
