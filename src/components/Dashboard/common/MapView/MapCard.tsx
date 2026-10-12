import "./map.css";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { BERLIN_BOUNDS, DEFAULT_CENTER } from "./helpers";
import { PopupContentWrapper, PopupHeader, StyledMapContainer } from "./styles";
import { useState } from "react";
import L from "leaflet";
import BerlinRacs from "./BerlinRacs";
import { MapLegendControl } from "./MapLegend";
import { MapScroll } from "./MapScroll";
import { EntityMarker, EntityType, SingleMarker } from "./types";
import { MapOtherRacs } from "./MapOtherRacs";

interface Props {
  markers?: EntityMarker[];
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (filter: SingleMarker) => React.ReactNode;
}

const SetViewOnClick = () => {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });

  return null;
};

const MapCard = ({ markers, renderPopupContent, filterMarker, renderSinglePopupContent }: Props) => {
  const [enableScroll, setEnableScroll] = useState<boolean>(true);
  const [showOtherRacs, setShowOtherRacs] = useState<boolean>(false);

  const generateCustomIcon = (url: string, count?: number, entity?: EntityType) => {
    if (entity === EntityType.OPPORTUNITY) return new L.Icon.Default({ className: "need4deed-icon" });
    if (entity === EntityType.VOLUNTEER)
      return L.icon({
        iconUrl: url,
        iconAnchor: [15, 15],
        className: "custom-avatar-icon",
      });
    return L.divIcon({
      iconAnchor: [35, 5],
      className: "custom-icon",
      html: `<div>${count}</div>`,
    });
  };

  return (
    <StyledMapContainer>
      <MapContainer center={DEFAULT_CENTER} minZoom={9} zoom={11} maxBounds={BERLIN_BOUNDS}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick />
        <MapLegendControl />
        <MapScroll enableScroll={enableScroll} setEnabledScroll={setEnableScroll} />
        <MapOtherRacs showOtherRacs={showOtherRacs} setShowOtherRacs={setShowOtherRacs} />
        {showOtherRacs && <BerlinRacs />}
        {filterMarker && (
          <Marker
            position={[filterMarker.lat, filterMarker.lon]}
            icon={generateCustomIcon(filterMarker.avatarUrl ?? "", 0, filterMarker.entity)}
            zIndexOffset={200}
          >
            <Popup>{renderSinglePopupContent?.(filterMarker)}</Popup>
          </Marker>
        )}
        {markers?.map((marker, idx) => (
          <Marker
            key={`${idx}-${marker?.lat}-${marker?.lon}`}
            position={[marker.lat, marker.lon]}
            icon={generateCustomIcon(marker?.avatarUrl ?? "", marker.children?.length)}
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
