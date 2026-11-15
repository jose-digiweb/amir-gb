// Dependencies
import { getRelativeLocaleUrl } from "astro:i18n";
import { getTranslations } from "../../i18n/helpers";
import { TILE_COLOUR } from "../../lib/content/constants";
import {
  JOIN_ERROR,
  JOIN_MODE,
  JOIN_MODE_LABEL,
  JOIN_MODES,
  JOIN_PLACEHOLDER,
  JOIN_SKILL,
  JOIN_SKILL_IN_SENTENCE,
  JOIN_SKILL_LABEL,
  JOIN_SKILLS,
} from "../../lib/join/constants";
import {
  ANSWER_LANGUAGE,
  ANSWER_LANGUAGE_IN_SENTENCE,
  ANSWER_LANGUAGE_LABEL,
  ANSWER_LANGUAGES,
  CONTACT,
  ROUTE,
} from "../../site/constants";
import {
  HASH_SIGN,
  HYPHEN,
  JOIN_ERROR_LABEL,
  JOIN_MODE_ID,
  JOIN_SUMMARY_TITLE,
  JOIN_WAY,
  SEAT_CIRCLE,
  SEAT_TINTS,
  WORD_JOINER,
} from "./constants";

// Types
import type { Locale, TranslationKey, Translations } from "../../i18n/types";
import type { JoinMode } from "../../lib/join/types";
import type { Disc } from "../opening/types";
import type {
  FeeSentence,
  JoinFormCopy,
  JoinStepCopy,
  Seat,
  SeatCircle,
  WayCardData,
} from "./types";

/**
 * The {@link splitAtFee} helper
 * @description Cuts a sentence where the fee goes, so the fee's placeholder can be marked as a fact still to come
 * @param {string} text - The sentence, which may hold {fee}
 * @param {string} fee - The fee's placeholder
 * @returns {FeeSentence} The words before the fee, the fee, and the words after it
 */
export function splitAtFee(text: string, fee: string): FeeSentence {
  const at = text.indexOf(JOIN_PLACEHOLDER.FEE);

  // A sentence without the fee is all words
  if (at < 0) {
    return { before: text, after: "" };
  }

  // The words around the fee
  return { before: text.slice(0, at), fee, after: text.slice(at + JOIN_PLACEHOLDER.FEE.length) };
}

/**
 * The {@link keepNameWhole} helper
 * @description Keeps the association's name on one line inside a heading, so AMIR-GB never breaks at its hyphen
 * @param {string} text - The heading
 * @param {string} name - The association's name
 * @returns {string} The heading with the name held together
 */
export function keepNameWhole(text: string, name: string): string {
  return text.replaceAll(name, name.replaceAll(HYPHEN, `${HYPHEN}${WORD_JOINER}`));
}

/**
 * The {@link getStep} helper
 * @description One step of What happens next in the page's language
 * @param {Translations} t - The page's copy
 * @param {TranslationKey} title - The step's title key
 * @param {TranslationKey} text - The step's sentence key
 * @returns {JoinStepCopy} The step, its sentence cut where the fee goes
 */
function getStep(t: Translations, title: TranslationKey, text: TranslationKey): JoinStepCopy {
  return { title: t[title], sentence: splitAtFee(t[text], t["joinPage.fee"]) };
}

/**
 * The {@link getJoinFormCopy} helper
 * @description Every word the sign-up form and its next steps show, in the page's language, for the Vue island
 * @param {Locale} locale - The page's language
 * @returns {JoinFormCopy} The form's copy
 */
export function getJoinFormCopy(locale: Locale): JoinFormCopy {
  const t = getTranslations(locale);
  const confirm = getStep(t, "joinPage.step.confirm.title", "joinPage.step.confirm.text");
  return {
    modeLabel: t["joinPage.modeLabel"],
    modes: JOIN_MODES.map((value) => ({ value, label: t[JOIN_MODE_LABEL[value]] })),
    nameLabel: t["joinPage.nameLabel"],
    namePlaceholder: t["joinPage.namePlaceholder"],
    emailLabel: t["joinPage.emailLabel"],
    phoneLabel: t["joinPage.phoneLabel"],
    optional: t["joinPage.optional"],
    placeLabel: t["joinPage.placeLabel"],
    placeHint: t["joinPage.placeHint"],
    languageLabel: t["joinPage.languageLabel"],
    languages: ANSWER_LANGUAGES.map((value) => ({ value, label: t[ANSWER_LANGUAGE_LABEL[value]] })),
    skillsLabel: t["joinPage.skillsLabel"],
    skills: JOIN_SKILLS.map((value) => ({ value, label: t[JOIN_SKILL_LABEL[value]] })),
    messageLabel: t["joinPage.messageLabel"],
    messagePlaceholder: t["joinPage.messagePlaceholder"],
    consent: t["joinPage.consent"],
    privacy: t["footer.privacy"],
    send: t["joinPage.send"],
    sending: t["joinPage.sending"],
    errors: {
      [JOIN_ERROR.NAME_MISSING]: t[JOIN_ERROR_LABEL[JOIN_ERROR.NAME_MISSING]],
      [JOIN_ERROR.EMAIL_MISSING]: t[JOIN_ERROR_LABEL[JOIN_ERROR.EMAIL_MISSING]],
      [JOIN_ERROR.EMAIL_INCOMPLETE]: t[JOIN_ERROR_LABEL[JOIN_ERROR.EMAIL_INCOMPLETE]],
      [JOIN_ERROR.EMAIL_INVALID]: t[JOIN_ERROR_LABEL[JOIN_ERROR.EMAIL_INVALID]],
      [JOIN_ERROR.PLACE_MISSING]: t[JOIN_ERROR_LABEL[JOIN_ERROR.PLACE_MISSING]],
      [JOIN_ERROR.SKILLS_MISSING]: t[JOIN_ERROR_LABEL[JOIN_ERROR.SKILLS_MISSING]],
      [JOIN_ERROR.CONSENT_MISSING]: t[JOIN_ERROR_LABEL[JOIN_ERROR.CONSENT_MISSING]],
    },
    summaryTitles: JOIN_SUMMARY_TITLE.map((key) => t[key]),
    summaryFields: {
      name: t["joinPage.summaryField.name"],
      email: t["joinPage.summaryField.email"],
      place: t["joinPage.summaryField.place"],
      skills: t["joinPage.summaryField.skills"],
      consent: t["joinPage.summaryField.consent"],
    },
    memberSteps: [
      confirm,
      getStep(t, "joinPage.step.fee.title", "joinPage.step.fee.text"),
      getStep(t, "joinPage.step.in.title", "joinPage.step.in.text"),
    ],
    volunteerSteps: [
      confirm,
      getStep(t, "joinPage.step.contact.title", "joinPage.step.contact.text"),
    ],
    sentOpener: t["joinPage.sentOpener"],
    sentMemberTitle: keepNameWhole(t["joinPage.sentMemberTitle"], t["site.name"]),
    sentMemberText: t["joinPage.sentMemberText"],
    sentVolunteerTitle: t["joinPage.sentVolunteerTitle"],
    sentVolunteerText: t["joinPage.sentVolunteerText"],
    languagesInSentence: {
      [ANSWER_LANGUAGE.NL]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.NL]],
      [ANSWER_LANGUAGE.EN]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.EN]],
      [ANSWER_LANGUAGE.PT]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.PT]],
      [ANSWER_LANGUAGE.KRIOL]: t[ANSWER_LANGUAGE_IN_SENTENCE[ANSWER_LANGUAGE.KRIOL]],
    },
    skillsInSentence: {
      [JOIN_SKILL.TEACHING]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.TEACHING]],
      [JOIN_SKILL.HEALTH]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.HEALTH]],
      [JOIN_SKILL.LAW]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.LAW]],
      [JOIN_SKILL.TRANSLATION]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.TRANSLATION]],
      [JOIN_SKILL.LOGISTICS]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.LOGISTICS]],
      [JOIN_SKILL.EVENTS]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.EVENTS]],
      [JOIN_SKILL.OTHER]: t[JOIN_SKILL_IN_SENTENCE[JOIN_SKILL.OTHER]],
    },
    seeWhatsOn: t["joinPage.seeWhatsOn"],
    tellFriend: t["joinPage.tellFriend"],
    failedTitle: t["joinPage.failedTitle"],
    failedText: t["joinPage.failedText"],
    tryAgain: t["joinPage.tryAgain"],
    whatsapp: t["contact.whatsapp"],
  };
}

/**
 * The {@link getModeHref} helper
 * @description The link that scrolls to the form and picks a mode
 * @param {JoinMode} mode - The mode to pick
 * @returns {string} The link to that mode's radio
 */
export function getModeHref(mode: JoinMode): string {
  return `${HASH_SIGN}${JOIN_MODE_ID[mode]}`;
}

/**
 * The {@link getWayCards} helper
 * @description The four ways to take part, in the page's language, ready for their cards
 * @param {Locale} locale - The page's language
 * @returns {WayCardData[]} Member, volunteer, partner and give
 */
export function getWayCards(locale: Locale): WayCardData[] {
  const t = getTranslations(locale);
  const fee = t["joinPage.fee"];
  return [
    {
      way: JOIN_WAY.MEMBER,
      tint: TILE_COLOUR.GOLD,
      title: t["joinPage.way.member.title"],
      sentence: splitAtFee(t["joinPage.way.member.text"], fee),
      action: t["joinPage.way.member.action"],
      href: getModeHref(JOIN_MODE.MEMBER),
      isMain: true,
    },
    {
      way: JOIN_WAY.VOLUNTEER,
      tint: TILE_COLOUR.FOREST,
      title: t["joinPage.way.volunteer.title"],
      sentence: splitAtFee(t["joinPage.way.volunteer.text"], fee),
      action: t["joinPage.way.volunteer.action"],
      href: getModeHref(JOIN_MODE.VOLUNTEER),
      isMain: false,
    },
    {
      way: JOIN_WAY.PARTNER,
      tint: TILE_COLOUR.NAVY,
      title: t["joinPage.way.partner.title"],
      sentence: splitAtFee(t["joinPage.way.partner.text"], fee),
      action: t["joinPage.way.partner.action"],
      href: CONTACT.EMAIL_HREF,
      isMain: false,
    },
    {
      way: JOIN_WAY.GIVE,
      tint: TILE_COLOUR.BRICK,
      title: t["joinPage.way.give.title"],
      sentence: splitAtFee(t["joinPage.way.give.text"], fee),
      action: t["nav.donate"],
      href: getRelativeLocaleUrl(locale, ROUTE.DONATE),
      isMain: false,
    },
  ];
}

/**
 * The {@link getSeats} helper
 * @description Places the seats this screen draws round the joined hands, tinted in turn from the top, with the open one marked
 * @param {Disc} photo - The centre the seats sit round
 * @param {SeatCircle} circle - The circle's radius, the seats' size, the places drawn and the open one
 * @returns {Seat[]} Each seat with its centre and tint
 */
export function getSeats(photo: Disc, circle: SeatCircle): Seat[] {
  const step = 360 / SEAT_CIRCLE.COUNT;

  // Each place at its turn round the circle, in its tint
  return circle.places.map((place) => {
    const angle = ((SEAT_CIRCLE.START_TURN + step * place) * Math.PI) / 180;
    return {
      key: `${place}`,
      x: Math.round(photo.centreX + circle.radius * Math.cos(angle)),
      y: Math.round(photo.centreY + circle.radius * Math.sin(angle)),
      tint: SEAT_TINTS[place % SEAT_TINTS.length] ?? TILE_COLOUR.GOLD,
      isOpen: place === circle.open,
    };
  });
}
