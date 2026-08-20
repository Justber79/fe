import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentRegisterNew } from "need4deed-sdk";

// need4deed-sdk's ApiAgentCreateResponse isn't published yet (fe#911) — this
// mirrors its shape ({ agentId: number }) rather than block on it.
type CreateAgentResponse = { agentId: number };

export const useCreateAgent = () => {
  return useMutationQuery<ApiAgentRegisterNew, CreateAgentResponse>({
    apiPath: apiPathAgent,
    method: "post",
    successMessage: "dashboard.agents.createAgent.success",
    queryKeyToInvalidate: ["agents"],
  });
};
