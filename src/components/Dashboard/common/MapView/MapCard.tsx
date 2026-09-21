import "./map.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvent } from "react-leaflet";
import { DEFAULT_CENTER, EntityMarker } from "./helpers";
import { PopupContentWrapper, PopupHeader, StyledMapContainer } from "./styles";
import { useEffect, useRef } from "react";
import L, { LatLngExpression, Marker as LeafletMarker } from "leaflet";

interface Props {
  markers?: EntityMarker[];
  activeMarkerIndex?: number;
  setActiveMarkerIndex: (num: number) => void;
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
}

const SetViewOnClick = () => {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });

  return null;
};

const MapFlyTo = ({ position }: { position: LatLngExpression | undefined }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 12, { duration: 1 });
    }
  }, [position, map]);

  return null;
};

const MapCard = ({ markers, activeMarkerIndex, setActiveMarkerIndex, renderPopupContent }: Props) => {
  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});

  const generateCustomIcon = (url: string) => {
    const defaultIcon = new L.Icon.Default();
    if (!url) return defaultIcon;
    return L.icon({
      iconUrl: url,
      iconAnchor: [25, 5],
      className: "custom-icon",
    });
  };

  useEffect(() => {
    if (activeMarkerIndex !== undefined && markerRefs.current[activeMarkerIndex]) {
      const markerInstance = markerRefs.current[activeMarkerIndex];
      markerInstance.openPopup();
    }
  }, [activeMarkerIndex]);

  const activePosition: LatLngExpression | undefined =
    activeMarkerIndex !== undefined && markers?.[activeMarkerIndex]
      ? [markers[activeMarkerIndex].lat, markers[activeMarkerIndex].lon]
      : undefined;

  return (
    <StyledMapContainer>
      <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick />
        <MapFlyTo position={activePosition} />
        {markers?.map((marker, idx) => (
          <Marker
            key={`${idx}-${marker?.lat}-${marker?.lon}`}
            position={[marker.lat, marker.lon]}
            ref={(ref) => {
              if (ref) markerRefs.current[idx] = ref;
            }}
            eventHandlers={{
              click: () => setActiveMarkerIndex(idx),
            }}
            icon={generateCustomIcon(marker?.avatarUrl ?? "")}
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
