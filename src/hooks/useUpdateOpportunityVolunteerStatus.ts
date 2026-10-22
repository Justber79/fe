import { apiPathOpportunityVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { isEmailNoteNotSent, withEmailNote } from "@/utils/apiErrors";
import { ApiOpportunityVolunteerPatch } from "need4deed-sdk";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

type StatusUpdatePayload = ApiOpportunityVolunteerPatch & { m2mId: number };

type DeletePayload = { m2mId: number };

const VOLUNTEER_QUERY_PREFIXES = ["volunteer", "volunteers"];

const COMPLEMENTARY_PREFIXES: Record<string, string[]> = {
  "opportunity-volunteers": ["volunteer-opportunities"],
  "volunteer-opportunities": ["opportunity-volunteers"],
  "agent-volunteers": ["volunteer-opportunities", "opportunity-volunteers"],
};

function getComplementaryPrefixes(queryKey: string[]): string[] {
  return COMPLEMENTARY_PREFIXES[queryKey[0]] ?? ["opportunity-volunteers"];
}

const useInvalidateMatchLists = (queryKeyToInvalidate: string[]) => {
  const queryClient = useQueryClient();
  return () =>
    [queryKeyToInvalidate[0], ...getComplementaryPrefixes(queryKeyToInvalidate), ...VOLUNTEER_QUERY_PREFIXES].forEach(
      (prefix) => queryClient.invalidateQueries({ queryKey: [prefix] }),
    );
};

export const useUpdateOpportunityVolunteerStatus = (
  queryKeyToInvalidate: string[],
  onFailed?: (payload: StatusUpdatePayload) => void,
) => {
  const { t } = useTranslation();
  const invalidateLists = useInvalidateMatchLists(queryKeyToInvalidate);

  return useMutationQuery<StatusUpdatePayload, unknown>({
    mutationFn: async ({ m2mId, ...patch }: StatusUpdatePayload) => {
      const response = await axios.patch(`${apiPathOpportunityVolunteer}/${m2mId}`, withEmailNote(patch));
      return response.data;
    },
    successMessage: "dashboard.opportunityProfile.volunteersSec.statusUpdateSuccess",
    onFailure: (payload) => {
      onFailed?.(payload);
      invalidateLists();
    },
    onErrorCallback: (error) => {
      if (!isEmailNoteNotSent(error)) return false;
      toast.error(t("message.apiErrors.emailNoteNotSent"));
      return true;
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
