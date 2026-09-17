"use client";

import dynamic from "next/dynamic";
import { Markers } from "./helpers";
import { LoadingMapView } from "./LoadingMapView";

type Props = {
  markers?: Markers;
  activeMarkerIndex?: number;
  setActiveMarkerIndex: (num: number) => void;
};

const MapCard = dynamic(() => import("./MapCard"), {
  ssr: false,
  loading: () => <LoadingMapView />,
});

export const MapView = ({ markers, activeMarkerIndex, setActiveMarkerIndex }: Props) => {
  return (
    <MapCard markers={markers} activeMarkerIndex={activeMarkerIndex} setActiveMarkerIndex={setActiveMarkerIndex} />
  );
};
