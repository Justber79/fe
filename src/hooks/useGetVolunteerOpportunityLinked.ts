import { ApiVolunteerOpportunityGet, Id } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";
import { apiPathOpportunity, cacheTTL } from "@/config/constants";

export const useGetVolunteerOpportunityLinked = (opportunityId: Id, volunteerId?: string) => {
  const { data, isLoading } = useGetQuery<ApiVolunteerOpportunityGet[]>({
    queryKey: ["opportunity-volunteers", String(opportunityId)],
    apiPath: `${apiPathOpportunity}/${opportunityId}/volunteer-linked`,
    staleTime: cacheTTL,
    enabled: !!opportunityId,
  });

  const isAlreadyMatched =
    !isLoading && !!volunteerId && (data ?? []).some((vol) => vol.volunteerId === Number(volunteerId));

  return { data, isLoading, isAlreadyMatched };
};
