import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentCreateResponse, ApiAgentRegisterNew } from "need4deed-sdk";

export const useCreateAgent = () => {
  return useMutationQuery<ApiAgentRegisterNew, ApiAgentCreateResponse>({
    apiPath: apiPathAgent,
    method: "post",
    successMessage: "dashboard.agents.createAgent.success",
    queryKeyToInvalidate: ["agents"],
  });
};
