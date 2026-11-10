import { apiPathTranslation } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useQueryClient } from "@tanstack/react-query";
import { ApiFieldTranslationGet, EntityTableName, Id } from "need4deed-sdk";
import { useCallback } from "react";

export type OpportunityTranslation = ApiFieldTranslationGet<EntityTableName.OPPORTUNITY>;

export const getOpportunityTranslationsKey = (opportunityId: Id) => ["opportunity-translations", String(opportunityId)];

export function useOpportunityTranslations(opportunityId: Id) {
  const client = useQueryClient();
  const query = useGetQuery<OpportunityTranslation[]>({
    queryKey: getOpportunityTranslationsKey(opportunityId),
    apiPath: `${apiPathTranslation}/${EntityTableName.OPPORTUNITY}/${opportunityId}`,
    toastOnError: false,
    localeIndependent: true,
  });
  const refresh = useCallback(() => {
    const queryKey = getOpportunityTranslationsKey(opportunityId);
    if (!client.isFetching({ queryKey })) void client.invalidateQueries({ queryKey });
  }, [client, opportunityId]);

  const { refetch } = query;
  const readLatest = useCallback(async () => {
    const result = await refetch();
    return result.isSuccess ? result.data.data : undefined;
  }, [refetch]);

  return { ...query, refresh, readLatest };
}
