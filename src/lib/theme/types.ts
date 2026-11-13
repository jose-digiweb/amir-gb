// Types
import type { THEME, THEME_OVERRIDES } from "./constants";

/**
 * The {@link ThemeChoice} type
 * @description One of the {@link THEME} values
 */
export type ThemeChoice = (typeof THEME)[keyof typeof THEME];

/**
 * The {@link ThemeOverride} type
 * @description One of the {@link THEME_OVERRIDES}, a choice that overrides the device
 */
export type ThemeOverride = (typeof THEME_OVERRIDES)[number];
