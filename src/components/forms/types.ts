/**
 * The {@link ChoiceOption} type
 * @description One chip of a choice: what it posts and what it says
 */
export type ChoiceOption<T extends string = string> = {
  value: T;
  label: string;
};

/**
 * The {@link ServerFieldErrors} type
 * @description An action's input errors, by the field they belong to
 */
export type ServerFieldErrors = Record<string, string[] | undefined>;
