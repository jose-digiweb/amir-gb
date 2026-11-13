// Dependencies
import {
  COLOR_SCHEME_AUTO,
  THEME,
  THEME_DATA,
  THEME_EVENT,
  THEME_KEY,
  THEME_OVERRIDES,
  THEME_SELECTOR,
  THEME_STORAGE_KEY,
  THEME_SWITCHING_ATTRIBUTE,
} from "./constants";

// Types
import type { ThemeChoice, ThemeOverride } from "./types";

/**
 * The {@link isThemeOverride} helper
 * @description Whether a value is Light or Dark, a choice that overrides the device
 * @param {ThemeChoice} choice - The choice to check
 * @returns {boolean} True for Light and Dark
 */
export function isThemeOverride(choice: ThemeChoice): choice is ThemeOverride {
  return THEME_OVERRIDES.some((override) => override === choice);
}

/**
 * The {@link parseThemeChoice} helper
 * @description Reads a stored or picked value as a choice, falling back to Automatic
 * @param {string | null} value - The raw value from storage or a radio
 * @returns {ThemeChoice} The choice it names, or Automatic
 */
export function parseThemeChoice(value: string | null): ThemeChoice {
  const choice = Object.values(THEME).find((theme) => theme === value);

  // Anything that is not a known choice means Automatic
  if (choice === undefined) {
    return THEME.AUTO;
  }

  // A known value is the choice
  return choice;
}

/**
 * The {@link readThemeChoice} helper
 * @description Reads the choice this device remembers
 * @returns {ThemeChoice} The stored choice, or Automatic when none is stored or storage is blocked
 */
export function readThemeChoice(): ThemeChoice {
  // Storage can be blocked, which means Automatic
  try {
    return parseThemeChoice(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    return THEME.AUTO;
  }
}

/**
 * The {@link saveThemeChoice} helper
 * @description Remembers a choice on this device; Automatic forgets it
 * @param {ThemeChoice} choice - The choice to remember
 * @returns {void}
 */
function saveThemeChoice(choice: ThemeChoice): void {
  // Storage can be blocked; the choice still applies to this page
  try {
    // Light and Dark are stored
    if (isThemeOverride(choice)) {
      localStorage.setItem(THEME_STORAGE_KEY, choice);
      return;
    }

    // Automatic removes the stored choice
    localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    return;
  }
}

/**
 * The {@link setThemeOnPage} helper
 * @description Sets a choice on html and on the color-scheme meta
 * @param {ThemeChoice} choice - The choice to set
 * @returns {void}
 */
function setThemeOnPage(choice: ThemeChoice): void {
  const root = document.documentElement;
  const meta = document.querySelector<HTMLMetaElement>(THEME_SELECTOR.COLOR_SCHEME_META);

  // Light and Dark override the device
  if (isThemeOverride(choice)) {
    root.dataset[THEME_DATA.THEME] = choice;
    if (meta) meta.content = choice;
    return;
  }

  // Automatic follows the device
  delete root.dataset[THEME_DATA.THEME];
  if (meta) meta.content = COLOR_SCHEME_AUTO;
}

/**
 * The {@link applyThemeChoice} helper
 * @description Switches the page to a choice at once, with transitions paused for one frame
 * @param {ThemeChoice} choice - The choice to apply
 * @returns {void}
 */
function applyThemeChoice(choice: ThemeChoice): void {
  const root = document.documentElement;

  // Pause transitions so nothing cross-fades between themes, then switch
  root.toggleAttribute(THEME_SWITCHING_ATTRIBUTE, true);
  setThemeOnPage(choice);

  // Resume transitions once the new theme has painted
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      root.toggleAttribute(THEME_SWITCHING_ATTRIBUTE, false);
    });
  });
}

/**
 * The {@link syncThemeInputs} helper
 * @description Checks the matching radio in every appearance control
 * @param {ThemeChoice} choice - The current choice
 * @returns {void}
 */
function syncThemeInputs(choice: ThemeChoice): void {
  for (const input of document.querySelectorAll<HTMLInputElement>(THEME_SELECTOR.INPUT)) {
    input.checked = input.value === choice;
  }
}

/**
 * The {@link pickThemeChoice} helper
 * @description Applies, remembers and shows a choice picked in any appearance control
 * @param {HTMLInputElement} input - The radio that was picked
 * @returns {void}
 */
function pickThemeChoice(input: HTMLInputElement): void {
  const choice = parseThemeChoice(input.value);

  // Apply it, remember it and show it in every control
  applyThemeChoice(choice);
  saveThemeChoice(choice);
  syncThemeInputs(choice);
}

/**
 * The {@link followStoredThemeChoice} helper
 * @description Follows a choice made in another tab of the site
 * @param {StorageEvent} event - The storage change
 * @returns {void}
 */
function followStoredThemeChoice(event: StorageEvent): void {
  // Only the theme's own key matters
  if (event.key !== THEME_STORAGE_KEY) {
    return;
  }

  // Apply and show the other tab's choice
  const choice = parseThemeChoice(event.newValue);
  applyThemeChoice(choice);
  syncThemeInputs(choice);
}

/**
 * The {@link restoreThemeChoice} helper
 * @description Catches up with a pick made on another page when this one comes back from the back and forward cache
 * @param {PageTransitionEvent} event - The page being shown
 * @returns {void}
 */
function restoreThemeChoice(event: PageTransitionEvent): void {
  // A fresh load already has the remembered choice
  if (!event.persisted) {
    return;
  }

  // Apply and show the remembered choice
  const choice = readThemeChoice();
  applyThemeChoice(choice);
  syncThemeInputs(choice);
}

/**
 * The {@link enableThemeChoice} helper
 * @description Shows the remembered choice in every appearance control and applies new picks
 * @returns {void}
 */
export function enableThemeChoice(): void {
  // Check the remembered choice in every control
  syncThemeInputs(readThemeChoice());

  // A pick in any control applies at once
  for (const input of document.querySelectorAll<HTMLInputElement>(THEME_SELECTOR.INPUT)) {
    input.addEventListener(THEME_EVENT.CHANGE, () => pickThemeChoice(input));
  }

  // A choice made in another tab, or on another page before going back, follows here
  window.addEventListener(THEME_EVENT.STORAGE, followStoredThemeChoice);
  window.addEventListener(THEME_EVENT.PAGESHOW, restoreThemeChoice);
}

/**
 * The {@link closeThemeListOnPick} helper
 * @description Closes the appearance card when a row is picked with a pointer
 * @param {MouseEvent} event - The click on a row
 * @returns {void}
 */
function closeThemeListOnPick(event: MouseEvent): void {
  const row = event.currentTarget;

  // A click forwarded to the radio, or a key press on it, keeps the card open
  if (event.target instanceof HTMLInputElement || !(row instanceof HTMLElement)) {
    return;
  }

  // A pointer pick closes the card it sits in
  closeThemeList(row);
}

/**
 * The {@link closeThemeListOnEnter} helper
 * @description Closes the appearance card when Enter confirms the row the arrows reached
 * @param {KeyboardEvent} event - The key press on a row's radio
 * @returns {void}
 */
function closeThemeListOnEnter(event: KeyboardEvent): void {
  // Only Enter confirms; the arrows already apply each row as they move
  if (event.key !== THEME_KEY.ENTER || !(event.currentTarget instanceof HTMLElement)) {
    return;
  }

  // Close the card the row sits in, without the same press reaching its button
  event.preventDefault();
  closeThemeList(event.currentTarget);
}

/**
 * The {@link closeThemeList} helper
 * @description Closes the open appearance card around a row
 * @param {HTMLElement} row - A row inside the card
 * @returns {void}
 */
function closeThemeList(row: HTMLElement): void {
  const popover = row.closest<HTMLElement>(THEME_SELECTOR.POPOVER);

  // Only an open card closes
  if (!popover?.matches(THEME_SELECTOR.OPEN_POPOVER)) {
    return;
  }

  // Close it and give focus back to its button, which sits right before it
  const hadFocus = popover.contains(document.activeElement);
  popover.hidePopover();
  if (hadFocus && popover.previousElementSibling instanceof HTMLElement) {
    popover.previousElementSibling.focus();
  }
}

/**
 * The {@link enableThemeListClose} helper
 * @description Lets a pointer pick, or Enter on a row, close the appearance card, as the design asks
 * @returns {void}
 */
export function enableThemeListClose(): void {
  for (const row of document.querySelectorAll<HTMLElement>(THEME_SELECTOR.LIST_ROW)) {
    row.addEventListener(THEME_EVENT.CLICK, closeThemeListOnPick);
    row.addEventListener(THEME_EVENT.KEYDOWN, closeThemeListOnEnter);
  }
}
