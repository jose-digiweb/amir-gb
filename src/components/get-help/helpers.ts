// Dependencies
import { getTranslations } from "../../i18n/helpers";
import { CONTACT } from "../../site/constants";
import { ASK_MESSAGE_PARAM, GET_HELP_PLACEHOLDER, HELP_AREA_ITEM, HELP_AREAS } from "./constants";

// Types
import type { Locale } from "../../i18n/types";
import type { HelpAreaView } from "./types";

/**
 * The {@link fillPlaceholder} helper
 * @description Puts a value into a sentence of copy at its placeholder
 * @param {string} template - The copy with the placeholder
 * @param {string} placeholder - The mark to replace, one of {@link GET_HELP_PLACEHOLDER}
 * @param {string} value - What goes in its place
 * @returns {string} The sentence with the value
 */
export function fillPlaceholder(template: string, placeholder: string, value: string): string {
  return template.replace(placeholder, value);
}

/**
 * The {@link getAskHref} helper
 * @description A WhatsApp link to AMIR-GB with a message already typed
 * @param {string} message - The message the visitor starts with
 * @returns {string} The link
 */
export function getAskHref(message: string): string {
  return `${CONTACT.WHATSAPP_HREF}?${ASK_MESSAGE_PARAM}=${encodeURIComponent(message)}`;
}

/**
 * The {@link getHelpAreaViews} helper
 * @description Every area of help in the page's language, each with its WhatsApp link that names the topic
 * @param {Locale} locale - The page's language
 * @returns {HelpAreaView[]} The areas, in the page's order
 */
export function getHelpAreaViews(locale: Locale): HelpAreaView[] {
  const t = getTranslations(locale);

  // Each area gets its name, its points and a message that names it
  return HELP_AREAS.map((area) => {
    const title = t[area.title];
    const message = fillPlaceholder(t["getHelp.askMessage"], GET_HELP_PLACEHOLDER.TOPIC, title);
    return {
      service: area.service,
      tint: area.tint,
      title,
      points: area.points.map((point) => t[point]),
      askHref: getAskHref(message),
    };
  });
}

/**
 * The {@link openHelpAreaFromHash} helper
 * @description On a phone, opens the accordion row the address names (a home tile links to /get-help/#letters) and scrolls to it
 * @returns {void}
 */
export function openHelpAreaFromHash(): void {
  const topic = window.location.hash.slice(1);

  // Without a topic in the address, the first row stays open as the page draws it
  if (!topic) {
    return;
  }

  // Only a row the visitor can see opens: on tablet and desktop the cards show every topic
  const rows = document.querySelectorAll<HTMLDetailsElement>(HELP_AREA_ITEM.SELECTOR);
  const row = [...rows].find((item) => item.dataset.helpArea === topic);
  if (!row?.offsetParent) {
    return;
  }

  // Open it, which closes the others in its group, and bring it into view
  row.open = true;
  row.scrollIntoView({ block: "start" });
}
