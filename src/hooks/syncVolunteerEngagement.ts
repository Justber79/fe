import { apiPathVolunteer } from "@/config/constants";
import {
  ApiOpportunityVolunteerGet,
  ApiVolunteerGet,
  OpportunityVolunteerStatusType,
  VolunteerStateEngagementType,
} from "need4deed-sdk";
import axios from "axios";

// "Active" engagement follows the volunteer's matches: set when one becomes active,
// back to "Available" once none are active anymore. `status` is undefined when the
// match was removed ("not a match").
export async function syncVolunteerEngagement(volunteerId: number, status?: OpportunityVolunteerStatusType) {
  const volunteerPath = `${apiPathVolunteer}/${volunteerId}`;
  const setEngagement = (statusEngagement: VolunteerStateEngagementType) =>
    axios.patch(volunteerPath, { statusEngagement, dateReturn: null });

  if (status === OpportunityVolunteerStatusType.ACTIVE) {
    await setEngagement(VolunteerStateEngagementType.ACTIVE);
    return;
  }
  if (status !== undefined && status !== OpportunityVolunteerStatusType.PAST) return;

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

const pendingByVolunteer = new Map<number, Promise<unknown>>();

// Match changes for one volunteer run one after another, so a "Past" check can't
// read the links while another match is still becoming active.
export function runForVolunteerInOrder<T>(volunteerId: number, task: () => Promise<T>): Promise<T> {
  const previous = pendingByVolunteer.get(volunteerId) ?? Promise.resolve();
  const next = previous.catch(() => undefined).then(task);
  pendingByVolunteer.set(volunteerId, next);
  next
    .finally(() => {
      if (pendingByVolunteer.get(volunteerId) === next) pendingByVolunteer.delete(volunteerId);
    })
    .catch(() => undefined);
  return next;
}
