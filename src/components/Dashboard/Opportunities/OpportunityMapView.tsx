import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { Markers } from "../common/MapView/helpers";
import { useEffect } from "react";
import { ArrowRightIcon } from "@phosphor-icons/react";
import {
  MapContainer,
  MapOpportunityList,
  MapSidebar,
  MarkerCard,
  MarkerLabel,
  MapOpportunityItem,
} from "../common/MapView/styles";

type Props = {
  count: number;
  setNumOfOpps: (num: number) => void;
  markers: Markers;
};

export function OpportunityMapView({ markers, setNumOfOpps }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);

  const handleSelectLocation = (index: number) => {
    setActiveMarkerIndex(index);
  };

  useEffect(() => {
    setNumOfOpps(markers.length);
  }, [markers]);
  return (
    <MapContainer>
      <MapSidebar>
        {markers.map((marker, idx) => (
          <MarkerCard
            key={`${marker.label}-${idx}`}
            $isActive={activeMarkerIndex === idx}
            onClick={() => handleSelectLocation(idx)}
          >
            <MarkerLabel>{marker.label}</MarkerLabel>
            <MapOpportunityList>
              {marker?.children?.map((opp) => (
                <MapOpportunityItem key={opp.link || opp.title}>
                  <ArrowRightIcon size={24} />
                  {opp.title}
                </MapOpportunityItem>
              ))}
            </MapOpportunityList>
          </MarkerCard>
        ))}
      </MapSidebar>
      <MapView markers={markers} activeMarkerIndex={activeMarkerIndex} setActiveMarkerIndex={setActiveMarkerIndex} />
    </MapContainer>
  );
}
