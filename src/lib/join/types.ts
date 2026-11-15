// Types
import type { AnswerLanguage } from "../../site/types";
import type { JOIN_ERROR, JOIN_MODE, JOIN_SKILL } from "./constants";

/**
 * The {@link JoinMode} type
 * @description One of the {@link JOIN_MODE} values
 */
export type JoinMode = (typeof JOIN_MODE)[keyof typeof JOIN_MODE];

/**
 * The {@link JoinSkill} type
 * @description One of the {@link JOIN_SKILL} values
 */
export type JoinSkill = (typeof JOIN_SKILL)[keyof typeof JOIN_SKILL];

/**
 * The {@link JoinError} type
 * @description One of the {@link JOIN_ERROR} values
 */
export type JoinError = (typeof JOIN_ERROR)[keyof typeof JOIN_ERROR];

/**
 * The {@link JoinValues} type
 * @description A sign-up as the visitor typed it; skills count only for a volunteer
 */
export type JoinValues = {
  mode: JoinMode;
  name: string;
  email: string;
  phone: string;
  place: string;
  language: AnswerLanguage;
  skills: JoinSkill[];
  message: string;
  consent: boolean;
};

/**
 * The {@link JoinErrors} type
 * @description What is wrong with a sign-up, by the field it belongs to
 */
export type JoinErrors = {
  name?: JoinError;
  email?: JoinError;
  place?: JoinError;
  skills?: JoinError;
  consent?: JoinError;
};
