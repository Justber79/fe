import "./map.css";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { DEFAULT_CENTER } from "./helpers";
import { PopupContentWrapper, PopupHeader, StyledMapContainer } from "./styles";
import { useState } from "react";
import L from "leaflet";
import BerlinRacs from "./BerlinRacs";
import { MapLegendControl } from "./MapLegend";
import { MapScroll } from "./MapScroll";
import { EntityMarker } from "./types";

interface Props {
  markers?: EntityMarker[];
  activeMarkerIndex?: number;
  setActiveMarkerIndex: (num: number) => void;
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  showOtherRacs?: boolean;
}

const SetViewOnClick = () => {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });

  return null;
};

const MapCard = ({ markers, renderPopupContent, showOtherRacs }: Props) => {
  const [enableScroll, setEnableScroll] = useState<boolean>(true);

  const generateCustomIcon = (url: string) => {
    if (!url) return new L.Icon.Default({ className: "need4deed-icon" });
    return L.icon({
      iconUrl: url,
      iconAnchor: [25, 5],
      className: "custom-icon",
    });
  };

  return (
    <StyledMapContainer>
      <MapContainer center={DEFAULT_CENTER} zoom={11}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick />
        <MapLegendControl />
        <MapScroll enableScroll={enableScroll} setEnabledScroll={setEnableScroll} />
        {showOtherRacs && <BerlinRacs />}
        {markers?.map((marker, idx) => (
          <Marker
            key={`${idx}-${marker?.lat}-${marker?.lon}`}
            position={[marker.lat, marker.lon]}
            icon={generateCustomIcon(marker?.avatarUrl ?? "")}
            zIndexOffset={marker?.avatarUrl ? 1000 : 0}
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
