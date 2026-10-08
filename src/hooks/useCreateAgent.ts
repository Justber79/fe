import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import axios from "axios";
import { ApiAgentCreateResponse, ApiAgentRegisterConflict, ApiAgentRegisterNew } from "need4deed-sdk";

export const getAgentConflict = (error: unknown): ApiAgentRegisterConflict | null => {
  if (!axios.isAxiosError(error) || error.response?.status !== 409) return null;
  const data = error.response.data as Partial<ApiAgentRegisterConflict> | undefined;
  return data?.agentId && (data.conflict === "title" || data.conflict === "address")
    ? (data as ApiAgentRegisterConflict)
    : null;
};

export const useCreateAgent = (onConflict?: (conflict: ApiAgentRegisterConflict) => void) => {
  return useMutationQuery<ApiAgentRegisterNew, ApiAgentCreateResponse>({
    apiPath: apiPathAgent,
    method: "post",
    successMessage: "dashboard.agents.createAgent.success",
    queryKeyToInvalidate: ["agents"],
    onErrorCallback: (error) => {
      const conflict = onConflict && getAgentConflict(error);
      if (!conflict) return false;
      onConflict(conflict);
      return true;
    },
  });
};
