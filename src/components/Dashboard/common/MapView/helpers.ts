import { LatLngExpression } from "leaflet";
import { ApiOpportunityGetList } from "need4deed-sdk";

export type Markers = Array<{
  lat: number;
  lon: number;
  label: string;
  children?: Array<{ title: string; link: string }>;
  onClick: () => null;
}>;

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];

export const createOpportunityMarkers = (opportunities: ApiOpportunityGetList[]): Markers => {
  const oppMap = new Map<
    string,
    { lat: number; lon: number; label: string; children: Array<{ title: string; link: string }>; onClick: () => null }
  >();

  opportunities?.forEach((opp) => {
    if (!opp.lat || !opp.lon) return;

    const childItem = { title: opp.title, link: `opportunities/${opp.id}` };

    if (!oppMap.has(opp.agentTitle)) {
      oppMap.set(opp.agentTitle, {
        lat: opp.lat,
        lon: opp.lon,
        label: opp.agentTitle,
        children: [childItem],
        onClick: () => null,
      });
    } else {
      oppMap.get(opp.agentTitle)?.children.push(childItem);
    }
  });
  return Array.from(oppMap.values());
};
