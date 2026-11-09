import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiVolunteerGet } from "need4deed-sdk";
import { DeepPartial } from "ts-type-safe";

type VolunteerProfileUpdateData = DeepPartial<
  Pick<
    ApiVolunteerGet,
    "languages" | "availability" | "activities" | "skills" | "locations" | "statusType" | "comments" | "ownerAgentId"
  >
>;

export const useUpdateVolunteerProfile = (volunteerId: number) => {
  return useMutationQuery<VolunteerProfileUpdateData, { message: string; data: ApiVolunteerGet }>({
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    method: "patch",
    successMessage: "dashboard.volunteerProfile.profileSection.saveSuccess",
    queryKeyToInvalidate: ["volunteer", String(volunteerId)],
  });
};
