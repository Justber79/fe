import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentRegistrationLinkResponse } from "need4deed-sdk";

export const useCreateRegistrationLink = (agentId: number) =>
  useMutationQuery<void, ApiAgentRegistrationLinkResponse>({
    apiPath: `${apiPathAgent}/${agentId}/registration-link`,
    method: "post",
    noToast: true,
  });
