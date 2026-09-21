"use client";

import dynamic from "next/dynamic";
import { Markers } from "./helpers";
import { LoadingMapView } from "./styles";

type Props = {
  markers?: Markers;
};

const MapCard = dynamic(() => import("./MapCard"), {
  ssr: false,
  loading: () => <LoadingMapView />,
});

export const MapView = ({ markers }: Props) => {
  return <MapCard markers={markers} />;
};
