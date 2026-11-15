// Types
import type { TileColour } from "../../lib/content/types";
import type { HelpService } from "../../lib/help/types";
import type { TranslationKey } from "../../i18n/types";

/**
 * The {@link HelpArea} type
 * @description One area of help as the page's data holds it: its service, tint, and the keys of its name and points
 */
export type HelpArea = {
  service: HelpService;
  tint: TileColour;
  title: TranslationKey;
  points: readonly TranslationKey[];
};

/**
 * The {@link HelpAreaView} type
 * @description One area of help ready to render: its name, its points and its WhatsApp link, in the page's language
 */
export type HelpAreaView = {
  service: HelpService;
  tint: TileColour;
  title: string;
  points: string[];
  askHref: string;
};

/**
 * The {@link HowStep} type
 * @description One step of How it works: its number and the keys of its title and sentence
 */
export type HowStep = {
  number: number;
  title: TranslationKey;
  text: TranslationKey;
};
