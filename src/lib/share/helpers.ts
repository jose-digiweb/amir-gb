// Dependencies
import { WHATSAPP_SHARE } from "./constants";

/**
 * The {@link getWhatsAppShareHref} helper
 * @description A link that opens WhatsApp with a message and a page's address, for the visitor to send to a friend
 * @param {string} text - The message in the page's language
 * @param {string} pageUrl - The address to share
 * @returns {string} The WhatsApp link
 */
export function getWhatsAppShareHref(text: string, pageUrl: string): string {
  const query = new URLSearchParams({ [WHATSAPP_SHARE.PARAM]: `${text} ${pageUrl}` });
  return `${WHATSAPP_SHARE.URL}?${query.toString()}`;
}
