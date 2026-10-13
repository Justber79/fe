import { apiPathAgentRegister, cacheTTL } from "@/config/constants";
import { ApiOrganizationGetList } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

export const useGetRegistrationOrganizations = (token: string | null) => {
  const {
    data = [],
    isLoading,
    isError,
  } = useGetQuery<ApiOrganizationGetList[]>({
    queryKey: ["registration-organizations"],
    apiPath: `${apiPathAgentRegister}/organizations?token=${encodeURIComponent(token ?? "")}`,
    staleTime: cacheTTL,
    enabled: Boolean(token),
  });
  return { organizations: data, isLoading, isError };
};
