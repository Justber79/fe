import { apiPathOpportunity, apiPathTranslation } from "@/config/constants";
import { mutateData, useMutationQuery } from "@/hooks/useMutationQuery";
import { useQueryClient } from "@tanstack/react-query";
import { getOpportunityTranslationsKey } from "@/hooks/use-opportunity-translations";
import {
  ApiFieldTranslation,
  ApiFieldTranslationPatch,
  ApiFieldTranslationPost,
  ApiOpportunityPatch,
  EntityTableName,
  Id,
  Lang,
  TranslationFieldsByEntity,
} from "need4deed-sdk";

export type TranslationWrite = ApiFieldTranslationPatch & {
  fieldName: TranslationFieldsByEntity[EntityTableName.OPPORTUNITY];
  id?: number;
};

export type TranslationReset = Pick<TranslationWrite, "fieldName"> & Pick<ApiFieldTranslation, "id">;

async function settleTranslations<T>(fields: T[], write: (field: T) => Promise<unknown>) {
  const results = await Promise.allSettled(fields.map(write));
  return fields.map((field, index) => ({ field, result: results[index] }));
}

export function useOpportunityTranslationActions(opportunityId: Id, language: Lang) {
  const client = useQueryClient();
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ["opportunity", String(opportunityId)] });
    return client.invalidateQueries({ queryKey: getOpportunityTranslationsKey(opportunityId) });
  };
  const write = (fields: TranslationWrite[]) =>
    settleTranslations(fields, ({ id, fieldName, text, original }) =>
      id !== undefined
        ? mutateData<ApiFieldTranslationPatch, unknown>(`${apiPathTranslation}/${id}`, "patch", { text, original })
        : mutateData<ApiFieldTranslationPost, unknown>(apiPathTranslation, "post", {
            entityType: EntityTableName.OPPORTUNITY,
            entityId: Number(opportunityId),
            fieldName,
            language,
            text,
            original,
          }),
    );
  const regenerate = async (fields: TranslationReset[]) => {
    const results = await settleTranslations(fields, ({ id }) =>
      mutateData<undefined, unknown>(`${apiPathTranslation}/${id}`, "delete", undefined),
    );
    await refresh();
    return results;
  };
  const resetTranslation = useMutationQuery<TranslationReset[], Awaited<ReturnType<typeof regenerate>>>({
    mutationFn: regenerate,
    noToast: true,
  });
  const save = useMutationQuery<TranslationWrite[], Awaited<ReturnType<typeof write>>>({
    mutationFn: write,
    noToast: true,
    onSuccessCallback: refresh,
  });
  const changeLanguage = useMutationQuery<Pick<ApiOpportunityPatch, "originalLanguage">, unknown>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "opportunityTranslations.languageChanged",
    onSuccessCallback: refresh,
  });
  return { save, changeLanguage, resetTranslation };
}
