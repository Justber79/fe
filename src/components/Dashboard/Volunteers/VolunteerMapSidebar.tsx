import React from "react";
import { MapOpportunityItem, MapOpportunityList, MapSidebar, MarkerCard, MarkerLabel } from "../common/MapView/styles";
import { ArrowRightIcon } from "@phosphor-icons/react";
import { Markers } from "../common/MapView/helpers";

type Props = {
  markers: Markers;
  activeMarkerIndex: number;
  handleSelectLocation: (num: number) => void;
};

export default function VolunteerMapSidebar({ markers, activeMarkerIndex, handleSelectLocation }: Props) {
  return (
    <MapSidebar>
      {markers.map((marker, idx) => (
        <MarkerCard
          key={`${marker.label}-${idx}`}
          $isActive={activeMarkerIndex === idx}
          onClick={() => handleSelectLocation(idx)}
        >
          <MarkerLabel>{marker.label}</MarkerLabel>
          <MapOpportunityList>
            {marker?.children?.map((vol) => (
              <MapOpportunityItem key={vol.link || vol.title}>
                <ArrowRightIcon size={24} />
                {vol.title}
              </MapOpportunityItem>
            ))}
          </MapOpportunityList>
        </MarkerCard>
      ))}
    </MapSidebar>
  );
}
