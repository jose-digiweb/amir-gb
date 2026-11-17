// Dependencies
import { OPENER_SEPARATOR } from "./constants";

// Types
import type { OpenerItem } from "./types";

/**
 * The {@link getOpenerItems} helper
 * @description Splits an opener label into its items, each with its language when the label mixes languages
 * @param {string} label - The label, items joined by the opener separator
 * @param {readonly string[]} langs - Each item's language tag, in order, when the label mixes languages
 * @returns {OpenerItem[]} The items
 */
export function getOpenerItems(label: string, langs: readonly string[] = []): OpenerItem[] {
  return label.split(OPENER_SEPARATOR).map((text, index) => ({ text, lang: langs[index] }));
}
