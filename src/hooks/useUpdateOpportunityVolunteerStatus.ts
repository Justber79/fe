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

function getComplementaryPrefix(queryKey: string[]): string {
  return queryKey[0] === "opportunity-volunteers" ? "volunteer-opportunities" : "opportunity-volunteers";
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
      queryClient.invalidateQueries({ queryKey: [getComplementaryPrefix(queryKeyToInvalidate)] });
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
      queryClient.invalidateQueries({ queryKey: [getComplementaryPrefix(queryKeyToInvalidate)] });
    },
  });
};
