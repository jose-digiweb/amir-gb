// Types
import type { GIFT_USE, WAY_CARD_TONE } from "./constants";

/**
 * The {@link GiftUse} type
 * @description One of the {@link GIFT_USE} values
 */
export type GiftUse = (typeof GIFT_USE)[keyof typeof GIFT_USE];

/**
 * The {@link WayCardTone} type
 * @description One of the {@link WAY_CARD_TONE} values
 */
export type WayCardTone = (typeof WAY_CARD_TONE)[keyof typeof WAY_CARD_TONE];
