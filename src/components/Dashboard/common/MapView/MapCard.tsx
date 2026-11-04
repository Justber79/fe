import "leaflet/dist/leaflet.css";
import "./map.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BERLIN_BOUNDS, DEFAULT_CENTER } from "./helpers";
import { PopupContentWrapper, PopupHeader, StyledMapContainer } from "./styles";
import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { BerlinRacs } from "./layers/BerlinRacs";
import { MapLegendControl } from "./controls/MapLegend";
import { MapScroll } from "./controls/MapScroll";
import { EntityMarker, EntityType, SingleMarker } from "./types";
import { MapOtherRacs } from "./controls/MapOtherRacs";
import { useGetDistrictGeometry } from "@/hooks/useGetDistrictGeometry";
import { DistrictPolygons } from "./layers/DistrictPolygons";
import { DEFAULT_LEAFLET_ICON_URL, defaultAvatarURL, questionMark, ScreenTypes } from "@/config/constants";
import { QueryParamsKeys } from "need4deed-sdk";
import { useScreenType } from "@/context/DeviceContext";
import { MapPopupControlVisibility } from "./controls/MapPopupVisibilityControl";
import { MapSizeInvalidator } from "./controls/MapSizeInvalidator";
import L from "leaflet";
import { getImageUrl } from "@/utils";

interface Props {
  markers?: EntityMarker[];
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (filter: SingleMarker) => React.ReactNode;
}

const defaultMapPinIcon = L.icon({
  iconUrl: DEFAULT_LEAFLET_ICON_URL,
  shadowUrl: "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const n4DMapPinIcon = L.icon({
  iconUrl: DEFAULT_LEAFLET_ICON_URL,
  shadowUrl: "",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "need4deed-icon",
});

const getVolunteerMarkerIcon = (avatarUrl: string | undefined, size: number) => {
  return L.icon({
    iconUrl: avatarUrl || getImageUrl(defaultAvatarURL),
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    className: "custom-avatar-icon",
  });
};

const getGroupedMarkerIcon = (marker: EntityMarker, avatarSize: number) => {
  const isVolunteer = marker.entity === EntityType.VOLUNTEER;
  const isOpportunity = marker.entity === EntityType.OPPORTUNITY;
  const markerCount = marker.children?.length ?? 0;
  const iconSize: [number, number] = isVolunteer ? [avatarSize, avatarSize] : [25, 41];
  const iconAnchor: [number, number] = isVolunteer ? [avatarSize / 2, avatarSize / 2] : [12, 41];
  const imageClassName = isVolunteer
    ? "grouped-marker-icon__image custom-avatar-icon"
    : isOpportunity
      ? "grouped-marker-icon__image grouped-marker-icon__image--opportunity"
      : "grouped-marker-icon__image";
  const iconClassName = isVolunteer ? "grouped-marker-icon grouped-marker-icon--avatar" : "grouped-marker-icon";

  return L.divIcon({
    className: iconClassName,
    html: `<img class="${imageClassName}" src="${isVolunteer ? getImageUrl(defaultAvatarURL) : DEFAULT_LEAFLET_ICON_URL}" alt="" /><span class="grouped-marker-count">${markerCount}</span>`,
    iconSize,
    iconAnchor,
  });
};

const MapCard = ({ markers, renderPopupContent, filterMarker, renderSinglePopupContent }: Props) => {
  const [enableScroll, setEnableScroll] = useState<boolean>(true);
  const [showOtherRacs, setShowOtherRacs] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const screenSize = useScreenType();

  const selectedDistrictTitles = useMemo(() => searchParams.getAll(QueryParamsKeys.DISTRICT), [searchParams]);
  const selectedDistrictTitlesRef = useRef(selectedDistrictTitles);

  selectedDistrictTitlesRef.current = selectedDistrictTitles;

  const { data: districtGeometries } = useGetDistrictGeometry();

  const isMobile = screenSize === ScreenTypes.MOBILE;
  const isTablet = screenSize === ScreenTypes.TABLET;
  const mapZoom = isMobile ? 9 : isTablet ? 10 : 11;
  const avatarSize = isMobile ? 30 : 50;

  const filterMarkerIcon = useMemo(() => {
    if (!filterMarker) return null;
    return filterMarker.entity === EntityType.VOLUNTEER
      ? getVolunteerMarkerIcon(filterMarker?.avatarUrl, avatarSize)
      : n4DMapPinIcon;
  }, [filterMarker, avatarSize]);

  const markerIcons = useMemo(
    () =>
      markers?.map((marker) => {
        if ((marker.children?.length ?? 0) > 1) return getGroupedMarkerIcon(marker, avatarSize);
        if (marker.entity === EntityType.VOLUNTEER) return getVolunteerMarkerIcon("", avatarSize);
        return marker.entity === EntityType.OPPORTUNITY ? n4DMapPinIcon : defaultMapPinIcon;
      }),
    [markers, avatarSize],
  );

  const handleDistrictClick = (title: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const selectedTitles = selectedDistrictTitlesRef.current;
    const nextSelectedTitles = selectedTitles.includes(title)
      ? selectedTitles.filter((selectedTitle) => selectedTitle !== title)
      : [...selectedTitles, title];

    selectedDistrictTitlesRef.current = nextSelectedTitles;
    params.delete("page");
    params.delete(QueryParamsKeys.DISTRICT);
    nextSelectedTitles.forEach((selectedTitle) => params.append(QueryParamsKeys.DISTRICT, selectedTitle));
    router.push(pathname + questionMark + params.toString(), { scroll: false });
  };

  return (
    <StyledMapContainer>
      <MapContainer center={DEFAULT_CENTER} minZoom={9} zoom={mapZoom} maxBounds={BERLIN_BOUNDS}>
        <MapSizeInvalidator />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapPopupControlVisibility />
        <MapLegendControl />
        {!isMobile && !isTablet && <MapScroll enableScroll={enableScroll} setEnabledScroll={setEnableScroll} />}
        {!isMobile && <MapOtherRacs showOtherRacs={showOtherRacs} setShowOtherRacs={setShowOtherRacs} />}
        {districtGeometries && (
          <DistrictPolygons
            districtGeometries={districtGeometries}
            onDistrictClick={handleDistrictClick}
            selectedDistrictTitles={selectedDistrictTitles}
          />
        )}
        {showOtherRacs && <BerlinRacs />}
        {filterMarker && (
          <Marker
            position={[filterMarker.lat, filterMarker.lon]}
            icon={filterMarkerIcon ?? defaultMapPinIcon}
            zIndexOffset={200}
          >
            <Popup>{renderSinglePopupContent?.(filterMarker)}</Popup>
          </Marker>
        )}
        {markers?.map((marker, idx) => (
          <Marker
            key={`${idx}-${marker?.lat}-${marker?.lon}`}
            position={[marker.lat, marker.lon]}
            icon={markerIcons?.[idx] ?? defaultMapPinIcon}
            zIndexOffset={100}
          >
            <Popup>
              <PopupContentWrapper>
                <PopupHeader>{marker.label}</PopupHeader>
                {renderPopupContent(marker)}
              </PopupContentWrapper>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </StyledMapContainer>
  );
};

export default MapCard;
