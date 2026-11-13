// Dependencies
import { COPY_ACCOUNT } from "./constants";

/**
 * The {@link enableCopyAccount} helper
 * @description Lets the bank transfer bar's button copy the account number and show it was copied for a few seconds
 * @returns {void}
 */
export function enableCopyAccount(): void {
  for (const root of document.querySelectorAll<HTMLElement>(COPY_ACCOUNT.ROOT)) {
    const button = root.querySelector<HTMLButtonElement>(COPY_ACCOUNT.BUTTON);
    button?.addEventListener(COPY_ACCOUNT.CLICK, () => copyAccount(root));
  }
}

/**
 * The {@link copyAccount} helper
 * @description Copies the account number without spaces and marks the bar copied until the reset
 * @param {HTMLElement} root - The bank transfer bar
 * @returns {Promise<void>}
 */
async function copyAccount(root: HTMLElement): Promise<void> {
  const iban = (root.getAttribute(COPY_ACCOUNT.VALUE_ATTRIBUTE) ?? "").replace(
    COPY_ACCOUNT.SPACES,
    "",
  );

  // A blocked clipboard leaves the bar as it was, the number stays readable to copy by hand
  try {
    await navigator.clipboard.writeText(iban);
  } catch {
    return;
  }

  // Show the copied state, then return to the copy button
  root.dataset[COPY_ACCOUNT.COPIED] = "";
  window.setTimeout(() => {
    delete root.dataset[COPY_ACCOUNT.COPIED];
  }, COPY_ACCOUNT.RESET_MS);
}
