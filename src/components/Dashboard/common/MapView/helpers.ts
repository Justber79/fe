import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
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
  avatarUrl?: string;
}>;

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];

export const createOpportunityMarkers = (opportunities: ApiOpportunityGetList[], lang: string): Markers => {
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
    const childItem = { title: opp.title, link: `/${lang}/dashboard/opportunities/${opp.id}` };

    if (!oppMap.has(String(opp.agentId))) {
      oppMap.set(String(opp.agentId), {
        lat: opp.lat,
        lon: opp.lon,
        label: opp.agentTitle,
        children: [childItem],
        onClick: () => null,
      });
    } else {
      oppMap.get(String(opp.agentId))?.children.push(childItem);
    }
  });
  return Array.from(oppMap.values());
};

export const createVolunteerMarkers = (volunteers: ApiVolunteerGetList[], t: TFunction, lang: string): Markers => {
  const volMap = new Map<
    string,
    {
      lat: number;
      lon: number;
      label: string;
      children: Array<{ title: string; link: string }>;
      avatarUrl: string;
      onClick: () => null;
    }
  >();

  volunteers?.forEach((vol) => {
    if (!vol.lat || !vol.lon) return;
    if (
      vol.statusEngagement !== VolunteerStateEngagementType.AVAILABLE &&
      vol.statusEngagement !== VolunteerStateEngagementType.ACTIVE
    )
      return;
    const childItem = { title: vol.name, link: `/${lang}/dashboard/volunteers/${vol.id}` };

    volMap.set(String(vol.id), {
      lat: vol.lat,
      lon: vol.lon,
      label: t(`dashboard.volunteers.filters.engagement.${vol.statusEngagement}`),
      children: [childItem],
      avatarUrl: getImageUrl(vol?.avatarUrl || defaultAvatarURL),
      onClick: () => null,
    });
  });
  return Array.from(volMap.values());
};
