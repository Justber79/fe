import { apiPathOpportunity, apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiOpportunityGetList, ApiVolunteerGetList, Id, RECOMMENDED_MATCHES_DEFAULT_LIMIT } from "need4deed-sdk";

export const recommendedVolunteersKey = (opportunityId: Id) => ["recommended-volunteers", String(opportunityId)];
export const recommendedOpportunitiesKey = (volunteerId: Id) => ["recommended-opportunities", String(volunteerId)];

export const useRecommendedVolunteers = (opportunityId: Id, enabled: boolean) =>
  useGetQuery<ApiVolunteerGetList[]>({
    queryKey: recommendedVolunteersKey(opportunityId),
    apiPath: `${apiPathOpportunity}/${opportunityId}/recommended-volunteers`,
    params: { limit: RECOMMENDED_MATCHES_DEFAULT_LIMIT },
    staleTime: cacheTTL,
    enabled,
  });

export const useRecommendedOpportunities = (volunteerId: Id, enabled: boolean) =>
  useGetQuery<ApiOpportunityGetList[]>({
    queryKey: recommendedOpportunitiesKey(volunteerId),
    apiPath: `${apiPathVolunteer}/${volunteerId}/recommended-opportunities`,
    params: { limit: RECOMMENDED_MATCHES_DEFAULT_LIMIT },
    staleTime: cacheTTL,
    enabled,
  });
