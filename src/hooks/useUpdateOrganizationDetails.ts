import { ApiAgentProfileGet } from "@/components/Dashboard/Profile/types";
import { apiPathAgent } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { ApiAgentPatch } from "need4deed-sdk";

// addressStreet and addressPostcode are not yet in ApiAgentPatch SDK type
type OrganizationDetailsPatch = Pick<ApiAgentPatch, "about" | "website"> & {
  addressStreet?: string;
  addressPostcode?: string;
};

export const useUpdateOrganization = (agentId: string) => {
  return useMutationQuery<OrganizationDetailsPatch, ApiAgentProfileGet>({
    apiPath: `${apiPathAgent}/${agentId}`,
    method: "patch",
    successMessage: "dashboard.agentProfile.organisationDetails.saveSuccess",
    queryKeyToInvalidate: ["agent", agentId],
  });
};
