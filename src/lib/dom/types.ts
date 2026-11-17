// Types
import type { COPY_OUTCOME } from "./constants";

/**
 * The {@link CopyOutcome} type
 * @description Whether a copy worked: copied or failed
 */
export type CopyOutcome = typeof COPY_OUTCOME.COPIED | typeof COPY_OUTCOME.FAILED;
