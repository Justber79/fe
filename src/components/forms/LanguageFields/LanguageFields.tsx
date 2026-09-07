import { TFunction } from "i18next";
import { Option } from "need4deed-sdk";
import { useMemo } from "react";

import { Button } from "@/components/core/button";
import { LanguageLevel, LanguageObject } from "@/types";
import style from "../index.module.css";
import { LanguageFieldRow } from "./LanguageFieldRow";

type Props = {
  languages: LanguageObject[];
  onChange: (languages: LanguageObject[]) => void;
  onFocus?: () => void;
  t: TFunction<"translation", undefined>;
  availableLanguages?: Option[];
  showLevel?: boolean;
};

export function LanguageFields({ languages, onChange, onFocus, t, availableLanguages, showLevel = true }: Props) {
  const updateLanguage = (id: number, newLang: string) => {
    onChange(languages.map((item) => (item.id === id ? { ...item, language: newLang } : item)));
  };

  const updateLevel = (id: number, newLevel: LanguageLevel) => {
    onChange(languages.map((item) => (item.id === id ? { ...item, level: newLevel } : item)));
  };

  const removeLanguage = (id: number) => {
    onChange(languages.filter((item) => item.id !== id));
  };

  const handleAddLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const maxId = languages.reduce((max, item) => Math.max(max, item.id), 0);
    onChange([
      ...languages,
      {
        id: maxId + 1,
        language: "",
        level: "",
      },
    ]);
  };

  const disabledLanguages = useMemo(() => languages.map((item) => item.language), [languages]);

  return (
    <div className={style["form-languages-wrapper"]} data-testid="language-fields-container" onFocus={onFocus}>
      {languages.map((lang, index) => (
        <LanguageFieldRow
          key={`${lang.id}-${lang.language}-${lang.level}`}
          language={lang}
          disabledLanguages={disabledLanguages}
          showRemove={index !== 0}
          showLevel={showLevel}
          onUpdateLanguage={updateLanguage}
          onUpdateLevel={updateLevel}
          onRemove={removeLanguage}
          t={t}
          availableLanguages={availableLanguages}
        />
      ))}
      <Button
        onClick={handleAddLanguage}
        text={"+ " + t("form.becomeVolunteer.fields.languages.addLanguage")}
        textFontSize="20px"
        textFontWeight="400"
        backgroundcolor="var(--color-white)"
        textColor="var(--color-midnight)"
        border="2px solid var(--color-neutral-700)"
        height="var(--form-input-height)"
      />
    </div>
  );
}
