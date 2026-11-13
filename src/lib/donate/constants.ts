/**
 * The {@link DONATION} constant
 * @description The donation widget's preset amounts in euros and the one picked to start with
 */
export const DONATION = {
  AMOUNTS: [10, 25, 50],
  DEFAULT_AMOUNT: 25,
  CURRENCY: "EUR",
} as const;

/**
 * The {@link FREQUENCY} constant
 * @description How often a gift is given
 */
export const FREQUENCY = {
  ONCE: "once",
  MONTHLY: "monthly",
} as const;

/**
 * The {@link BANK_TRANSFER} constant
 * @description AMIR-GB's Rabobank account for gifts by bank transfer; a placeholder in the real number's shape until AMIR sends it
 */
export const BANK_TRANSFER = {
  IBAN: "NL00 RABO 0000 0000 00",
} as const;

/**
 * The {@link COPY_ACCOUNT} constant
 * @description The copy button's hooks and how long its copied state stays, in milliseconds
 */
export const COPY_ACCOUNT = {
  ROOT: "[data-copy-account]",
  BUTTON: "[data-copy-account-button]",
  COPIED: "copied",
  VALUE_ATTRIBUTE: "data-copy-account",
  RESET_MS: 3000,
  CLICK: "click",
  SPACES: /\s+/g,
} as const;
