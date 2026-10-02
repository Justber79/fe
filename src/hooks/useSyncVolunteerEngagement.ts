import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import {
  ApiOpportunityVolunteerGet,
  ApiVolunteerGet,
  OpportunityVolunteerStatusType,
  VolunteerStateEngagementType,
} from "need4deed-sdk";
import axios from "axios";

type SyncPayload = {
  volunteerId: number;
  status: OpportunityVolunteerStatusType;
};

// "Active" engagement follows the volunteer's matches: set when one becomes active,
// back to "Available" once none are active anymore.
async function syncEngagement({ volunteerId, status }: SyncPayload) {
  const volunteerPath = `${apiPathVolunteer}/${volunteerId}`;
  const setEngagement = (statusEngagement: VolunteerStateEngagementType) =>
    axios.patch(volunteerPath, { statusEngagement, dateReturn: null });

  if (status === OpportunityVolunteerStatusType.ACTIVE) {
    await setEngagement(VolunteerStateEngagementType.ACTIVE);
    return;
  }
  if (status !== OpportunityVolunteerStatusType.PAST) return;

  const [{ data: volunteer }, { data: links }] = await Promise.all([
    axios.get<{ data: ApiVolunteerGet }>(volunteerPath),
    axios.get<{ data: ApiOpportunityVolunteerGet[] }>(`${volunteerPath}/opportunity-linked`),
  ]);
  const isStillActive = links.data.some((link) => link.status === OpportunityVolunteerStatusType.ACTIVE);
  // Only undo our own "Active", never a status a coordinator set by hand.
  if (volunteer.data.statusEngagement === VolunteerStateEngagementType.ACTIVE && !isStillActive) {
    await setEngagement(VolunteerStateEngagementType.AVAILABLE);
  }
}

export const useSyncVolunteerEngagement = () =>
  useMutationQuery<SyncPayload, void>({
    mutationFn: syncEngagement,
    noToast: true,
    queryKeyToInvalidate: [["volunteer"], ["volunteers"], ["volunteer-opportunities"]],
  });
