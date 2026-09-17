import { TFunction } from "i18next";
import { LatLngExpression } from "leaflet";
import {
  ApiOpportunityGetList,
  ApiVolunteerGetList,
  OpportunityStatusType,
  VolunteerStateEngagementType,
} from "need4deed-sdk";

export type Markers = Array<{
  lat: number;
  lon: number;
  label: string;
  children?: Array<{ title: string; link: string }>;
  onClick: () => null;
}>;

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];

export const mapContainerStyle = {
  height: "var(--dashboard-map-height)",
  aspectRatio: "1/1",
  borderRadius: "var(--dashboard-map-border-radius)",
  border: "var(--dashboard-map-border)",
};

export const createOpportunityMarkers = (opportunities: ApiOpportunityGetList[]): Markers => {
  const oppMap = new Map<
    string,
    { lat: number; lon: number; label: string; children: Array<{ title: string; link: string }>; onClick: () => null }
  >();

  opportunities?.forEach((opp) => {
    if (!opp.lat || !opp.lon) return;
    if (
      opp.statusOpportunity !== OpportunityStatusType.NEW &&
      opp.statusOpportunity !== OpportunityStatusType.SEARCHING
    )
      return;
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

export const createVolunteerMarkers = (volunteers: ApiVolunteerGetList[], t: TFunction): Markers => {
  const volMap = new Map<
    string,
    { lat: number; lon: number; label: string; children: Array<{ title: string; link: string }>; onClick: () => null }
  >();

  volunteers?.forEach((vol) => {
    if (!vol.lat || !vol.lon) return;
    if (
      vol.statusEngagement !== VolunteerStateEngagementType.AVAILABLE &&
      vol.statusEngagement !== VolunteerStateEngagementType.ACTIVE
    )
      return;
    const childItem = { title: vol.name, link: `volunteers/${vol.id}` };

    volMap.set(String(vol.id), {
      lat: vol.lat,
      lon: vol.lon,
      label: t(`dashboard.volunteers.filters.engagement.${vol.statusEngagement}`),
      children: [childItem],
      onClick: () => null,
    });
  });
  return Array.from(volMap.values());
};
