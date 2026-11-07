import { ApiDistrictMarker, Lang } from "need4deed-sdk";
import { TFunction } from "i18next";
import { formatAvailabilityItem } from "../../Profile/sections/VolunteerProfile/formatters";
import { MapEntity } from "./types";

const profilePath: Record<MapEntity, string> = {
  [MapEntity.AGENT]: "agents",
  [MapEntity.OPPORTUNITY]: "opportunities",
  [MapEntity.VOLUNTEER]: "volunteers",
};

const markerLabelKey: Record<MapEntity, string> = {
  [MapEntity.AGENT]: "agents",
  [MapEntity.OPPORTUNITY]: "opportunities",
  [MapEntity.VOLUNTEER]: "volunteers",
};

export const createDistrictMarkers = (
  districtMarkers: ApiDistrictMarker[],
  entity: MapEntity,
  t: TFunction,
  lang: string,
  districtTitles: ReadonlyMap<number, string>,
) =>
  districtMarkers.flatMap((marker) => {
    if (marker.entity !== entity || marker.lat === null || marker.lon === null) return [];
    const language = lang.split("-")[0] === Lang.DE ? Lang.DE : Lang.EN;

    return [
      {
        lat: marker.lat,
        lon: marker.lon,
        districtId: marker.districtId,
        label: t(`dashboard.map.${markerLabelKey[entity]}`),
        entity,
        children: marker.children.map((child) => ({
          id: child.id,
          title: child.title,
          link: `/${lang}/dashboard/${profilePath[entity]}/${child.id}`,
          language: child.languages
            ?.map(({ title }) => title)
            .filter(Boolean)
            .join(", "),
          availability: child.availability
            ?.filter((item): item is typeof item & { day: string; daytime: string } =>
              Boolean(item.day && item.daytime),
            )
            .map(({ day, daytime }) => formatAvailabilityItem(day, daytime, t))
            .join("; "),
          type: child.type?.title?.[language] ?? child.type?.title?.[Lang.DE],
          district: child.district?.title ?? districtTitles.get(marker.districtId),
        })),
      },
    ];
  });

export const getDistrictMarkerItems = (districtMarkers: ApiDistrictMarker[]) =>
  districtMarkers.flatMap(({ children, entity }) =>
    children.map((child) => ({
      id: child.id,
      title: child.title,
      entity,
      type: child.type,
      statusTypes: child.statusTypes,
    })),
  );
