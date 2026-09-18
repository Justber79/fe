import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { Markers } from "../common/MapView/helpers";
import { useEffect } from "react";
import { MapContainer } from "../common/MapView/styles";

type Props = {
  count: number;
  setNumOfVols: (num: number) => void;
  markers: Markers;
};

export function VolunteerMapView({ markers, setNumOfVols }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    setNumOfVols(markers.length);
  }, [markers]);
  return (
    <MapContainer>
      <MapView markers={markers} activeMarkerIndex={activeMarkerIndex} setActiveMarkerIndex={setActiveMarkerIndex} />
    </MapContainer>
  );
}
