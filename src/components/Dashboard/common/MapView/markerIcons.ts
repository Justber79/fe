import L from "leaflet";
import { defaultAvatarURL, DEFAULT_LEAFLET_ICON_URL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { MapEntity, SingleMarker } from "./types";

const defaultMapPinIcon = L.icon({
  iconUrl: DEFAULT_LEAFLET_ICON_URL,
  shadowUrl: "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const getMarkerIcon = (entity: MapEntity, childCount: number) => {
  if (childCount > 1) {
    const isOpportunity = entity === MapEntity.OPPORTUNITY;
    const isVolunteer = entity === MapEntity.VOLUNTEER;
    const iconSize = isVolunteer ? 50 : 41;
    return L.divIcon({
      className: `grouped-marker-icon${isVolunteer ? " grouped-marker-icon--avatar" : ""}`,
      html: `<img class="grouped-marker-icon__image${isOpportunity ? " grouped-marker-icon__image--opportunity" : isVolunteer ? " custom-avatar-icon" : ""}" src="${isVolunteer ? getImageUrl(defaultAvatarURL) : DEFAULT_LEAFLET_ICON_URL}" alt="" /><span class="grouped-marker-count">${childCount}</span>`,
      iconSize: isVolunteer ? [iconSize, iconSize] : [25, 41],
      iconAnchor: isVolunteer ? [iconSize / 2, iconSize / 2] : [12, 41],
    });
  }

  if (entity === MapEntity.VOLUNTEER) {
    const iconSize = 50;
    return L.icon({
      iconUrl: getImageUrl(defaultAvatarURL),
      shadowUrl: "",
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      className: "custom-avatar-icon",
    });
  }

  if (entity === MapEntity.OPPORTUNITY) {
    return L.icon({
      iconUrl: DEFAULT_LEAFLET_ICON_URL,
      shadowUrl: "",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      className: "need4deed-icon",
    });
  }
  return defaultMapPinIcon;
};

export const getSingleMarkerIcon = (marker: SingleMarker) => {
  if (marker.entity === MapEntity.OPPORTUNITY) {
    return L.icon({
      iconUrl: DEFAULT_LEAFLET_ICON_URL,
      shadowUrl: "",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      className: "need4deed-icon",
    });
  }
  if (marker.entity === MapEntity.VOLUNTEER) {
    const iconSize = 50;
    return L.icon({
      iconUrl: marker.avatarUrl || getImageUrl(defaultAvatarURL),
      shadowUrl: "",
      iconSize: [iconSize, iconSize],
      iconAnchor: [iconSize / 2, iconSize / 2],
      className: "custom-avatar-icon",
    });
  }
  return defaultMapPinIcon;
};
