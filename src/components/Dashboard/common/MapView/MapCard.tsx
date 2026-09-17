import "./map.css";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { DEFAULT_CENTER, mapContainerStyle, Markers } from "./helpers";
import Link from "next/link";
import { PopupWrapper } from "./styles";

type Props = {
  markers?: Markers;
  activeMarkerIndex?: number;
  setActiveMarkerIndex: (num: number) => void;
};

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

const MapCard = ({ markers, activeMarkerIndex, setActiveMarkerIndex }: Props) => {
  const markerRefs = useRef<Record<number, LeafletMarker | null>>({});

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
    <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom={true} style={mapContainerStyle}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewOnClick />
      {markers?.map((marker) => (
        <Marker key={`${marker.title}${marker?.lat}${marker?.lon}`} position={[marker.lat, marker.lon]}>
          <Link href={marker.link}>
            <Popup className="map-view-popup">
              <PopupWrapper>
                <span>{marker.title}</span>
                <span>{marker.ngo}</span>
              </PopupWrapper>
            </Popup>
          </Link>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapCard;
