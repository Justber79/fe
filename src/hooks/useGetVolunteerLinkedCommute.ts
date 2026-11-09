import { apiPathVolunteer, cacheTTL } from "@/config/constants";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { ApiVolunteerCommute } from "need4deed-sdk";

const COMMUTE_BATCH_SIZE = 20;

export const useGetVolunteerLinkedCommute = (volunteerId: number, opportunityIds: number[], enabled: boolean) => {
  const opportunityIdBatches = Array.from({ length: Math.ceil(opportunityIds.length / COMMUTE_BATCH_SIZE) }, (_, i) =>
    opportunityIds.slice(i * COMMUTE_BATCH_SIZE, (i + 1) * COMMUTE_BATCH_SIZE),
  );
  const commuteQueries = useQueries({
    queries: opportunityIdBatches.map((opportunityIdBatch) => ({
      queryKey: ["volunteer-commute", String(volunteerId), ...opportunityIdBatch.map(String)],
      queryFn: async () => {
        const response = await axios.get<{ data: ApiVolunteerCommute[] }>(
          `${apiPathVolunteer}/${volunteerId}/commute`,
          {
            params: { opportunity: opportunityIdBatch },
            paramsSerializer: { indexes: null },
          },
        );
        return response.data.data;
      },
      staleTime: cacheTTL,
      enabled: enabled && Boolean(volunteerId),
      meta: { toastOnError: true },
    })),
  });
  const commutesByOpportunityId = new Map<number, ApiVolunteerCommute["commute"]>();

  commuteQueries
    .flatMap(({ data }) => data ?? [])
    .forEach(({ opportunityId, commute }) => commutesByOpportunityId.set(Number(opportunityId), commute));

  return commutesByOpportunityId;
};
