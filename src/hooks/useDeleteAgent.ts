import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";

export const useDeleteAgent = (agentId: number, onSuccess?: () => void) => {
  return useMutationQuery<unknown, { message: string }>({
    apiPath: `${apiPathAgent}/${agentId}`,
    method: "delete",
    queryKeyToInvalidate: ["agents"],
    successMessage: "dashboard.agentProfile.dangerZone.deleteSuccess",
    onSuccessCallback: onSuccess,
  });
};
