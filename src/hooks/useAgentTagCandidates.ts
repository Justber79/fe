import { apiPathAgent } from "@/config/constants";
import { ApiAgentTagCandidate } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";

export const useAgentTagCandidates = (search: string, enabled: boolean) => {
  const { data = [] } = useGetQuery<ApiAgentTagCandidate[]>({
    queryKey: ["agent-tag-candidates", search],
    apiPath: `${apiPathAgent}/tag-candidates`,
    params: search ? { search } : {},
    enabled,
  });
  return data;
};
