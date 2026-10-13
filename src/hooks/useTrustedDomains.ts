import { apiPathTrustedDomain, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { useMutationQuery } from "@/hooks/useMutationQuery";
import axios from "axios";
import { ApiTrustedDomain, ApiTrustedDomainPost } from "need4deed-sdk";

const queryKey = ["trusted-domains"];

export const useTrustedDomains = (onDuplicate?: () => void) => {
  const {
    data: domains = [],
    isLoading,
    isError,
  } = useGetQuery<ApiTrustedDomain[]>({
    queryKey,
    apiPath: apiPathTrustedDomain,
    staleTime: cacheTTL,
  });

  const { mutate: addDomain, isPending: isAdding } = useMutationQuery<ApiTrustedDomainPost, ApiTrustedDomain>({
    apiPath: apiPathTrustedDomain,
    method: "post",
    successMessage: "dashboard.admin.domains.added",
    queryKeyToInvalidate: queryKey,
    onErrorCallback: (error) => {
      if (!onDuplicate || !axios.isAxiosError(error) || error.response?.status !== 409) return false;
      onDuplicate();
      return true;
    },
  });

  const { mutate: removeDomain, isPending: isRemoving } = useMutationQuery<number, unknown>({
    mutationFn: (id) => axios.delete(`${apiPathTrustedDomain}/${id}`).then((res) => res.data),
    successMessage: "dashboard.admin.domains.removed",
    queryKeyToInvalidate: queryKey,
  });

  return { domains, isLoading, isError, addDomain, isAdding, removeDomain, isRemoving };
};
