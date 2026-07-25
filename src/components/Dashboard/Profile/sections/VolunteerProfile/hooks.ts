import { apiPathOption } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";

export type ApiLanguageOption = {
  id: number;
  title: string;
  isoCode?: string;
};

type ResourceType = "language" | "activity" | "skill" | "district" | "agent_type" | "service";

function useApiResource(resource: ResourceType) {
  const { data, isLoading, isError } = useGetQuery<Record<ResourceType, ApiLanguageOption[]>>({
    queryKey: [resource],
    apiPath: `${apiPathOption}/${resource}`,
    staleTime: Infinity,
  });

  return {
    data: data?.[resource] || [],
    isLoading,
    isError,
  };
}

export const useApiLanguages = () => useApiResource("language");
export const useApiActivities = () => useApiResource("activity");
export const useApiSkills = () => useApiResource("skill");
export const useApiDistricts = () => useApiResource("district");
export const useApiAgentTypes = () => useApiResource("agent_type");
export const useApiServices = () => useApiResource("service");
