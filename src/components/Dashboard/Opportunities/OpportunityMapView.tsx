import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { Markers } from "../common/MapView/helpers";
import { useEffect } from "react";
import { MapContainer } from "../common/MapView/styles";

type Props = {
  count: number;
  setNumOfOpps: (num: number) => void;
  markers: Markers;
};

export function OpportunityMapView({ markers, setNumOfOpps }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);

  useEffect(() => {
    setNumOfOpps(markers.length);
  }, [markers]);
  return (
    <MapContainer>
      <MapView markers={markers} activeMarkerIndex={activeMarkerIndex} setActiveMarkerIndex={setActiveMarkerIndex} />
    </MapContainer>
  );
}
