import { apiPathOpportunityVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type StatusUpdatePayload = {
  m2mId: number;
  status: OpportunityVolunteerStatusType;
};

type DeletePayload = { m2mId: number };

// "agent-volunteers" aggregates volunteers across all of an agent's
// opportunities, so a status change made from there can affect both the
// volunteer's own view and a single opportunity's volunteer list.
const COMPLEMENTARY_PREFIXES: Record<string, string[]> = {
  "opportunity-volunteers": ["volunteer-opportunities"],
  "volunteer-opportunities": ["opportunity-volunteers"],
  "agent-volunteers": ["volunteer-opportunities", "opportunity-volunteers"],
};

function getComplementaryPrefixes(queryKey: string[]): string[] {
  return COMPLEMENTARY_PREFIXES[queryKey[0]] ?? ["opportunity-volunteers"];
}

export const useUpdateOpportunityVolunteerStatus = (queryKeyToInvalidate: string[]) => {
  const queryClient = useQueryClient();

  return useMutationQuery<StatusUpdatePayload, unknown>({
    mutationFn: async ({ m2mId, status }: StatusUpdatePayload) => {
      const response = await axios.patch(`${apiPathOpportunityVolunteer}/${m2mId}`, { status });
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.statusUpdateSuccess",
    queryKeyToInvalidate,
    onSuccessCallback: () => {
      getComplementaryPrefixes(queryKeyToInvalidate).forEach((prefix) =>
        queryClient.invalidateQueries({ queryKey: [prefix] }),
      );
    },
  });
};

export const useDeleteOpportunityVolunteer = (queryKeyToInvalidate: string[]) => {
  const queryClient = useQueryClient();

  return useMutationQuery<DeletePayload, unknown>({
    mutationFn: async ({ m2mId }: DeletePayload) => {
      const response = await axios.delete(`${apiPathOpportunityVolunteer}/${m2mId}`);
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.removeSuccess",
    queryKeyToInvalidate,
    onSuccessCallback: () => {
      getComplementaryPrefixes(queryKeyToInvalidate).forEach((prefix) =>
        queryClient.invalidateQueries({ queryKey: [prefix] }),
      );
    },
  });
};
