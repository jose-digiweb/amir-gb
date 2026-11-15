/**
 * The {@link MILESTONE_PRECISION} constant
 * @description How exactly a milestone's date is known: to the day, or only its month
 */
export const MILESTONE_PRECISION = {
  DAY: "day",
  MONTH: "month",
} as const;

/**
 * The {@link MILESTONE_STATE} constant
 * @description Whether a milestone has happened or is still coming up
 */
export const MILESTONE_STATE = {
  DONE: "done",
  COMING: "coming",
} as const;

/**
 * The {@link MILESTONE_ATTRIBUTE} constant
 * @description The attributes a milestone on the page carries, so a script can update its state by today's date
 */
export const MILESTONE_ATTRIBUTE = {
  SELECTOR: "[data-milestone-date]",
  DATE: "milestoneDate",
  PRECISION: "milestonePrecision",
  STATE: "state",
} as const;

/**
 * The {@link MONTH_LENGTH} constant
 * @description How many characters of a YYYY-MM-DD date name its month
 */
export const MONTH_LENGTH = 7;

/**
 * The {@link ISO_DAY_LOCALE} constant
 * @description A locale whose short date is YYYY-MM-DD, for reading today's date in the site's time zone
 */
export const ISO_DAY_LOCALE = "en-CA";
