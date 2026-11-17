// Dependencies
import {
  ARIA_STATE,
  ATTRIBUTE,
  COMMAND,
  COPY_OUTCOME,
  FEATURE,
  PAGE_EVENT,
  SELECTOR,
} from "./constants";

// Types
import type { CopyOutcome } from "./types";

/**
 * The {@link enableDialogFallbacks} helper
 * @description Gives older browsers what invoker commands and closedby="any" do natively for dialogs
 * @returns {void}
 */
export function enableDialogFallbacks(): void {
  const hasCommands = FEATURE.COMMAND in HTMLButtonElement.prototype;
  const hasClosedBy = FEATURE.CLOSED_BY in HTMLDialogElement.prototype;

  // Command buttons open and close their dialog by click
  if (!hasCommands) {
    for (const button of document.querySelectorAll<HTMLButtonElement>(SELECTOR.COMMAND_BUTTON)) {
      button.addEventListener(PAGE_EVENT.CLICK, () => runCommand(button));
    }
  }

  // A tap outside a light-dismiss dialog closes it
  if (!hasClosedBy) {
    for (const dialog of document.querySelectorAll<HTMLDialogElement>(
      SELECTOR.LIGHT_DISMISS_DIALOG,
    )) {
      dialog.addEventListener(PAGE_EVENT.CLICK, (event) => closeOnOutsideTap(dialog, event));
    }
  }
}

/**
 * The {@link closeLayersOnLeave} helper
 * @description Closes an open dialog or popover when the page is left, so coming back with the back button never finds the menu still open
 * @returns {void}
 */
export function closeLayersOnLeave(): void {
  window.addEventListener(PAGE_EVENT.PAGE_HIDE, () => {
    // Close every open dialog
    for (const dialog of document.querySelectorAll<HTMLDialogElement>(SELECTOR.OPEN_DIALOG)) {
      dialog.close();
    }

    // Hide every open popover
    for (const popover of document.querySelectorAll<HTMLElement>(SELECTOR.OPEN_POPOVER)) {
      popover.hidePopover();
    }
  });
}

/**
 * The {@link runCommand} helper
 * @description Runs a command button's show-modal or close on the dialog it names
 * @param {HTMLButtonElement} button - The button that was pressed
 * @returns {void}
 */
function runCommand(button: HTMLButtonElement): void {
  const dialog = document.getElementById(button.getAttribute(ATTRIBUTE.COMMAND_FOR) ?? "");
  const command = button.getAttribute(ATTRIBUTE.COMMAND);

  // Only dialogs are driven by these buttons
  if (!(dialog instanceof HTMLDialogElement)) {
    return;
  }

  // Show-modal opens the dialog, and the button says it is open until the dialog closes
  if (command === COMMAND.SHOW_MODAL) {
    dialog.showModal();
    button.setAttribute(ATTRIBUTE.EXPANDED, ARIA_STATE.TRUE);
    dialog.addEventListener(
      PAGE_EVENT.CLOSE,
      () => button.setAttribute(ATTRIBUTE.EXPANDED, ARIA_STATE.FALSE),
      { once: true },
    );
    return;
  }

  // Close closes it
  if (command === COMMAND.CLOSE) {
    dialog.close();
  }
}

/**
 * The {@link closeOnOutsideTap} helper
 * @description Closes a dialog when a tap lands outside its box, on the backdrop
 * @param {HTMLDialogElement} dialog - The open dialog
 * @param {MouseEvent} event - The tap
 * @returns {void}
 */
function closeOnOutsideTap(dialog: HTMLDialogElement, event: MouseEvent): void {
  const box = dialog.getBoundingClientRect();
  const isOutside =
    event.clientX < box.left ||
    event.clientX > box.right ||
    event.clientY < box.top ||
    event.clientY > box.bottom;

  // A tap on the backdrop closes the dialog
  if (isOutside) {
    dialog.close();
  }
}

// The reset waiting on each copy group, so a second press starts it again
const copyResets = new WeakMap<HTMLElement, number>();

/**
 * The {@link showCopyOutcome} helper
 * @description Marks a copy group copied or failed for a few seconds, and says so once in its status line; a second press starts the mark again
 * @param {HTMLElement} group - The element whose mark shows the outcome
 * @param {CopyOutcome} outcome - Whether the copy worked
 * @returns {void}
 */
export function showCopyOutcome(group: HTMLElement, outcome: CopyOutcome): void {
  const status = group.querySelector<HTMLElement>(COPY_OUTCOME.STATUS);

  // Clear the last outcome and its waiting reset
  window.clearTimeout(copyResets.get(group));
  delete group.dataset[COPY_OUTCOME.COPIED];
  delete group.dataset[COPY_OUTCOME.FAILED];

  // Show this outcome, and say it in the status line
  group.dataset[outcome] = "";
  if (status) {
    status.textContent = getCopyOutcomeText(status, outcome);
  }

  // After a few seconds the group rests and the status line empties
  const reset = window.setTimeout(() => {
    delete group.dataset[outcome];
    if (status) {
      status.textContent = "";
    }
  }, COPY_OUTCOME.RESET_MS);
  copyResets.set(group, reset);
}

/**
 * The {@link getCopyOutcomeText} helper
 * @description The words a copy group's status line says for an outcome, as the page wrote them on it
 * @param {HTMLElement} status - The status line
 * @param {CopyOutcome} outcome - Whether the copy worked
 * @returns {string} The words to say
 */
function getCopyOutcomeText(status: HTMLElement, outcome: CopyOutcome): string {
  // A failed copy says what to do instead
  if (outcome === COPY_OUTCOME.FAILED) {
    return status.dataset[COPY_OUTCOME.FAILED_TEXT] ?? "";
  }

  // A copy that worked says it was copied
  return status.dataset[COPY_OUTCOME.COPIED_TEXT] ?? "";
}
