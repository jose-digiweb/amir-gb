// Types
import type { JoinError, JoinMode, JoinSkill } from "../../lib/join/types";
import type { AnswerLanguage } from "../../site/types";
import type { TileColour } from "../../lib/content/types";
import type { ChoiceOption } from "../forms/types";
import type { JOIN_FORM_STATE, JOIN_WAY } from "./constants";

/**
 * The {@link JoinFormState} type
 * @description One of the {@link JOIN_FORM_STATE} values
 */
export type JoinFormState = (typeof JOIN_FORM_STATE)[keyof typeof JOIN_FORM_STATE];

/**
 * The {@link JoinWay} type
 * @description One of the {@link JOIN_WAY} values
 */
export type JoinWay = (typeof JOIN_WAY)[keyof typeof JOIN_WAY];

/**
 * The {@link FeeSentence} type
 * @description A sentence cut where the fee goes, so the fee can be marked as a fact still to come; without the fee, all of it is before
 */
export type FeeSentence = {
  before: string;
  fee?: string;
  after: string;
};

/**
 * The {@link WayCardData} type
 * @description One way to take part, ready for its card: its tint, words, action and where the action goes
 */
export type WayCardData = {
  way: JoinWay;
  tint: TileColour;
  title: string;
  sentence: FeeSentence;
  action: string;
  href: string;
  isMain: boolean;
};

/**
 * The {@link JoinStepCopy} type
 * @description One step of What happens next, cut where the fee goes
 */
export type JoinStepCopy = {
  title: string;
  sentence: FeeSentence;
};

/**
 * The {@link JoinFormCopy} type
 * @description Every word the sign-up form and its next steps show, in the page's language
 */
export type JoinFormCopy = {
  modeLabel: string;
  modes: ChoiceOption<JoinMode>[];
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  phoneLabel: string;
  optional: string;
  placeLabel: string;
  placeHint: string;
  languageLabel: string;
  languages: ChoiceOption<AnswerLanguage>[];
  skillsLabel: string;
  skills: ChoiceOption<JoinSkill>[];
  messageLabel: string;
  messagePlaceholder: string;
  consent: string;
  privacy: string;
  send: string;
  sending: string;
  errors: Record<JoinError, string>;
  summaryTitles: string[];
  summaryFields: { name: string; email: string; place: string; skills: string; consent: string };
  memberSteps: JoinStepCopy[];
  volunteerSteps: JoinStepCopy[];
  sentOpener: string;
  sentMemberTitle: string;
  sentMemberText: string;
  sentVolunteerTitle: string;
  sentVolunteerText: string;
  languagesInSentence: Record<AnswerLanguage, string>;
  skillsInSentence: Record<JoinSkill, string>;
  seeWhatsOn: string;
  tellFriend: string;
  failedTitle: string;
  failedText: string;
  tryAgain: string;
  whatsapp: string;
};

/**
 * The {@link JoinFormLinks} type
 * @description The links the sign-up form offers: privacy, WhatsApp, What's on, and the WhatsApp message that tells a friend
 */
export type JoinFormLinks = {
  privacy: string;
  whatsapp: string;
  whatsOn: string;
  tellFriend: string;
};
