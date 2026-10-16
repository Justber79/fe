import React from "react";
import { MapView } from "../common/MapView/MapView";
import { MapContainer, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import { IconName } from "../Volunteers/icon";
import { useTranslation } from "react-i18next";
import { EntityMarker } from "../common/MapView/types";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import PaginationNumbers from "@/components/core/paginatedGrid/PaginationNumbers";
import type { ApiAgentGetList } from "need4deed-sdk";

type Props = {
  markers: EntityMarker[];
  count: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onSelect?: (agent: ApiAgentGetList) => void;
};

export function AgentMapView({ markers, count, itemsPerPage, currentPage, setCurrentPage, onSelect }: Props) {
  const { t } = useTranslation();
  const totalPages = Math.ceil(count / itemsPerPage);
  const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages) setCurrentPage(page);
  };

  const renderPopupContent = (marker: EntityMarker) => {
    if ("children" in marker) {
      return marker.children?.map((child) => (
        <PopupLink
          href={child.link}
          key={child.link}
          onClick={(event) => {
            if (onSelect && child.agent) {
              event.preventDefault();
              onSelect(child.agent);
            }
          }}
        >
          <PopupCardHeader>{child.title}</PopupCardHeader>
          <CardDetail header={t("dashboard.agents.filters.type.header")} iconName={IconName.ShootingStar}>
            <CardParagraph text={child.type ?? ""} />
          </CardDetail>
          <CardDetail header={t("dashboard.agents.district")} iconName={IconName.MapPin}>
            <CardParagraph text={child.district ?? ""} />
          </CardDetail>
        </PopupLink>
      ));
    }
  };

  return (
    <MapContainer>
      <MapView markers={markers} renderPopupContent={renderPopupContent} />
      <PaginationNumbers currentPage={currentPage} goToPage={goToPage} totalPages={totalPages} />
    </MapContainer>
  );
}
