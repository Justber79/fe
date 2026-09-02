import { ApiOrganizationGetList } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";
import { apiPathOrganization, cacheTTL } from "@/config/constants";

export const useGetOrganization = () => {
  const { data, isLoading, isError, error } = useGetQuery<ApiOrganizationGetList[]>({
    queryKey: ["organization"],
    apiPath: `${apiPathOrganization}`,
    staleTime: cacheTTL,
    addLang: false,
  });

  return {
    data,
    isLoading,
    isError,
    error,
  };
};
