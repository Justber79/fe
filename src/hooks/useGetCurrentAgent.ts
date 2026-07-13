import { apiPathAgent, apiPathMe, AUTH_HINT_COOKIE_NAME, cacheTTL, USER_QUERY_KEY } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { ApiAgentGet, ApiUserGet } from "need4deed-sdk";

export const useGetCurrentAgent = () => {
  const isLoggedIn = getCookie(AUTH_HINT_COOKIE_NAME) === "true";

  const { data: user, isLoading: userLoading } = useGetQuery<ApiUserGet & { agentId?: number }>({
    queryKey: USER_QUERY_KEY,
    apiPath: apiPathMe,
    staleTime: cacheTTL,
    enabled: isLoggedIn,
    addLang: false,
  });

  const agentId = user?.agentId;

  const { data: agent, isLoading: agentLoading } = useGetQuery<ApiAgentGet>({
    queryKey: ["agent", String(agentId)],
    apiPath: `${apiPathAgent}/${agentId}`,
    staleTime: cacheTTL,
    enabled: !!agentId,
    addLang: false,
  });

  return { agent, agentId, isLoading: userLoading || (!!agentId && agentLoading) };
};
