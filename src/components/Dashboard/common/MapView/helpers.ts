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
import { formatAvailabilityItem } from "../../Profile/sections/VolunteerProfile/formatters";
import { getTopLanguages } from "../../Volunteers/helpers";
import { EntityMarker } from "./types";

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];

export const createOpportunityMarkers = (
  opportunities: ApiOpportunityGetList[],
  t: TFunction,
  lang: string,
): EntityMarker[] => {
  const oppMap = new Map<
    string,
    {
      lat: number;
      lon: number;
      label: string;
      children: Array<{ title: string; link: string; language: string; availability: string }>;
      onClick: () => null;
    }
  >();

  opportunities?.forEach((opp) => {
    if (!opp.lat || !opp.lon) return;
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
      link: `/${lang}/dashboard/opportunities/${opp.id}`,
      language: topLanguages.join(", ") + (languageOverflow > 0 ? ` +${languageOverflow}` : "") || "—",
      availability: allAvailabilities.map((a) => a).join("; "),
    };

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

export const createVolunteerMarkers = (
  volunteers: ApiVolunteerGetList[],
  t: TFunction,
  lang: string,
): EntityMarker[] => {
  const volMap = new Map<
    string,
    {
      lat: number;
      lon: number;
      label: string;
      title: string;
      link: string;
      language: string;
      availability: string;
      avatarUrl: string;
      onClick?: () => null;
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

    volMap.set(String(vol.id), {
      lat: vol.lat,
      lon: vol.lon,
      label: vol.name,
      title: vol.name,
      link: `/${lang}/dashboard/volunteers/${vol.id}`,
      language: topLanguages.join(", ") + (languageOverflow > 0 ? ` +${languageOverflow}` : "") || "—",
      availability: allAvailabilities.map((a) => a).join("; "),
      avatarUrl: getImageUrl(vol?.avatarUrl || defaultAvatarURL),
      onClick: () => null,
    });
  });
  return Array.from(volMap.values());
};
