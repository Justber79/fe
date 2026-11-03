import "leaflet/dist/leaflet.css";
import "./map.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import {
  BERLIN_BOUNDS,
  DEFAULT_CENTER,
  defaultMapPinIcon,
  getGroupedMarkerIcon,
  getVolunteerMarkerIcon,
  n4DMapPinIcon,
} from "./helpers";
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
import { questionMark, ScreenTypes } from "@/config/constants";
import { QueryParamsKeys } from "need4deed-sdk";
import { useScreenType } from "@/context/DeviceContext";
import { MapPopupControlVisibility } from "./controls/MapPopupVisibilityControl";
import { MapSizeInvalidator } from "./controls/MapSizeInvalidator";
import { MapZoom } from "./controls/MapZoom";

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
    return filterMarker.entity === EntityType.VOLUNTEER ? getVolunteerMarkerIcon(avatarSize) : defaultMapPinIcon;
  }, [filterMarker, avatarSize]);

  const markerIcons = useMemo(
    () =>
      markers?.map((marker) => {
        if ((marker.children?.length ?? 0) > 1) return getGroupedMarkerIcon(marker, avatarSize);
        if (marker.entity === EntityType.VOLUNTEER) return getVolunteerMarkerIcon(avatarSize);
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
