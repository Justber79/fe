import type { TranslationReset } from "@/hooks/use-opportunity-translation-actions";
import { ApiFieldTranslationGet, Lang, TranslationOrigin, TranslationStatus } from "need4deed-sdk";

export function getTranslationSnapshot(fields: ApiFieldTranslationGet[], language: Lang) {
  return Object.fromEntries(
    fields.map((field) => {
      const translation = field.translations[language];
      return [
        field.fieldName,
        JSON.stringify({
          original: field.original,
          originalLanguage: field.originalLanguage,
          id: translation?.id,
          text: translation?.text,
          status: translation?.status,
          origin: translation?.origin,
          lastErrorCode: translation?.lastErrorCode,
        }),
      ];
    }),
  );
}

export function hasEditedTranslationChanged(
  snapshot: Record<string, string>,
  current: Record<string, string>,
  dirtyFields: Partial<Record<"title" | "info", boolean>>,
) {
  return Object.entries(dirtyFields).some(([field, dirty]) => dirty && snapshot[field] !== current[field]);
}

export function getTranslationReviewStatus(fields: ApiFieldTranslationGet[], language: Lang) {
  const translations = fields.map((field) => field.translations[language]);
  if (translations.some((value) => value?.status === TranslationStatus.FAILED)) return "failed";
  if (translations.some((value) => value?.status === TranslationStatus.PENDING)) return "pending";
  if (!translations.length || translations.some((value) => !value)) return "missing";
  if (
    translations.every((value) => value?.origin === TranslationOrigin.HUMAN && value.status === TranslationStatus.DONE)
  )
    return "reviewed";
  return "ready";
}

export type RegenerationFailure = TranslationReset & {
  language: Lang;
  snapshot: string;
  reason: unknown;
  retryLimitReached: boolean;
};

export function getRegenerationState(
  eligibleFields: TranslationReset[],
  failures: RegenerationFailure[],
  language: Lang,
  snapshot: Record<string, string>,
) {
  const currentFailures = failures.filter(
    (failure) =>
      failure.language === language &&
      failure.snapshot === snapshot[failure.fieldName] &&
      eligibleFields.some(({ id }) => id === failure.id),
  );
  const retryableFields = eligibleFields.filter(
    ({ id }) => !currentFailures.some((failure) => failure.id === id && failure.retryLimitReached),
  );
  const retryFields = retryableFields.filter(({ id }) => currentFailures.some((failure) => failure.id === id));

  return { currentFailures, regenerationFields: retryFields.length ? retryFields : retryableFields };
}
