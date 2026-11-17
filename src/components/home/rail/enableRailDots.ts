// Dependencies
import { RAIL } from "./constants";

/**
 * The {@link enableRailDots} helper
 * @description Moves each swipe row's long dot to the card the row has scrolled to
 * @returns {void}
 */
export function enableRailDots(): void {
  // Every row on the page that has dots
  for (const row of document.querySelectorAll<HTMLElement>(RAIL.ROW_SELECTOR)) {
    const id = row.getAttribute(RAIL.ROW_ATTRIBUTE);
    const dots = document.querySelector(`[${RAIL.DOTS_ATTRIBUTE}="${id}"]`);

    // A row without dots has nothing to follow
    if (!dots) {
      continue;
    }
    followRow(row, Array.from(dots.children));
  }
}

/**
 * The {@link followRow} helper
 * @description Marks the dot of the card a row shows, once per frame while it scrolls
 * @param {HTMLElement} row - The swipe row
 * @param {Element[]} dots - Its dots, one per card
 * @returns {void}
 */
function followRow(row: HTMLElement, dots: Element[]): void {
  let frame = 0;

  // Mark one dot per frame at most
  row.addEventListener(
    RAIL.SCROLL,
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => markCurrent(dots, getCurrentIndex(row, dots.length)));
    },
    { passive: true },
  );
}

/**
 * The {@link getCurrentIndex} helper
 * @description Which card a row has scrolled to: the last once it reaches its end, else the nearest to its start
 * @param {HTMLElement} row - The swipe row
 * @param {number} count - How many cards it holds
 * @returns {number} The card's index
 */
function getCurrentIndex(row: HTMLElement, count: number): number {
  const end = row.scrollWidth - row.clientWidth;

  // The end of the row shows its last card, however wide the screen
  if (row.scrollLeft >= end - 1) {
    return count - 1;
  }

  // Otherwise the card nearest the row's start
  const step = end / Math.max(count - 1, 1);
  return Math.round(row.scrollLeft / step);
}

/**
 * The {@link markCurrent} helper
 * @description Marks one dot as current and clears the rest
 * @param {Element[]} dots - The dots
 * @param {number} current - The index to mark
 * @returns {void}
 */
function markCurrent(dots: Element[], current: number): void {
  // Only the current dot carries the mark
  for (const [index, dot] of dots.entries()) {
    dot.toggleAttribute(RAIL.CURRENT_ATTRIBUTE, index === current);
  }
}
