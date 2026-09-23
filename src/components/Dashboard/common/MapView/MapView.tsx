"use client";

import dynamic from "next/dynamic";
import { LoadingMapView } from "./LoadingMapView";
import { EntityMarker } from "./types";

interface Props {
  markers?: EntityMarker[];
  activeMarkerIndex?: number;
  setActiveMarkerIndex: (num: number) => void;
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  showOtherRacs?: boolean;
}

const MapCard = dynamic(() => import("./MapCard"), {
  ssr: false,
  loading: () => <LoadingMapView />,
});

export const MapView = ({
  markers,
  activeMarkerIndex,
  setActiveMarkerIndex,
  renderPopupContent,
  showOtherRacs = false,
}: Props) => {
  return (
    <MapCard
      showOtherRacs={showOtherRacs}
      markers={markers}
      activeMarkerIndex={activeMarkerIndex}
      setActiveMarkerIndex={setActiveMarkerIndex}
      renderPopupContent={renderPopupContent}
    />
  );
};
