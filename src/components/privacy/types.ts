// Types
import type { PRIVACY_PROMISE } from "./constants";

/**
 * The {@link PrivacyPromise} type
 * @description One of the {@link PRIVACY_PROMISE} values
 */
export type PrivacyPromise = (typeof PRIVACY_PROMISE)[keyof typeof PRIVACY_PROMISE];

/**
 * The {@link PrivacyPromiseView} type
 * @description A promise as its card shows it, in the page's language
 */
export type PrivacyPromiseView = {
  promise: PrivacyPromise;
  title: string;
  text: string;
};

/**
 * The {@link ContentsLink} type
 * @description One link of On this page: the section's anchor and its heading
 */
export type ContentsLink = {
  slug: string;
  text: string;
};
