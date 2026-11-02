import { apiPathTranslation } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useQueryClient } from "@tanstack/react-query";
import { ApiFieldTranslationGet, EntityTableName, Id } from "need4deed-sdk";
import { useCallback } from "react";

export const getOpportunityTranslationsKey = (opportunityId: Id) => ["opportunity-translations", String(opportunityId)];

export function useOpportunityTranslations(opportunityId: Id, enabled: boolean) {
  const client = useQueryClient();
  const query = useGetQuery<ApiFieldTranslationGet[]>({
    queryKey: getOpportunityTranslationsKey(opportunityId),
    apiPath: `${apiPathTranslation}/${EntityTableName.OPPORTUNITY}/${opportunityId}`,
    enabled,
    toastOnError: false,
  });
  const refresh = useCallback(() => {
    const queryKey = getOpportunityTranslationsKey(opportunityId);
    if (!client.isFetching({ queryKey })) void client.invalidateQueries({ queryKey });
  }, [client, opportunityId]);

  return { ...query, refresh };
}
