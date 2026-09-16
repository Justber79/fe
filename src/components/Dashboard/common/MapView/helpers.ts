import { LatLngExpression } from "leaflet";
import { ApiOpportunityGetList } from "need4deed-sdk";

export type Markers = Array<{
  lat: number;
  lon: number;
  title: string;
  ngo: string;
  link: string;
  onClick: () => null;
}>;

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];

export const createOpportunityMarkers = (opportunities: ApiOpportunityGetList[]): Markers => {
  return (
    opportunities?.flatMap((opp) => {
      if (!opp.lat || !opp.lon) return [];

      return [
        {
          lat: opp.lat,
          lon: opp.lon,
          title: opp.title,
          ngo: opp.agentTitle,
          link: `opportunities/${opp.id}`,
          onClick: () => null,
        },
      ];
    }) ?? []
  );
};
