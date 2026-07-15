import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { apiPathPerson } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiRepresentativePatch } from "need4deed-sdk";
import { DeepPartial } from "ts-type-safe";

export const useUpdateAgentContact = (personId: string, agentId: string) => {
  return useMutationQuery<DeepPartial<ApiRepresentativePatch>, ApiAgentProfileGet>({
    apiPath: `${apiPathPerson}${personId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.contactDetails.saveSuccess",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
