import { apiPathDistrictGeometry } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { ApiDistrictGeometryCollection } from "need4deed-sdk";

export const useGetDistrictGeometry = () => {
  const { data } = useGetQuery<ApiDistrictGeometryCollection>({
    queryKey: ["district-geometry"],
    apiPath: apiPathDistrictGeometry,
    staleTime: Infinity,
  });

  return { data };
};
