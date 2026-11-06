import React from "react";
import { useTranslation } from "react-i18next";
import { MapView } from "../common/MapView/MapView";
import { MapContainer, MapHelperText, MapHelperWrapper, PopupCardHeader, PopupLink } from "../common/MapView/styles";
import { EntityMarker, MapEntity } from "../common/MapView/types";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { IconName } from "../Volunteers/icon";
import type { ApiAgentGetList } from "need4deed-sdk";

type Props = {
  filter: URLSearchParams;
  onCountChange: (count: number) => void;
  agents?: ApiAgentGetList[];
  onSelect?: (agent: ApiAgentGetList) => void;
};

export function AgentMapView({ filter, onCountChange, agents, onSelect }: Props) {
  const { t } = useTranslation();
  const agentsById = new Map(agents?.map((agent) => [String(agent.id), agent]));

  const renderPopupContent = (marker: EntityMarker) =>
    marker.children?.map((child) => (
      <PopupLink
        href={child.link}
        key={child.link}
        onClick={(event) => {
          const agent = child.id === undefined ? undefined : agentsById.get(String(child.id));
          if (!onSelect || !agent) return;
          event.preventDefault();
          onSelect(agent);
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

  return (
    <MapContainer>
      <MapHelperWrapper>
        <MapHelperText>{t("dashboard.map.addressNotice.agents")}</MapHelperText>
      </MapHelperWrapper>
      <MapView
        entity={MapEntity.AGENT}
        filter={filter}
        renderPopupContent={renderPopupContent}
        onCountChange={onCountChange}
      />
    </MapContainer>
  );
}
