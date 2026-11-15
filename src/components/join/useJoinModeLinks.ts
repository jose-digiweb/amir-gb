// Dependencies
import { onBeforeUnmount, onMounted } from "vue";
import { JOIN_MODES } from "../../lib/join/constants";
import { HASH_SIGN, JOIN_MODE_ID, LINK_SELECTOR } from "./constants";

// Types
import type { Ref } from "vue";
import type { JoinMode } from "../../lib/join/types";

/**
 * The {@link useJoinModeLinks} composable
 * @description Lets the page's Become a member and Volunteer links pick the form's mode, on arrival and on every click
 * @param {Ref<JoinMode>} mode - The form's mode
 * @returns {void}
 */
export function useJoinModeLinks(mode: Ref<JoinMode>): void {
  /**
   * The {@link pickFromHash} helper
   * @description Picks the mode a link's address names, if it names one
   * @param {string} hash - The address's part after #, with the #
   * @returns {void}
   */
  function pickFromHash(hash: string): void {
    const picked = JOIN_MODES.find((value) => `${HASH_SIGN}${JOIN_MODE_ID[value]}` === hash);
    if (picked) {
      mode.value = picked;
    }
  }

  /**
   * The {@link onClick} helper
   * @description Picks the mode when a link on the page names one, even when the address already does
   * @param {MouseEvent} event - A click anywhere on the page
   * @returns {void}
   */
  function onClick(event: MouseEvent): void {
    if (!(event.target instanceof Element)) {
      return;
    }
    const link = event.target.closest(LINK_SELECTOR);
    if (link) {
      pickFromHash(link.hash);
    }
  }

  // The address the visitor came with picks first, then every click on a mode link
  onMounted(() => {
    pickFromHash(window.location.hash);
    document.addEventListener("click", onClick);
  });
  onBeforeUnmount(() => {
    document.removeEventListener("click", onClick);
  });
}
