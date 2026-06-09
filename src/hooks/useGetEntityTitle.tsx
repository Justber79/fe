import { ApiEntityGet } from "@/components/Dashboard/Home/helpers";
import { useGetQuery } from "./useGetQuery";
import { cacheTTL } from "@/config/constants";
import { ApiAgentGet, ApiOpportunityGet, ApiVolunteerGet, EntityTableName } from "need4deed-sdk";

export type DashboardEntityType = EntityTableName.VOLUNTEER | EntityTableName.OPPORTUNITY | EntityTableName.AGENT;

export const useGetEntityTitle = (entityType: DashboardEntityType, entityId: number, apiPath: string) => {
  const { data, isLoading, isError, error } = useGetQuery<ApiEntityGet[DashboardEntityType]>({
    queryKey: [entityType, String(entityId)],
    apiPath: `${apiPath}/${entityId}`,
    staleTime: cacheTTL,
  });

  if (!data) return {};

  const entityTitle =
    entityType === EntityTableName.VOLUNTEER
      ? `${(data as ApiVolunteerGet).person?.firstName}'s profile`
      : (data as ApiAgentGet | ApiOpportunityGet).title;

  return {
    title: entityTitle,
    isLoading,
    isError,
    error,
  };
};
