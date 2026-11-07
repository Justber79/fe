"use client";

import dynamic from "next/dynamic";
import { LoadingMapView } from "./LoadingMapView";
import { EntityMarker, MapEntity, SingleMarker } from "./types";

interface Props {
  entity: MapEntity;
  filter: URLSearchParams;
  renderPopupContent: (marker: EntityMarker) => React.ReactNode;
  filterMarker?: SingleMarker | null;
  renderSinglePopupContent?: (marker: SingleMarker) => React.ReactNode;
  onCountChange: (count: number) => void;
}

const MapCard = dynamic(() => import("./MapCard"), {
  ssr: false,
  loading: () => <LoadingMapView />,
});

export const MapView = ({
  entity,
  filter,
  renderPopupContent,
  filterMarker,
  renderSinglePopupContent,
  onCountChange,
}: Props) => {
  return (
    <MapCard
      entity={entity}
      filter={filter}
      renderPopupContent={renderPopupContent}
      filterMarker={filterMarker}
      renderSinglePopupContent={renderSinglePopupContent}
      onCountChange={onCountChange}
    />
  );
};
