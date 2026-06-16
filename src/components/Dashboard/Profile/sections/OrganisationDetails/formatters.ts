import { LanguageObject } from "@/types";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { Option } from "need4deed-sdk";

export const toLanguagesForForm = (apiLanguages: ApiLanguageOption[], lang: string): Option[] =>
  apiLanguages.map((l) => ({
    id: l.id,
    title: { [lang]: l.title },
  }));

export const apiLanguagesToFormValues = (langs?: Array<{ id: number; title: string }>): LanguageObject[] => {
  if (!langs || langs.length === 0) return [{ id: 1, language: "", level: "" }];
  return langs.map((lang) => ({ id: lang.id, language: String(lang.id), level: "" }));
};

export const clientLanguagesToDisplay = (langs?: Array<{ id: number; title: string }>): string =>
  langs?.map((lang) => lang.title).join(", ") ?? "";

export function parseAddress(formatted: string): { street: string; postcode: string } {
  const match = formatted.match(/^(.+),\s*(\d{5})/);
  return match ? { street: match[1].trim(), postcode: match[2] } : { street: "", postcode: "" };
}
