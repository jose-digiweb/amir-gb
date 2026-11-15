/**
 * The {@link PRIVACY_COLLECTION} constant
 * @description The content collection that holds the privacy text, one Markdown file per language
 */
export const PRIVACY_COLLECTION = "privacy";

/**
 * The {@link PRIVACY_ERROR} constant
 * @description Why the build stops on the privacy page, for the build log
 */
export const PRIVACY_ERROR = {
  MISSING_TEXT: "src/content/privacy has no Markdown file for the language",
} as const;

/**
 * The {@link PRIVACY_PROMISE} constant
 * @description The three promises the opening makes before the full text
 */
export const PRIVACY_PROMISE = {
  HELP: "help",
  NEVER_SOLD: "never-sold",
  NO_TRACKING: "no-tracking",
} as const;

/**
 * The {@link PRIVACY_PROMISES} constant
 * @description The promises in order, with the translation keys of their title and text
 */
export const PRIVACY_PROMISES = [
  {
    promise: PRIVACY_PROMISE.HELP,
    title: "privacy.promiseHelpTitle",
    text: "privacy.promiseHelpText",
  },
  {
    promise: PRIVACY_PROMISE.NEVER_SOLD,
    title: "privacy.promiseNeverSoldTitle",
    text: "privacy.promiseNeverSoldText",
  },
  {
    promise: PRIVACY_PROMISE.NO_TRACKING,
    title: "privacy.promiseNoTrackingTitle",
    text: "privacy.promiseNoTrackingText",
  },
] as const;

/**
 * The {@link CONTENTS_HEADING_DEPTH} constant
 * @description The heading level that starts a section of the text, and so a link in On this page
 */
export const CONTENTS_HEADING_DEPTH = 2;

/**
 * The {@link UPDATED_DATE_FORMAT} constant
 * @description How the date the text was last approved is written: the day in words, read in UTC as the Markdown date is
 */
export const UPDATED_DATE_FORMAT = { dateStyle: "long", timeZone: "UTC" } as const;

/**
 * The {@link ISO_DAY_LENGTH} constant
 * @description The length of a date written as year, month and day, the start of an ISO timestamp
 */
export const ISO_DAY_LENGTH = 10;
