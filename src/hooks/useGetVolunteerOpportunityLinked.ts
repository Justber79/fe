import { ApiVolunteerOpportunityGet, Id } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";
import { apiPathOpportunity, cacheTTL } from "@/config/constants";
import { useEffect, useState } from "react";

export const useGetVolunteerOpportunityLinked = (opportunityId: Id, volunteerId?: string) => {
  const [isAlreadyMatched, setIsAlreadyMatch] = useState<boolean>(false);

  const { data, isLoading } = useGetQuery<ApiVolunteerOpportunityGet[]>({
    queryKey: ["opportunity-volunteers", String(opportunityId)],
    apiPath: `${apiPathOpportunity}/${opportunityId}/volunteer-linked`,
    staleTime: cacheTTL,
    enabled: !!opportunityId,
  });

  useEffect(() => {
    if (!volunteerId || isLoading) return;
    const volunteerIds = data?.map((vol) => vol.volunteerId);
    if (volunteerIds?.includes(Number(volunteerId))) {
      setIsAlreadyMatch(true);
    }
    return () => setIsAlreadyMatch(false);
  }, [data, isLoading, volunteerId, opportunityId]);

  return { data, isLoading, isAlreadyMatched };
};
