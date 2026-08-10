import { apiPathAgent, apiPathMe, AUTH_HINT_COOKIE_NAME, cacheTTL, USER_QUERY_KEY } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { useQueries } from "@tanstack/react-query";
import axios from "axios";
import { ApiUserGet } from "need4deed-sdk";

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
  // test here for multiple NGOs
  const agentIds = [agentId];

  const agentQueries = useQueries({
    queries: agentIds.map((id) => ({
      queryKey: ["agent", String(id)],
      queryFn: async () => {
        const res = await axios.get(`${apiPathAgent}/${id}`);
        return res.data;
      },
      staleTime: cacheTTL,
      enabled: !!id,
    })),
  });

  const currentAgents = agentQueries.map((q) => q.data?.data);

  return { agentId, isLoading: userLoading || agentQueries.some((q) => q.isLoading), currentAgents };
};
