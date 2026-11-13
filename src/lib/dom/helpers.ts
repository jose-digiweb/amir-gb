// Dependencies
import { ATTRIBUTE, COMMAND, FEATURE, SELECTOR } from "./constants";

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
      button.addEventListener("click", () => runCommand(button));
    }
  }

  // A tap outside a light-dismiss dialog closes it
  if (!hasClosedBy) {
    for (const dialog of document.querySelectorAll<HTMLDialogElement>(
      SELECTOR.LIGHT_DISMISS_DIALOG,
    )) {
      dialog.addEventListener("click", (event) => closeOnOutsideTap(dialog, event));
    }
  }
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

  // Show-modal opens the dialog
  if (command === COMMAND.SHOW_MODAL) {
    dialog.showModal();
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
