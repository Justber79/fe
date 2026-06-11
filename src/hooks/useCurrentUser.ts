import { apiPathMe, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { ApiUserGet, UserRole } from "need4deed-sdk";

export const useCurrentUser = (enabled?: boolean) => {
  const hasAuthHint = getCookie("is_logged_in") === "true";

  const { data } = useGetQuery<ApiUserGet>({
    queryKey: ["user"],
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled: hasAuthHint && enabled,
  });

  const isAuthorized = data?.role === UserRole.ADMIN || UserRole.COORDINATOR;

  return { ...data, isAuthorized } as ApiUserGet & { isAuthorized: boolean };
};
