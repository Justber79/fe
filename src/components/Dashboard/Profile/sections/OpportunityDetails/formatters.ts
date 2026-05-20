import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { LanguageObject } from "@/types";
import { TFunction } from "i18next";
import { ApiLanguage, Lang, LangPurpose, OptionById } from "need4deed-sdk";

export function formatLanguagesByPurpose(
  languages: ApiLanguage[],
  purposes: LangPurpose | LangPurpose[],
  t: TFunction,
): string {
  const purposeSet = new Set(Array.isArray(purposes) ? purposes : [purposes]);
  const seen = new Set<number>();
  const filtered = languages.filter((lang) => {
    if (!lang.purpose || !purposeSet.has(lang.purpose)) return false;
    if (seen.has(lang.id)) return false;
    seen.add(lang.id);
    return true;
  });
  if (filtered.length === 0) return EMPTY_PLACEHOLDER_VALUE;
  return filtered
    .map((lang) => {
      const key = `languageNames.${lang.title.toLowerCase()}`;
      const translated = t(key);
      return translated !== key ? translated : lang.title;
    })
    .join(", ");
}

export function extractOptionTitles(items: OptionById[], lang: Lang): string[] {
  return items
    .map((item) => {
      if (!item.title) return "";
      return item.title[lang] ?? item.title[Lang.EN] ?? "";
    })
    .filter(Boolean);
}

export function languagesToFormValues(langs: ApiLanguage[], t: TFunction): LanguageObject[] {
  if (langs.length === 0) return [{ id: 1, language: "", level: "" }];

  return langs.map((lang, index) => {
    const key = `languageNames.${lang.title.toLowerCase()}`;
    const translated = t(key);
    const hasTranslation = translated !== key;

    return {
      id: index + 1,
      language: hasTranslation ? translated : lang.title,
      level: "" as const,
    };
  });
}
