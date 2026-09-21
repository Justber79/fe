import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { EntityMarker } from "../common/MapView/helpers";
import { useEffect } from "react";
import { MapContainer, PopupLink } from "../common/MapView/styles";
import CardDetail from "./CardDetail";
import { CardParagraph } from "./VolunteerCard";
import { IconName } from "./icon";
import { useTranslation } from "react-i18next";

type Props = {
  count: number;
  setNumOfVols: (num: number) => void;
  markers: EntityMarker[];
};

export function VolunteerMapView({ markers, setNumOfVols }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);
  const { t } = useTranslation();

  const renderPopupContent = (marker: EntityMarker) => {
    if ("availability" in marker) {
      return (
        <PopupLink href={marker.link} key={marker.title}>
          <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
            <CardParagraph text={marker.availability} />
          </CardDetail>
          <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
            <CardParagraph text={marker.language} />
          </CardDetail>
        </PopupLink>
      );
    }
  };

  useEffect(() => {
    setNumOfVols(markers?.length);
  }, [markers]);
  return (
    <MapContainer>
      <MapView
        markers={markers}
        activeMarkerIndex={activeMarkerIndex}
        setActiveMarkerIndex={setActiveMarkerIndex}
        renderPopupContent={renderPopupContent}
      />
    </MapContainer>
  );
}
