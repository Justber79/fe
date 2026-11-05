import { apiPathStatistics, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { ApiStatisticsGet, ApiStatisticsQuery, StatisticsMetric } from "need4deed-sdk";

export const useStatistics = (metric: StatisticsMetric, query: ApiStatisticsQuery, enabled = true) => {
  const searchParams = new URLSearchParams(
    Object.entries(query).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  ).toString();

  const { data, isLoading, isError, isPlaceholderData } = useGetQuery<ApiStatisticsGet>({
    queryKey: ["statistics", metric, searchParams],
    apiPath: `${apiPathStatistics}/${metric}?${searchParams}`,
    staleTime: cacheTTL,
    enabled,
    keepPreviousData: true,
    toastOnError: false,
  });

  return { statistics: data, isLoading, isError, isRefetching: isPlaceholderData };
};
