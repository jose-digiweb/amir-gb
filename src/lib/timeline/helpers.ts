// Dependencies
import { SITE_TIME_ZONE } from "../content/constants";
import {
  ISO_DAY_LOCALE,
  MILESTONE_ATTRIBUTE,
  MILESTONE_PRECISION,
  MILESTONE_STATE,
  MONTH_LENGTH,
} from "./constants";

// Types
import type { MilestoneDate, MilestonePrecision, MilestoneState } from "./types";

/**
 * The {@link getSiteToday} helper
 * @description Today's date in Dutch time, as YYYY-MM-DD
 * @param {Date} now - The moment to read
 * @returns {string} The date in the Netherlands at that moment
 */
export function getSiteToday(now: Date): string {
  return new Intl.DateTimeFormat(ISO_DAY_LOCALE, { timeZone: SITE_TIME_ZONE }).format(now);
}

/**
 * The {@link getMilestoneState} helper
 * @description Whether a milestone has happened: a day once it has passed, a month once it has ended
 * @param {MilestoneDate} milestone - When the milestone happens
 * @param {string} today - Today's date in Dutch time, as YYYY-MM-DD
 * @returns {MilestoneState} Done or coming up
 */
export function getMilestoneState(milestone: MilestoneDate, today: string): MilestoneState {
  // A month counts as done once a later month has begun
  if (milestone.precision === MILESTONE_PRECISION.MONTH) {
    const month = milestone.date.slice(0, MONTH_LENGTH);
    if (today.slice(0, MONTH_LENGTH) > month) {
      return MILESTONE_STATE.DONE;
    }
    return MILESTONE_STATE.COMING;
  }

  // A day counts as done once it has passed
  if (today > milestone.date) {
    return MILESTONE_STATE.DONE;
  }
  return MILESTONE_STATE.COMING;
}

/**
 * The {@link isMilestonePrecision} helper
 * @description Whether a value read from the page is one of the {@link MILESTONE_PRECISION} values
 * @param {string | undefined} value - The value to check
 * @returns {boolean} True when it is a precision
 */
function isMilestonePrecision(value: string | undefined): value is MilestonePrecision {
  return Object.values(MILESTONE_PRECISION).some((precision) => precision === value);
}

/**
 * The {@link refreshMilestones} helper
 * @description Marks every milestone on the page done or coming up by today's date, so the page stays right between builds
 * @returns {void}
 */
export function refreshMilestones(): void {
  const today = getSiteToday(new Date());

  // Each milestone reads its own date and wears its state
  for (const item of document.querySelectorAll<HTMLElement>(MILESTONE_ATTRIBUTE.SELECTOR)) {
    const date = item.dataset[MILESTONE_ATTRIBUTE.DATE];
    const precision = item.dataset[MILESTONE_ATTRIBUTE.PRECISION];
    if (date && isMilestonePrecision(precision)) {
      item.dataset[MILESTONE_ATTRIBUTE.STATE] = getMilestoneState({ date, precision }, today);
    }
  }
}
