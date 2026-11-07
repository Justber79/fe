import { apiPathMe, AUTH_HINT_COOKIE_NAME, cacheTTL, USER_QUERY_KEY } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { ApiUserGet } from "need4deed-sdk";

export const useCurrentUserQuery = (enabled?: boolean, requireAuthHint = true) => {
  const hasAuthHint = getCookie(AUTH_HINT_COOKIE_NAME) === "true";

  return useGetQuery<ApiUserGet>({
    queryKey: USER_QUERY_KEY,
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled: requireAuthHint ? hasAuthHint && enabled : enabled,
  });
};

export const useCurrentUser = (enabled?: boolean) => useCurrentUserQuery(enabled).data;
