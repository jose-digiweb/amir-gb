/**
 * The {@link SUPPORT_RING} constant
 * @description The ring of beads round the joined hands in Support AMIR-GB, in its own drawing units
 */
export const SUPPORT_RING = {
  VIEW_BOX: "0 0 600 600",
  centreX: 300,
  centreY: 300,
  radius: 290,
  count: 30,
  size: 15,
} as const;

/**
 * The {@link RETURN_TONE} constant
 * @description The colour of a return card's round mark: green for a gift, neutral for a stop, red for a failure
 */
export const RETURN_TONE = {
  SUCCESS: "success",
  NEUTRAL: "neutral",
  DANGER: "danger",
} as const;
