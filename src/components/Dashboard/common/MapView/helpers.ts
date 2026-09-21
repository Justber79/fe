import { TFunction } from "i18next";
import { LatLngExpression } from "leaflet";
import { ApiOpportunityGetList, OpportunityStatusType } from "need4deed-sdk";
import { formatAvailabilityItem } from "../../Profile/sections/VolunteerProfile/formatters";
import { getTopLanguages } from "../../Volunteers/helpers";

export type OpportunityMarker = {
  lat: number;
  lon: number;
  label: string;
  children?: Array<{ title: string; link: string; language: string; availability: string }>;
  onClick: () => null;
  avatarUrl?: string;
};

export type EntityMarker = OpportunityMarker;

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
