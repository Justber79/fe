import React from "react";
import { MapView } from "../common/MapView/MapView";
import { MapContainer, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { useTranslation } from "react-i18next";
import { IconName } from "../Volunteers/icon";
import { EntityMarker, SingleMarker } from "../common/MapView/types";
import PaginationNumbers from "@/components/core/paginatedGrid/PaginationNumbers";

type Props = {
  markers: EntityMarker[];
  volunteerMarker: SingleMarker | null;
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

export function OpportunityMapView({
  markers,
  volunteerMarker,
  count,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}: Props) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(count / itemsPerPage);
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

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

  const renderPopupContent = (marker: EntityMarker) => {
    if ("children" in marker) {
      return marker.children?.map((child) => (
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
    }
  };

  return (
    <MapContainer>
      <MapView
        markers={markers}
        renderPopupContent={renderPopupContent}
        renderSinglePopupContent={renderSinglePopupContent}
        filterMarker={volunteerMarker}
      />
      <PaginationNumbers currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
    </MapContainer>
  );
}
