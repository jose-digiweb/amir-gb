// Types
import type { MILESTONE_PRECISION, MILESTONE_STATE } from "./constants";

/**
 * The {@link MilestonePrecision} type
 * @description One of the {@link MILESTONE_PRECISION} values
 */
export type MilestonePrecision = (typeof MILESTONE_PRECISION)[keyof typeof MILESTONE_PRECISION];

/**
 * The {@link MilestoneState} type
 * @description One of the {@link MILESTONE_STATE} values
 */
export type MilestoneState = (typeof MILESTONE_STATE)[keyof typeof MILESTONE_STATE];

/**
 * The {@link MilestoneDate} type
 * @description When a milestone happens: a YYYY-MM-DD date, and whether its day or only its month counts
 */
export type MilestoneDate = {
  date: string;
  precision: MilestonePrecision;
};
