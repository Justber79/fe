import { cacheTTL, gdiBerlinRacApi } from "@/config/constants";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Feature, FeatureCollection, Point } from "geojson";
import proj4 from "proj4";

export interface RefugeeAccommodationProperties {
  id: number;
  betriebsart: string;
  strasse: string;
  plaetze: number;
  gebaeudetyp: string;
  definition_gebaeudetyp: string;
  bezirk: string;
  ortsteil: string;
  status: string;
  hinweis_zu_plaetzen: string;
}

export type RefugeeAccommodationFeature = Feature<Point, RefugeeAccommodationProperties> & {
  geometry_name?: string;
};

export const useBerlinRacs = () => {
  proj4.defs("EPSG:25833", "+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs");

  const getBerlinRACs = async () => {
    const { data } = await axios.get<FeatureCollection<Point, RefugeeAccommodationProperties>>(gdiBerlinRacApi);
    if (!data?.features) return [];

    return data.features.map((feat) => {
      const [x, y] = feat.geometry.coordinates;
      const [lon, lat] = proj4("EPSG:25833", "EPSG:4326", [x, y]);
      const props = feat.properties;

      return {
        id: String(feat.id || props?.id),
        lat,
        lon,
        type: props?.betriebsart ?? "",
        district: props?.bezirk ?? "",
        area: props?.ortsteil ?? "",
        street: props?.strasse ?? "",
      };
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["berlin-racs"],
    queryFn: getBerlinRACs,
    staleTime: cacheTTL,
    refetchOnWindowFocus: false,
  });

  return { berlinRacs: data, isLoading, isError };
};
