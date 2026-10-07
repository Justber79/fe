import { apiPathOpportunityVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { runForVolunteerInOrder, syncVolunteerEngagement } from "./syncVolunteerEngagement";

type StatusUpdatePayload = {
  m2mId: number;
  volunteerId: number;
  status: OpportunityVolunteerStatusType;
};

type DeletePayload = { m2mId: number; volunteerId: number };

const VOLUNTEER_QUERY_PREFIXES = ["volunteer", "volunteers"];

const COMPLEMENTARY_PREFIXES: Record<string, string[]> = {
  "opportunity-volunteers": ["volunteer-opportunities"],
  "volunteer-opportunities": ["opportunity-volunteers"],
  "agent-volunteers": ["volunteer-opportunities", "opportunity-volunteers"],
};

function getComplementaryPrefixes(queryKey: string[]): string[] {
  return COMPLEMENTARY_PREFIXES[queryKey[0]] ?? ["opportunity-volunteers"];
}

const useEngagementSync = () => {
  const { t } = useTranslation();
  return (volunteerId: number, status?: OpportunityVolunteerStatusType) =>
    syncVolunteerEngagement(volunteerId, status).catch(() =>
      toast.error(t("dashboard.opportunityProfile.volunteersSec.engagementSyncError")),
    );
};

export const useUpdateOpportunityVolunteerStatus = (queryKeyToInvalidate: string[]) => {
  const queryClient = useQueryClient();
  const syncEngagement = useEngagementSync();

  return useMutationQuery<StatusUpdatePayload, unknown>({
    mutationFn: ({ m2mId, volunteerId, status }: StatusUpdatePayload) =>
      runForVolunteerInOrder(volunteerId, async () => {
        const response = await axios.patch(`${apiPathOpportunityVolunteer}/${m2mId}`, { status });
        await syncEngagement(volunteerId, status);
        return response.data;
      }),
    successMessage: "dashboard.opportunityProfile.volunteersSec.statusUpdateSuccess",
    queryKeyToInvalidate,
    onSuccessCallback: () => {
      [...getComplementaryPrefixes(queryKeyToInvalidate), ...VOLUNTEER_QUERY_PREFIXES].forEach((prefix) =>
        queryClient.invalidateQueries({ queryKey: [prefix] }),
      );
    },
  });
};

export const useDeleteOpportunityVolunteer = (queryKeyToInvalidate: string[]) => {
  const queryClient = useQueryClient();
  const syncEngagement = useEngagementSync();

  return useMutationQuery<DeletePayload, unknown>({
    mutationFn: ({ m2mId, volunteerId }: DeletePayload) =>
      runForVolunteerInOrder(volunteerId, async () => {
        const response = await axios.delete(`${apiPathOpportunityVolunteer}/${m2mId}`);
        await syncEngagement(volunteerId);
        return response.data;
      }),
    successMessage: "dashboard.opportunityProfile.volunteersSec.removeSuccess",
    queryKeyToInvalidate,
    onSuccessCallback: () => {
      [...getComplementaryPrefixes(queryKeyToInvalidate), ...VOLUNTEER_QUERY_PREFIXES].forEach((prefix) =>
        queryClient.invalidateQueries({ queryKey: [prefix] }),
      );
    },
  });
};
