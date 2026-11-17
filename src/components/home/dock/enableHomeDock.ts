// Dependencies
import { HOME_DOCK } from "./constants";
import { opensKeyboard } from "./helpers";

/**
 * The {@link enableHomeDock} helper
 * @description Shows the phone's dock once the first screen has scrolled away, and hides it at the footer and while a field has the keyboard open
 * @returns {void}
 */
export function enableHomeDock(): void {
  const dock = document.querySelector<HTMLElement>(HOME_DOCK.SELECTOR);
  const opening = document.querySelector(HOME_DOCK.OPENING_SELECTOR);
  const footer = document.querySelector(HOME_DOCK.FOOTER_SELECTOR);

  // Without all three there is nothing to follow
  if (!dock || !opening || !footer) {
    return;
  }

  const state = { isPastOpening: false, isAtFooter: false, isTyping: false };

  // The dock shows only past the first screen, before the footer, with no keyboard open
  const render = () => {
    dock.toggleAttribute(
      HOME_DOCK.SHOWN_ATTRIBUTE,
      state.isPastOpening && !state.isAtFooter && !state.isTyping,
    );
  };

  // The first screen is past once it has left the top of the window
  new IntersectionObserver(([entry]) => {
    state.isPastOpening = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    render();
  }).observe(opening);

  // The footer has the same actions, so the dock steps aside for it
  new IntersectionObserver(([entry]) => {
    state.isAtFooter = entry.isIntersecting;
    render();
  }).observe(footer);

  // A field that opens the keyboard hides the dock until it lets go
  document.addEventListener(HOME_DOCK.FOCUS_IN, (event) => {
    state.isTyping = opensKeyboard(event.target);
    render();
  });
  document.addEventListener(HOME_DOCK.FOCUS_OUT, () => {
    state.isTyping = false;
    render();
  });
}
