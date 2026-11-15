// Types
import type { TranslationKey } from "../../i18n/types";
import type { TileColour } from "../../lib/content/types";
import type { RingSpec } from "../../lib/woven/types";
import type { ValueChip } from "../../site/types";
import type { Disc, DotField, DrawingFrame, Point, Sparkle, Stitch } from "../opening/types";
import type { ABOUT_VALUE, MONEY_RULE } from "./constants";

/**
 * The {@link AboutValue} type
 * @description One of the {@link ABOUT_VALUE} values
 */
export type AboutValue = (typeof ABOUT_VALUE)[keyof typeof ABOUT_VALUE];

/**
 * The {@link MoneyRuleName} type
 * @description One of the {@link MONEY_RULE} values
 */
export type MoneyRuleName = (typeof MONEY_RULE)[keyof typeof MONEY_RULE];

/**
 * The {@link PurposeCard} type
 * @description The mission or the vision: the keys of its label, title and text
 */
export type PurposeCard = {
  opener: TranslationKey;
  title: TranslationKey;
  text: TranslationKey;
};

/**
 * The {@link Aim} type
 * @description One of AMIR-GB's aims: the keys of its name and sentence
 */
export type Aim = {
  title: TranslationKey;
  text: TranslationKey;
};

/**
 * The {@link ValueTile} type
 * @description One value as the page's data holds it: its pictogram, tint, and the keys of its words
 */
export type ValueTile = {
  value: AboutValue;
  tint: TileColour;
  kriol?: TranslationKey;
  title: TranslationKey;
  text: TranslationKey;
};

/**
 * The {@link BoardMember} type
 * @description One board member: their name and the keys of their role and tasks
 */
export type BoardMember = {
  name: string;
  role: TranslationKey;
  tasks: TranslationKey;
};

/**
 * The {@link MoneyRule} type
 * @description One rule of how AMIR-GB handles money: its pictogram and the keys of its name and sentence
 */
export type MoneyRule = {
  rule: MoneyRuleName;
  title: TranslationKey;
  text: TranslationKey;
};

/**
 * The {@link AboutDocument} type
 * @description One document to read: the key of its title, its Dutch name and its file
 */
export type AboutDocument = {
  title: TranslationKey;
  dutchName: string;
  href: string;
};

/**
 * The {@link AboutDrawingLayout} type
 * @description One screen size's opening drawing: the stitched arc and its motto chips, the arc of beads, the logo and the founding date centred under it
 */
export type AboutDrawingLayout = {
  frame: DrawingFrame;
  dots: DotField;
  arc: { path: string; stitch: Stitch };
  beads: RingSpec;
  disc: Disc;
  chips: readonly ValueChip[];
  founded: Point | null;
  sparkles: readonly Sparkle[];
};
