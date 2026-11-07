import { ApiDistrictAggregate } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";
import { MapEntity } from "@/components/Dashboard/common/MapView/types";
import { apiPathAggregateDistrict } from "@/config/constants";

export const useGetAggregateDistricts = (
  entity: MapEntity,
  hasUnsupportedFilters: boolean,
  filter: URLSearchParams,
) => {
  const apiPath = apiPathAggregateDistrict(entity);

  const { data, isError, isLoading } = useGetQuery<ApiDistrictAggregate>({
    queryKey: ["district-map-aggregate", entity, String(hasUnsupportedFilters)],
    apiPath,
    params: { filter },
    enabled: !hasUnsupportedFilters,
  });

  return { data, isError, isLoading };
};
