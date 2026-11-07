import React from "react";
import { useTranslation } from "react-i18next";
import { MapView } from "../common/MapView/MapView";
import { MapContainer, MapHelperText, MapHelperWrapper, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import CardDetail from "./CardDetail";
import { CardParagraph } from "./VolunteerCard";
import { IconName } from "./icon";
import { EntityMarker, MapEntity, SingleMarker } from "../common/MapView/types";

type Props = {
  filter: URLSearchParams;
  onCountChange: (count: number) => void;
  opportunityMarker: SingleMarker | null;
};

export function VolunteerMapView({ filter, onCountChange, opportunityMarker }: Props) {
  const { t } = useTranslation();

  const renderPopupContent = (marker: EntityMarker) =>
    marker.children?.map((child) => (
      <PopupLink href={child.link} key={child.link}>
        <PopupCardHeader>{child.title}</PopupCardHeader>
        <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
          <CardParagraph text={child.availability ?? ""} />
        </CardDetail>
        <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
          <CardParagraph text={child.language ?? ""} />
        </CardDetail>
      </PopupLink>
    ));

  const renderSinglePopupContent = (marker: SingleMarker) => (
    <PopupLink href={marker.link} key={marker.link}>
      <PopupCardHeader>{marker.title}</PopupCardHeader>
      <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
        <CardParagraph text={marker.availability} />
      </CardDetail>
      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        <CardParagraph text={marker.language} />
      </CardDetail>
    </PopupLink>
  );

  return (
    <MapContainer>
      <MapHelperWrapper>
        <MapHelperText>{t("dashboard.map.volunteersInterestedExplainer")}</MapHelperText>
      </MapHelperWrapper>
      <MapView
        entity={MapEntity.VOLUNTEER}
        filter={filter}
        renderPopupContent={renderPopupContent}
        renderSinglePopupContent={renderSinglePopupContent}
        filterMarker={opportunityMarker}
        onCountChange={onCountChange}
      />
    </MapContainer>
  );
}
