import { apiPathAgent, apiPathMe, AUTH_HINT_COOKIE_NAME, cacheTTL, USER_QUERY_KEY } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { useQueries } from "@tanstack/react-query";
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
  // test here for multiple ngos, add more agentids
  const agentIds = [agentId, 2, 3];

  const { data: agent, isLoading: agentLoading } = useGetQuery<ApiAgentGet>({
    queryKey: ["agent", String(agentId)],
    apiPath: `${apiPathAgent}/${agentId}`,
    staleTime: cacheTTL,
    enabled: !!agentId,
    addLang: false,
  });

  const agentQueries = useQueries({
    queries: agentIds.map((id) => ({
      queryKey: ["agent", String(id)],
      queryFn: async () => {
        const res = await fetch(`${apiPathAgent}/${id}`);
        if (!res.ok) throw new Error("Failed to fetch agent");
        return res.json();
      },
      staleTime: cacheTTL,
      enabled: !!id,
    })),
  });

  const currentAgents = agentQueries.map((q) => q.data?.data) ?? [];

  return { agent, agentId, isLoading: userLoading || (!!agentId && agentLoading), currentAgents };
};
