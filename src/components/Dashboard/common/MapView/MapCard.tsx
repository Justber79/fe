import "leaflet/dist/leaflet.css";
import "./map.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { BERLIN_BOUNDS, DEFAULT_CENTER } from "./helpers";
import { PopupContentWrapper, PopupHeader, StyledMapContainer } from "./styles";
import { useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import L from "leaflet";
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
import { MapZoom } from "./controls/MapZoom";
import { getImageUrl } from "@/utils";

interface Props {
  markers?: EntityMarker[];
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (filter: SingleMarker) => React.ReactNode;
}

const MapCard = ({ markers, renderPopupContent, filterMarker, renderSinglePopupContent }: Props) => {
  const [enableScroll, setEnableScroll] = useState<boolean>(true);
  const [showOtherRacs, setShowOtherRacs] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const screenSize = useScreenType();

  const defaultMapPinIcon = L.icon({
    iconUrl: DEFAULT_LEAFLET_ICON_URL,
    shadowUrl: "",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    className: "need4deed-icon",
  });

  const getVolunteerMarkerIcon = (url: string) => {
    if (typeof window === "undefined") {
      return L.icon({
        iconUrl: url || getImageUrl(defaultAvatarURL),
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        className: "custom-avatar-icon",
      });
    }

    const avatarSize = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--dashboard-map-custom-icon-width") || "30",
    );
    const size = Number.isFinite(avatarSize) && avatarSize > 0 ? avatarSize : 30;

    return L.icon({
      iconUrl: url || getImageUrl(defaultAvatarURL),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      className: "custom-avatar-icon",
    });
  };

  const selectedDistrictTitles = useMemo(() => searchParams.getAll(QueryParamsKeys.DISTRICT), [searchParams]);
  const selectedDistrictTitlesRef = useRef(selectedDistrictTitles);

  selectedDistrictTitlesRef.current = selectedDistrictTitles;

  const { data: districtGeometries } = useGetDistrictGeometry();

  const isMobile = screenSize === ScreenTypes.MOBILE;
  const isTablet = screenSize === ScreenTypes.TABLET;
  const mapZoom = isMobile ? 9 : isTablet ? 10 : 11;

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

  const generateCustomIcon = (url: string, entity?: EntityType) => {
    if (entity === EntityType.OPPORTUNITY) return defaultMapPinIcon;
    if (entity === EntityType.VOLUNTEER) return getVolunteerMarkerIcon(url);
    return defaultMapPinIcon;
  };

  return (
    <StyledMapContainer>
      <MapContainer center={DEFAULT_CENTER} minZoom={9} zoom={mapZoom} maxBounds={BERLIN_BOUNDS}>
        <MapSizeInvalidator />
        <MapZoom zoom={mapZoom} />
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
            icon={generateCustomIcon(filterMarker.avatarUrl ?? "", filterMarker.entity)}
            zIndexOffset={200}
          >
            <Popup>{renderSinglePopupContent?.(filterMarker)}</Popup>
          </Marker>
        )}
        {markers?.map((marker, idx) => (
          <Marker
            key={`${idx}-${marker?.lat}-${marker?.lon}`}
            position={[marker.lat, marker.lon]}
            icon={generateCustomIcon(marker?.avatarUrl ?? "", marker.entity)}
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
