// Dependencies
import { INTL_LOCALE } from "../../i18n/constants";
import { getTranslations } from "../../i18n/helpers";
import { SITE_TIME_ZONE } from "../../lib/content/constants";
import { getEventDay } from "../../lib/content/helpers";
import { MILESTONE_PRECISION } from "../../lib/timeline/constants";
import { getMilestoneState, getSiteToday } from "../../lib/timeline/helpers";
import { LEGAL } from "../../site/constants";
import { AIM_NUMBER_DIGITS, MILESTONE_NOON, MILESTONES, TAX_PLACEHOLDER } from "./constants";

// Types
import type { Locale } from "../../i18n/types";
import type { Milestone, MilestoneView } from "./types";

/**
 * The {@link getAimNumber} helper
 * @description An aim's number as the list shows it, with a leading zero
 * @param {number} index - The aim's place in the list, from zero
 * @returns {string} For example "01"
 */
export function getAimNumber(index: number): string {
  return String(index + 1).padStart(AIM_NUMBER_DIGITS, "0");
}

/**
 * The {@link getInitials} helper
 * @description A person's initials for their portrait placeholder: the first letters of their first and last names
 * @param {string} name - Their full name
 * @returns {string} For example "CR" for Cesaltina Pereira dos Reis
 */
export function getInitials(name: string): string {
  const words = name.split(" ").filter(Boolean);
  const first = words.at(0) ?? "";
  const last = words.at(-1) ?? "";

  // One name gives one letter, more give the first and the last
  if (words.length < 2) {
    return first.charAt(0);
  }
  return `${first.charAt(0)}${last.charAt(0)}`;
}

/**
 * The {@link getMilestoneWhen} helper
 * @description A milestone's day and month, or only its month, in the page's language and Dutch time
 * @param {Milestone} milestone - The milestone
 * @param {Date} date - Its date as a moment
 * @param {string} intlLocale - The page's locale for dates
 * @returns {string} For example "20 Jul" or "Mar"
 */
function getMilestoneWhen(milestone: Milestone, date: Date, intlLocale: string): string {
  const { day, month } = getEventDay(date, intlLocale);

  // A month-only milestone shows its month alone
  if (milestone.precision === MILESTONE_PRECISION.MONTH) {
    return month;
  }
  return `${day} ${month}`;
}

/**
 * The {@link getMilestoneViews} helper
 * @description AMIR-GB's first months in the page's language, each done or coming up on the given day
 * @param {Locale} locale - The page's language
 * @param {Date} now - The moment the page is built
 * @returns {MilestoneView[]} The milestones in order, every one but the last stitched to the next
 */
export function getMilestoneViews(locale: Locale, now: Date): MilestoneView[] {
  const t = getTranslations(locale);
  const intlLocale = INTL_LOCALE[locale];
  const today = getSiteToday(now);
  const year = new Intl.DateTimeFormat(intlLocale, { year: "numeric", timeZone: SITE_TIME_ZONE });

  // Each milestone gets its written date, its words and its state
  return MILESTONES.map((milestone, index) => {
    const date = new Date(`${milestone.date}${MILESTONE_NOON}`);
    return {
      date: milestone.date,
      precision: milestone.precision,
      when: getMilestoneWhen(milestone, date, intlLocale),
      year: year.format(date),
      text: t[milestone.text],
      state: getMilestoneState(milestone, today),
      joinsNext: index < MILESTONES.length - 1,
    };
  });
}

/**
 * The {@link getTaxStatusText} helper
 * @description The legal and tax status sentence in the page's language, with AMIR-GB's registration numbers
 * @param {Locale} locale - The page's language
 * @returns {string} The sentence
 */
export function getTaxStatusText(locale: Locale): string {
  return getTranslations(locale)
    ["about.taxText"].replace(TAX_PLACEHOLDER.KVK, LEGAL.KVK_NUMBER)
    .replace(TAX_PLACEHOLDER.RSIN, LEGAL.RSIN_NUMBER);
}
