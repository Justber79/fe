import React, { useState } from "react";
import { MapView } from "../common/MapView/MapView";
import { EntityMarker } from "../common/MapView/helpers";
import { useEffect } from "react";
import { MapContainer, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { useTranslation } from "react-i18next";
import { IconName } from "../Volunteers/icon";

type Props = {
  setNumOfOpps: (num: number) => void;
  markers: EntityMarker[];
};

export function OpportunityMapView({ markers, setNumOfOpps }: Props) {
  const [activeMarkerIndex, setActiveMarkerIndex] = useState<number | undefined>(undefined);

  const { t } = useTranslation();

  const renderPopupContent = (marker: EntityMarker) => {
    if ("children" in marker) {
      return marker.children?.map((child) => (
        <PopupLink href={child.link} key={child.title}>
          <PopupCardHeader>{child.title}</PopupCardHeader>
          <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
            <CardParagraph text={child.availability} />
          </CardDetail>
          <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
            <CardParagraph text={child.language} />
          </CardDetail>
        </PopupLink>
      ));
    }
  };

  useEffect(() => {
    setNumOfOpps(markers.length);
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
