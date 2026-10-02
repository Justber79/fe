"use client";

import { Env } from "@/types";
import i18next from "i18next";
import { Lang } from "need4deed-sdk";
import { useMemo } from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import deTranslation from "../../public/locales/de/translations.json";
import enTranslation from "../../public/locales/en/translations.json";

i18next.use(initReactI18next).init({
  fallbackLng: Lang.DE,
  debug: process.env.NODE_ENV === Env.DEVELOPMENT,
  resources: {
    [Lang.EN]: { translation: enTranslation },
    [Lang.DE]: { translation: deTranslation },
  },
  interpolation: { escapeValue: false },
});

interface I18nProviderProps {
  children: React.ReactNode;
  initialLang: string;
}

export function I18nProvider({ children, initialLang }: I18nProviderProps) {
  useMemo(() => {
    if (i18next.language !== initialLang) {
      i18next.changeLanguage(initialLang);
    }
  }, [initialLang]);

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
