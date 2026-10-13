import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { TFunction } from "i18next";
import { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import {
  ApiOpportunityGetList,
  ApiVolunteerGetList,
  OpportunityStatusType,
  VolunteerStateEngagementType,
} from "need4deed-sdk";
import { formatAvailabilityItem } from "../../Profile/sections/VolunteerProfile/formatters";
import { getTopLanguages } from "../../Volunteers/helpers";
import { EntityMarker, EntityType, SingleFilter, SingleMarker } from "./types";

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];
export const BERLIN_BOUNDS: LatLngBoundsExpression = [
  [51.359, 11.265],
  [53.5585, 14.7655],
];
export const createOpportunityMarkers = (
  opportunities: ApiOpportunityGetList[],
  t: TFunction,
  lang: string,
  volunteerId?: string,
): EntityMarker[] => {
  const oppMap = new Map<
    string,
    {
      lat: number;
      lon: number;
      label: string;
      children: Array<{ title: string; link: string; language: string; availability: string }>;
      entity: EntityType;
      onClick: () => null;
    }
  >();

  opportunities?.forEach((opp) => {
    if (!opp.lat || !opp.lon || !opp.agentId) return;
    if (
      opp.statusOpportunity !== OpportunityStatusType.NEW &&
      opp.statusOpportunity !== OpportunityStatusType.SEARCHING
    )
      return;

    const topLanguages = getTopLanguages(opp.languages, 2);
    const languageOverflow = opp.languages.length - topLanguages.length;

    const allAvailabilities = opp.availability
      .filter((a): a is typeof a & { day: string; daytime: string } => Boolean(a.day && a.daytime))
      .map((a) => formatAvailabilityItem(a.day, a.daytime, t));

    const childItem = {
      title: opp.title,
      link: `/${lang}/dashboard/opportunities/${opp.id}${volunteerId ? "?volunteer=" + volunteerId : ""}`,
      language: topLanguages.join(", ") + (languageOverflow > 0 ? ` +${languageOverflow}` : "") || "—",
      availability: allAvailabilities.map((a) => a).join("; "),
    };

    if (!oppMap.has(`${opp.lat},${opp.lon}`)) {
      oppMap.set(`${opp.lat},${opp.lon}`, {
        lat: opp.lat,
        lon: opp.lon,
        label: t("dashboard.map.opportunities"),
        children: [childItem],
        entity: EntityType.OPPORTUNITY,
        onClick: () => null,
      });
    } else {
      oppMap.get(String(`${opp.lat},${opp.lon}`))?.children.push(childItem);
    }
  });
  return Array.from(oppMap.values());
};

export const createVolunteerMarkers = (
  volunteers: ApiVolunteerGetList[],
  t: TFunction,
  lang: string,
  opportunityId?: string,
): EntityMarker[] => {
  const volMap = new Map<
    string,
    {
      lat: number;
      lon: number;
      label: string;
      children: Array<{ title: string; link: string; language: string; availability: string }>;
      entity: EntityType;
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

    const topLanguages = getTopLanguages(vol.languages, 2);
    const languageOverflow = vol.languages.length - topLanguages.length;

    const allAvailabilities = vol.availability
      .filter((a): a is typeof a & { day: string; daytime: string } => Boolean(a.day && a.daytime))
      .map((a) => formatAvailabilityItem(a.day, a.daytime, t));

    const childItem = {
      title: vol.name,
      link: `/${lang}/dashboard/volunteers/${vol.id}${opportunityId ? "?opportunity=" + opportunityId : ""}`,
      language: topLanguages.join(", ") + (languageOverflow > 0 ? ` +${languageOverflow}` : "") || "—",
      availability: allAvailabilities.map((a) => a).join("; "),
      avatarUrl: getImageUrl(vol?.avatarUrl || defaultAvatarURL),
    };

    if (!volMap.has(`${vol.lat},${vol.lon}`)) {
      volMap.set(`${vol.lat},${vol.lon}`, {
        lat: vol.lat,
        lon: vol.lon,
        label: t("dashboard.map.volunteers"),
        children: [childItem],
        entity: EntityType.VOLUNTEER,
        onClick: () => null,
      });
    } else {
      volMap.get(`${vol.lat},${vol.lon}`)?.children.push(childItem);
    }
  });
  return Array.from(volMap.values());
};

export const createSingleOpportunityMarker = (
  opportunityFilter: SingleFilter | undefined,
  t: TFunction,
  lang: string,
): SingleMarker | null => {
  if (!opportunityFilter || opportunityFilter.latitude === null || opportunityFilter.longitude === null) return null;
  const topLanguages = opportunityFilter?.languages.length > 0 ? getTopLanguages(opportunityFilter?.languages, 2) : [];
  const languageOverflow = opportunityFilter.languages?.length - topLanguages.length;

  const allAvailabilities = opportunityFilter.availability
    .filter((a): a is typeof a & { day: string; daytime: string } => Boolean(a.day && a.daytime))
    .map((a) => formatAvailabilityItem(a.day, a.daytime, t));
  return {
    lat: opportunityFilter.latitude,
    lon: opportunityFilter.longitude,
    label: "Opportunity",
    title: opportunityFilter.name,
    link: `/${lang}/dashboard/opportunities/${opportunityFilter.id}`,
    language: topLanguages.join(", ") + (languageOverflow > 0 ? ` +${languageOverflow}` : "") || "—",
    availability: allAvailabilities.map((a) => a).join("; "),
    entity: EntityType.OPPORTUNITY,
    onClick: () => null,
  };
};

export const createSingleVolunteerMarker = (
  volunteerFilter: SingleFilter | undefined,
  t: TFunction,
  lang: string,
): SingleMarker | null => {
  if (!volunteerFilter || volunteerFilter.latitude === null || volunteerFilter.longitude === null) return null;
  const topLanguages = volunteerFilter?.languages.length > 0 ? getTopLanguages(volunteerFilter?.languages, 2) : [];
  const languageOverflow = volunteerFilter.languages?.length - topLanguages.length;

  const allAvailabilities = volunteerFilter.availability
    .filter((a): a is typeof a & { day: string; daytime: string } => Boolean(a.day && a.daytime))
    .map((a) => formatAvailabilityItem(a.day, a.daytime, t));
  return {
    lat: volunteerFilter.latitude,
    lon: volunteerFilter.longitude,
    label: t("dashboard.map.volunteers"),
    title: volunteerFilter.name,
    link: `/${lang}/dashboard/volunteers/${volunteerFilter.id}`,
    language: topLanguages?.join(", ") + (languageOverflow > 0 ? ` +${languageOverflow}` : "") || "—",
    availability: allAvailabilities.map((a) => a).join("; "),
    avatarUrl: volunteerFilter.avatarUrl || getImageUrl(defaultAvatarURL),
    entity: EntityType.VOLUNTEER,
    onClick: () => null,
  };
};
