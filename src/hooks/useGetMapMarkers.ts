import { ApiDistrictMarkerGet, Lang } from "need4deed-sdk";
import { useGetQuery } from "./useGetQuery";
import { MapEntity } from "@/components/Dashboard/common/MapView/types";
import { apiPathDistrictMarker } from "@/config/constants";

export const useGetMapMarkers = (
  entity: MapEntity,
  hasUnsupportedFilters: boolean,
  filter: URLSearchParams,
  lan: string,
  selectedDistrictId: number | undefined,
  canFetchMarkers: boolean,
) => {
  const apiPath = apiPathDistrictMarker(entity);

  const { data, isError, isLoading } = useGetQuery<ApiDistrictMarkerGet>({
    queryKey: [
      "district-map-markers",
      entity,
      String(selectedDistrictId ?? ""),
      String(hasUnsupportedFilters),
      String(canFetchMarkers),
    ],
    apiPath,
    params: {
      districtId: selectedDistrictId,
      language: lan.split("-")[0] === Lang.DE ? Lang.DE : Lang.EN,
      filter,
    },
    enabled: Boolean(selectedDistrictId) && !hasUnsupportedFilters && canFetchMarkers,
  });

  return { data, isError, isLoading };
};
