// Dependencies
import { KEYBOARDLESS_INPUTS } from "./constants";

/**
 * The {@link opensKeyboard} helper
 * @description Whether a focused element opens the phone's keyboard, which the dock must not sit on
 * @param {EventTarget | null} target - The element that took focus
 * @returns {boolean} True for a text field or a text area
 */
export function opensKeyboard(target: EventTarget | null): boolean {
  // A text area always types
  if (target instanceof HTMLTextAreaElement) {
    return true;
  }

  // An input types unless it is a choice or a button
  if (target instanceof HTMLInputElement) {
    return !KEYBOARDLESS_INPUTS.some((type) => type === target.type);
  }

  // Anything else opens no keyboard
  return false;
}
