import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { TFunction } from "i18next";
import { LatLngBoundsExpression, LatLngExpression } from "leaflet";
import { formatAvailabilityItem } from "../../Profile/sections/VolunteerProfile/formatters";
import { getTopLanguages } from "../../Volunteers/helpers";
import { SingleFilter, SingleMarker } from "./types";
import { EntityTableName } from "need4deed-sdk";

export const DEFAULT_CENTER: LatLngExpression | undefined = [52.52, 13.405];
export const BERLIN_BOUNDS: LatLngBoundsExpression = [
  [52.15, 12.7],
  [52.9, 14.2],
];
export const MAP_AREA_RING: L.LatLngExpression[] = [
  [85, -180],
  [85, 180],
  [-85, 180],
  [-85, -180],
  [85, -180],
];

export const districtFillColors: Record<string, string> = {
  Mitte: "var(--map-district-fill-color-mitte-orange)",
  "Friedrichshain-Kreuzberg": "var(--map-district-fill-color-friedrichshain-kreuzberg-teal)",
  Pankow: "var(--map-district-fill-color-pankow-coral)",
  "Charlottenburg-Wilmersdorf": "var(--map-district-fill-color-charlottenburg-wilmersdorf-sage)",
  Spandau: "var(--map-district-fill-color-spandau-yellow)",
  "Steglitz-Zehlendorf": "var(--map-district-fill-color-steglitz-zehlendorf-blue)",
  "Tempelhof-Schöneberg": "var(--map-district-fill-color-tempelhof-schoeneberg-purple)",
  Neukölln: "var(--map-district-fill-color-neukoelln-green)",
  "Treptow-Köpenick": "var(--map-district-fill-color-treptow-koepenick-pink)",
  "Marzahn-Hellersdorf": "var(--map-district-fill-color-marzahn-hellersdorf-teal)",
  Lichtenberg: "var(--map-district-fill-color-lichtenberg-yellow)",
  Reinickendorf: "var(--map-district-fill-color-reinickendorf-blue)",
};

export const hasUnsupportedDistrictMapFilter = (districtFilter: Record<string, boolean>) => {
  const selectedDistricts = Object.keys(districtFilter).filter((district) => districtFilter[district]);
  return (
    selectedDistricts.length > 1 ||
    selectedDistricts.some((district) => !Object.prototype.hasOwnProperty.call(districtFillColors, district))
  );
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
    entity: EntityTableName.OPPORTUNITY,
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
    entity: EntityTableName.VOLUNTEER,
  };
};

export const resolveCssColor = (color: string) => {
  const variableName = color.match(/^var\((--[^)]+)\)$/)?.[1];
  return variableName ? getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() : color;
};
