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

async function settleTranslations<T, Result>(fields: T[], write: (field: T) => Promise<Result>) {
  const results = await Promise.allSettled(fields.map(write));
  return fields.map((field, index) => ({ field, result: results[index] }));
}

export function useOpportunityTranslationActions(opportunityId: Id, language: Lang) {
  const client = useQueryClient();
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ["opportunity", String(opportunityId)] });
    return client.invalidateQueries({ queryKey: getOpportunityTranslationsKey(opportunityId) });
  };
  const write = async (fields: TranslationWrite[]) => {
    const results = await settleTranslations(fields, ({ id, fieldName, text, original }) =>
      id !== undefined
        ? mutateData<ApiFieldTranslationPatch, { data: ApiFieldTranslation }>(`${apiPathTranslation}/${id}`, "patch", {
            text,
            original,
          })
        : mutateData<ApiFieldTranslationPost, { data: ApiFieldTranslation }>(apiPathTranslation, "post", {
            entityType: EntityTableName.OPPORTUNITY,
            entityId: Number(opportunityId),
            fieldName,
            language,
            text,
            original,
          }),
    );
    await refresh();
    return results;
  };
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
  });
  const changeLanguage = useMutationQuery<Pick<ApiOpportunityPatch, "originalLanguage">, unknown>({
    apiPath: `${apiPathOpportunity}/${opportunityId}`,
    method: "patch",
    successMessage: "opportunityTranslations.languageChanged",
    onSuccessCallback: refresh,
  });
  return { save, changeLanguage, resetTranslation };
}
