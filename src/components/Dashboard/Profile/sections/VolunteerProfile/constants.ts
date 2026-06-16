import { LanguageLevel } from "@/types";
import { ByDay, LangProficiency } from "need4deed-sdk";

export const DAY_MAP: Record<number, ByDay> = {
  1: ByDay.MO,
  2: ByDay.TU,
  3: ByDay.WE,
  4: ByDay.TH,
  5: ByDay.FR,
  6: ByDay.SA,
  7: ByDay.SU,
};

export const REVERSE_DAY_MAP: Record<string, number> = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 7,
};

export const DAY_ENUM_TO_STRING: Record<ByDay, string> = {
  [ByDay.MO]: "Monday",
  [ByDay.TU]: "Tuesday",
  [ByDay.WE]: "Wednesday",
  [ByDay.TH]: "Thursday",
  [ByDay.FR]: "Friday",
  [ByDay.SA]: "Saturday",
  [ByDay.SU]: "Sunday",
};

export const LEVEL_TO_PROFICIENCY: Record<LanguageLevel, LangProficiency> = {
  [LanguageLevel.NATIVE]: LangProficiency.NATIVE,
  [LanguageLevel.FLUENT]: LangProficiency.FLUENT,
  [LanguageLevel.INTERMEDIATE]: LangProficiency.INTERMEDIATE,
};
