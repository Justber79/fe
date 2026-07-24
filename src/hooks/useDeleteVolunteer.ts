import { apiPathVolunteer } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

export const useDeleteVolunteer = (volunteerId: number, onSuccess?: () => void) => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathVolunteer}/${volunteerId}`,
    method: "delete",
    queryKeyToInvalidate: ["volunteers"],
    successMessage: "dashboard.volunteerProfile.dangerZone.deleteSuccess",
    onSuccessCallback: onSuccess,
  });
};
