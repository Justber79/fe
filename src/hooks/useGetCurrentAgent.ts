import { apiPathAgent, apiPathMe, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { getCookie } from "@/utils/helpers";
import { ApiAgentGet, ApiUserGet } from "need4deed-sdk";

export const useGetCurrentAgent = () => {
  const isLoggedIn = getCookie("is_logged_in") === "true";

  const { data: user, isLoading: userLoading } = useGetQuery<ApiUserGet & { agentId?: number }>({
    queryKey: ["user"],
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
