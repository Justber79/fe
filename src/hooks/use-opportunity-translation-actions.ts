import { apiPathOpportunity, apiPathTranslation } from "@/config/constants";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ApiOpportunityPatch, ApiOriginalLanguagePut, EntityTableName, Id, Lang } from "need4deed-sdk";
import { useCallback } from "react";

export function useOpportunityTranslationActions(opportunityId: Id, language: Lang) {
  const client = useQueryClient();
  const opportunityKey = ["opportunity", String(opportunityId)];
  const refreshTranslations = useCallback(() => {
    const queryKey = ["opportunity-translations", String(opportunityId)];
    if (!client.isFetching({ queryKey })) void client.invalidateQueries({ queryKey });
  }, [client, opportunityId]);
  const refresh = () => {
    void client.invalidateQueries({ queryKey: ["opportunity-translations", String(opportunityId)] });
    void client.invalidateQueries({ queryKey: opportunityKey });
  };
  const save = useMutationQuery<ApiOpportunityPatch, unknown>({
    mutationFn: (patch) => axios.patch(`${apiPathOpportunity}/${opportunityId}`, patch, { params: { language } }),
    successMessage: "opportunityTranslations.saved",
    onSuccessCallback: refresh,
  });
  const confirm = useMutationQuery<number[], unknown>({
    mutationFn: async (ids) => {
      const results = await Promise.allSettled(ids.map((id) => axios.post(`${apiPathTranslation}/${id}/confirm`)));
      const failure = results.find((result) => result.status === "rejected");
      if (failure?.status === "rejected") throw failure.reason;
    },
    successMessage: "opportunityTranslations.confirmed",
    onSuccessCallback: refresh,
    onFailure: refresh,
  });
  const changeLanguage = useMutationQuery<ApiOriginalLanguagePut, unknown>({
    apiPath: `${apiPathTranslation}/${EntityTableName.OPPORTUNITY}/${opportunityId}/original-language`,
    method: "put",
    successMessage: "opportunityTranslations.languageChanged",
    onSuccessCallback: refresh,
  });
  return { save, confirm, changeLanguage, refresh: refreshTranslations };
}
