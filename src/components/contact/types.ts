// Types
import type { OpenerItem } from "../ui/types";
import type { ContactError } from "../../lib/contact/types";
import type { AnswerLanguage } from "../../site/types";
import type { ChoiceOption } from "../forms/types";
import type { RingSpec } from "../../lib/woven/types";
import type { Disc, DotField, DrawingFrame, Sparkle, Stitch } from "../opening/types";
import type { BUBBLE_SIZE, BUBBLE_TAIL, CONTACT_FORM_STATE, WELCOME_LANGUAGE } from "./constants";

/**
 * The {@link ContactFormState} type
 * @description One of the {@link CONTACT_FORM_STATE} values
 */
export type ContactFormState = (typeof CONTACT_FORM_STATE)[keyof typeof CONTACT_FORM_STATE];

/**
 * The {@link ContactFormCopy} type
 * @description Every word the message form shows, in the page's language
 */
export type ContactFormCopy = {
  nameLabel: string;
  namePlaceholder: string;
  reachLabel: string;
  reachPlaceholder: string;
  languageLabel: string;
  languages: ChoiceOption[];
  topicLabel: string;
  topics: ChoiceOption[];
  messageLabel: string;
  messagePlaceholder: string;
  consent: string;
  privacy: string;
  send: string;
  sending: string;
  errors: Record<ContactError, string>;
  summaryTitles: string[];
  summaryFields: { name: string; reach: string; message: string; consent: string };
  sentOpener: OpenerItem[];
  sentTitle: string;
  sentText: string;
  languagesInSentence: Record<AnswerLanguage, string>;
  whatsapp: string;
  sendAnother: string;
  failedTitle: string;
  failedText: string;
  tryAgain: string;
};

/**
 * The {@link ContactFormLinks} type
 * @description The links the message form offers: WhatsApp and the privacy page
 */
export type ContactFormLinks = {
  whatsapp: string;
  privacy: string;
};

/**
 * The {@link WelcomeLanguage} type
 * @description One of the {@link WELCOME_LANGUAGE} values
 */
export type WelcomeLanguage = (typeof WELCOME_LANGUAGE)[keyof typeof WELCOME_LANGUAGE];

/**
 * The {@link BubbleTail} type
 * @description One of the {@link BUBBLE_TAIL} values
 */
export type BubbleTail = (typeof BUBBLE_TAIL)[keyof typeof BUBBLE_TAIL];

/**
 * The {@link WelcomeBubbleSpot} type
 * @description A welcome bubble in the opening's drawing: its language, its centre and the corner that is its tail
 */
export type WelcomeBubbleSpot = {
  language: WelcomeLanguage;
  x: number;
  y: number;
  tail: BubbleTail;
};

/**
 * The {@link BubbleSize} type
 * @description One of the {@link BUBBLE_SIZE} values
 */
export type BubbleSize = (typeof BUBBLE_SIZE)[keyof typeof BUBBLE_SIZE];

/**
 * The {@link ContactDrawingLayout} type
 * @description One screen size's opening drawing: the logo in its ring of beads, the stitched threads and the welcome bubbles
 */
export type ContactDrawingLayout = {
  frame: DrawingFrame;
  dots: DotField;
  ring: RingSpec;
  gaps: readonly number[];
  disc: Disc;
  threads: { paths: readonly string[]; stitch: Stitch };
  bubbleSize: BubbleSize;
  bubbles: readonly WelcomeBubbleSpot[];
  sparkles: readonly Sparkle[];
};
