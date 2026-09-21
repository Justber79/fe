import "./map.css";
import { MapContainer, Marker, Popup, TileLayer, useMapEvent } from "react-leaflet";
import { DEFAULT_CENTER, Markers } from "./helpers";
import { StyledMapContainer } from "./styles";

type Props = {
  markers?: Markers;
};

const SetViewOnClick = () => {
  const map = useMapEvent("click", (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: true,
    });
  });

  return null;
};

const MapCard = ({ markers }: Props) => {
  return (
    <StyledMapContainer>
      <MapContainer center={DEFAULT_CENTER} zoom={11} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SetViewOnClick />
        {markers?.map((marker) => (
          <Marker key={`${marker.lat}${marker.lon}`} position={[marker.lat, marker.lon]}>
            <Popup>{marker.label}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </StyledMapContainer>
  );
};

export default MapCard;
