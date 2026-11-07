import React from "react";
import { useTranslation } from "react-i18next";
import { MapView } from "../common/MapView/MapView";
import { MapContainer, MapHelperText, MapHelperWrapper, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { IconName } from "../Volunteers/icon";
import { EntityMarker, MapEntity, SingleMarker } from "../common/MapView/types";

type Props = {
  filter: URLSearchParams;
  onCountChange: (count: number) => void;
  volunteerMarker: SingleMarker | null;
};

export function OpportunityMapView({ filter, onCountChange, volunteerMarker }: Props) {
  const { t } = useTranslation();

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

  return (
    <MapContainer>
      <MapHelperWrapper>
        <MapHelperText>{t("dashboard.map.addressNotice.opportunities")}</MapHelperText>
      </MapHelperWrapper>
      <MapView
        entity={MapEntity.OPPORTUNITY}
        filter={filter}
        renderPopupContent={renderPopupContent}
        renderSinglePopupContent={renderSinglePopupContent}
        filterMarker={volunteerMarker}
        onCountChange={onCountChange}
      />
    </MapContainer>
  );
}
