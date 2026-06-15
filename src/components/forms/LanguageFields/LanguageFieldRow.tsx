import { TFunction } from "i18next";
import { Lang, Option } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/core/button";
import useList from "@/hooks/useLists";
import { LanguageLevel, LanguageObject } from "@/types";
import style from "../index.module.css";
import { ListsOfOptions } from "../types";

type Props = {
  language: LanguageObject;
  disabledLanguages: string[];
  showRemove: boolean;
  showLevel?: boolean;
  onUpdateLanguage: (id: number, language: string) => void;
  onUpdateLevel: (id: number, level: LanguageLevel) => void;
  onRemove: (id: number) => void;
  t: TFunction<"translation", undefined>;
  availableLanguages?: Option[];
};

const languageLevels: LanguageLevel[] = [LanguageLevel.NATIVE, LanguageLevel.FLUENT, LanguageLevel.INTERMEDIATE];

const levelToI18nKey: Record<LanguageLevel, string> = {
  [LanguageLevel.NATIVE]: "languagesNative",
  [LanguageLevel.FLUENT]: "languagesFluent",
  [LanguageLevel.INTERMEDIATE]: "languagesIntermediate",
};

export function LanguageFieldRow({
  language,
  disabledLanguages,
  showRemove,
  showLevel = true,
  onUpdateLanguage,
  onUpdateLevel,
  onRemove,
  t,
  availableLanguages: providedLanguages,
}: Props) {
  const { i18n } = useTranslation();
  const fallbackLanguages = useList(ListsOfOptions.LANGUAGES);
  const availableLanguages = providedLanguages || fallbackLanguages;
  return (
    <div
      className={showLevel ? style["form-languages-grid"] : style["form-languages-grid-no-level"]}
      data-testid={`language-row-${language.id}`}
    >
      <label className={style["form-form-field"]}>
        <span>{t("form.becomeVolunteer.fields.languages.language")}</span>
        <select
          name={`language-${language.id}`}
          value={language.language}
          onChange={(e) => onUpdateLanguage(language.id, e.target.value)}
        >
          <option value="" disabled hidden>
            {t("form.becomeVolunteer.fields.languages.chooseLanguage")}
          </option>
          <option key={language.id} value={language.language}>
            {availableLanguages.find((item) => String(item.id) === language.language)?.title[i18n.language as Lang] ??
              language.language}
          </option>
          {availableLanguages.map((item) => (
            <option
              key={item.id}
              value={String(item.id)}
              disabled={disabledLanguages.includes(String(item.id)) && language.language !== String(item.id)}
            >
              {item.title[i18n.language as Lang]}
            </option>
          ))}
        </select>
      </label>
      {showLevel && (
        <label className={style["form-form-field"]}>
          <span>{t("form.becomeVolunteer.fields.languages.level")}</span>
          <select
            name={`level-${language.id}`}
            value={language.level}
            onChange={(e) => onUpdateLevel(language.id, e.target.value as LanguageLevel)}
          >
            <option value="" disabled hidden>
              {t("form.becomeVolunteer.fields.languages.chooseLevel")}
            </option>
            {languageLevels.map((level) => (
              <option key={level} value={level}>
                {t(`form.becomeVolunteer.fields.languages.${levelToI18nKey[level]}.header`)}
              </option>
            ))}
          </select>
        </label>
      )}
      {showRemove ? (
        <div className={style["remove-language-button"]}>
          <Button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onRemove(language.id);
            }}
            text={t("form.becomeVolunteer.fields.languages.removeLanguage")}
            textFontSize="20px"
            textFontWeight="600"
            backgroundcolor="transparent"
            textColor="#4B5BD4"
            border="none"
            height="auto"
            padding="0.5rem"
          />
        </div>
      ) : (
        <div className={style["language-button-spacer"]} />
      )}
    </div>
  );
}
