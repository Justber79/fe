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

const VOLUNTEER_QUERY_PREFIXES = ["volunteer", "volunteers"];

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

// The lists showing this match, from every side, plus the volunteer views.
const useInvalidateMatchLists = (queryKeyToInvalidate: string[]) => {
  const queryClient = useQueryClient();
  return () =>
    [queryKeyToInvalidate[0], ...getComplementaryPrefixes(queryKeyToInvalidate), ...VOLUNTEER_QUERY_PREFIXES].forEach(
      (prefix) => queryClient.invalidateQueries({ queryKey: [prefix] }),
    );
};

// `onFailed` runs for every failed call (unlike per-call mutate callbacks, which
// only fire for the latest one), e.g. to undo an optimistic tab move; the lists
// are refetched too, so the card lands where the server has it.
export const useUpdateOpportunityVolunteerStatus = (
  queryKeyToInvalidate: string[],
  onFailed?: (payload: StatusUpdatePayload) => void,
) => {
  const invalidateLists = useInvalidateMatchLists(queryKeyToInvalidate);

  return useMutationQuery<StatusUpdatePayload, unknown>({
    mutationFn: async ({ m2mId, status }: StatusUpdatePayload) => {
      const response = await axios.patch(`${apiPathOpportunityVolunteer}/${m2mId}`, { status });
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.statusUpdateSuccess",
    onFailure: (payload) => {
      onFailed?.(payload);
      invalidateLists();
    },
    queryKeyToInvalidate,
    onSuccessCallback: invalidateLists,
  });
};

export const useDeleteOpportunityVolunteer = (
  queryKeyToInvalidate: string[],
  onFailed?: (payload: DeletePayload) => void,
) => {
  const invalidateLists = useInvalidateMatchLists(queryKeyToInvalidate);

  return useMutationQuery<DeletePayload, unknown>({
    mutationFn: async ({ m2mId }: DeletePayload) => {
      const response = await axios.delete(`${apiPathOpportunityVolunteer}/${m2mId}`);
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.removeSuccess",
    onFailure: (payload) => {
      onFailed?.(payload);
      invalidateLists();
    },
    queryKeyToInvalidate,
    onSuccessCallback: invalidateLists,
  });
};
