"use client";

import dynamic from "next/dynamic";
import { EntityMarker } from "./helpers";
import { LoadingMapView } from "./LoadingMapView";

interface Props {
  markers?: EntityMarker[];
  activeMarkerIndex?: number;
  setActiveMarkerIndex: (num: number) => void;
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
}

const MapCard = dynamic(() => import("./MapCard"), {
  ssr: false,
  loading: () => <LoadingMapView />,
});

export const MapView = ({ markers, activeMarkerIndex, setActiveMarkerIndex, renderPopupContent }: Props) => {
  return (
    <MapCard
      markers={markers}
      activeMarkerIndex={activeMarkerIndex}
      setActiveMarkerIndex={setActiveMarkerIndex}
      renderPopupContent={renderPopupContent}
    />
  );
};
