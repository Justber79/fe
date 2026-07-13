"use client";

import { MapPinIcon } from "@phosphor-icons/react";
import { AgentTrustLevel } from "@/components/Dashboard/Profile/types/agent";
import type { ApiAgentGetList, OptionItem } from "need4deed-sdk";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { IconDiv } from "@/components/styled/container";
import {
  createTrustLevelLabelMap,
  TRUST_LEVEL_OPTIONS,
} from "@/components/Dashboard/Profile/sections/ProfileHeader/agent/constants";
import { TrustLevelDropdown } from "@/components/Dashboard/Profile/sections/ProfileHeader/agent/TrustLevelDropdown";
import { Heading4, Paragraph } from "@/components/styled/text";
import { useUpdateAgentStatus } from "@/hooks";
import { getNormalizedAgent } from "./helpers";
import { createAgentTypeMap, createServiceTypeMap, createVolunteerSearchMap } from "./constants";
import { StatusBadge } from "../common/StatusBadge";
import { Card, CardDetailsInfo, CardHeader, CardHeaderInfo, DistrictContainer, DistrictDiv } from "./styles";

interface Props {
  agent: ApiAgentGetList;
  districtsList?: OptionItem[];
}

export const AgentCard = ({ agent, districtsList }: Props) => {
  const { t, i18n } = useTranslation();

  const { id, title, district, volunteerSearch, serviceType, type, trustLevel } = getNormalizedAgent(agent);
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;

  const { mutate: patchAgent } = useUpdateAgentStatus(agent.id);

  const volunteerSearchLabels = createVolunteerSearchMap(t);
  const trustLevelLabels = createTrustLevelLabelMap(t);
  const serviceTypeLabels = createServiceTypeMap(t);
  const agentTypeLabels = createAgentTypeMap(t);

  const profileUrl = id ? `/${i18n.language}/dashboard/agents/${id}` : "";

  const handleTrustLevelChange = (next: AgentTrustLevel) => {
    if (id == null) return;
    patchAgent({ trustLevel: next });
  };
  return (
    <Card as={Link} href={profileUrl}>
      <CardHeader>
        <CardHeaderInfo>
          <Heading4>{title}</Heading4>
        </CardHeaderInfo>
      </CardHeader>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.type")}</Heading4>
        <Paragraph> {agentTypeLabels[type]}</Paragraph>
      </CardDetailsInfo>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.volunteerSearch")}</Heading4>
        <StatusBadge status={volunteerSearch} label={volunteerSearchLabels[volunteerSearch]} />
      </CardDetailsInfo>
      <CardDetailsInfo onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()} role="presentation">
        <Heading4>{t("dashboard.agentProfile.trustLevel")}</Heading4>
        <TrustLevelDropdown
          value={trustLevel}
          options={TRUST_LEVEL_OPTIONS}
          labels={trustLevelLabels}
          onChange={handleTrustLevelChange}
        />
      </CardDetailsInfo>
      {serviceType?.length
        ? serviceType?.map((service) => (
            <CardDetailsInfo key={service}>
              <Heading4>{t("dashboard.agentProfile.serviceType")}</Heading4>
              <Paragraph>{serviceTypeLabels[service]}</Paragraph>
            </CardDetailsInfo>
          ))
        : null}
      <DistrictContainer>
        <DistrictDiv>
          <IconDiv size="var(--dashboard-agents-card-detail-icon-size)">
            <MapPinIcon weight="fill" />
          </IconDiv>
          <Paragraph>{districtTitle}</Paragraph>
        </DistrictDiv>
      </DistrictContainer>
    </Card>
  );
};
