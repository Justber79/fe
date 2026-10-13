"use client";

import dynamic from "next/dynamic";
import { LoadingMapView } from "./LoadingMapView";
import { EntityMarker, SingleMarker } from "./types";

interface Props {
  markers?: EntityMarker[];
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (marker: SingleMarker) => React.ReactNode;
}

const MapCard = dynamic(() => import("./MapCard"), {
  ssr: false,
  loading: () => <LoadingMapView />,
});

export const MapView = ({ markers, renderPopupContent, filterMarker, renderSinglePopupContent }: Props) => {
  return (
    <MapCard
      markers={markers}
      renderPopupContent={renderPopupContent}
      filterMarker={filterMarker}
      renderSinglePopupContent={renderSinglePopupContent}
    />
  );
};
