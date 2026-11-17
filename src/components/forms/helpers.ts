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

/**
 * The {@link keepStandingErrors} helper
 * @description The errors still to show while the visitor types: those shown at Send that are still wrong, or that the server found; typing clears an error, it never adds or changes one
 * @param {readonly F[]} checked - The fields the form checks
 * @param {Partial<Record<F, E>>} shown - The errors shown when Send was pressed
 * @param {Partial<Record<F, E>>} current - The errors in what is typed now
 * @param {Partial<Record<F, E>>} server - The errors the server found at the last Send
 * @returns {Partial<Record<F, E>>} The errors by field
 */
export function keepStandingErrors<F extends string, E extends string>(
  checked: readonly F[],
  shown: Partial<Record<F, E>>,
  current: Partial<Record<F, E>>,
  server: Partial<Record<F, E>>,
): Partial<Record<F, E>> {
  const standing: Partial<Record<F, E>> = {};

  // Each error shown at Send stays, as it was, while its field is still wrong or the server found it
  for (const field of checked) {
    const error = shown[field];
    if (error && (current[field] || server[field])) {
      standing[field] = error;
    }
  }
  return standing;
}
