import { MapPinIcon } from "@phosphor-icons/react";
import { IconDiv } from "@/components/styled/container";
import { Heading4, Paragraph } from "@/components/styled/text";
import { Card, CardDetailsInfo, CardHeader, CardHeaderInfo, DistrictContainer, DistrictDiv } from "./styles";
import { useTranslation } from "react-i18next";
import { ApiAgentGetList, Lang, OptionItem } from "need4deed-sdk";
import { extractOptionTitle } from "@/components/Dashboard/Profile/sections/OpportunityDetails/formatters";

interface Props {
  agent: ApiAgentGetList;
  districtsList?: OptionItem[];
}

export const AgentReadOnlyCard = ({ agent, districtsList }: Props) => {
  const { t, i18n } = useTranslation();
  const { title, district, type } = agent;
  const districtTitle = district?.id ? (districtsList?.find((d) => d.id === district.id)?.title ?? null) : null;
  const lang = i18n.language as Lang;
  return (
    <Card $cursor="auto">
      <CardHeader>
        <CardHeaderInfo>
          <Heading4>{title}</Heading4>
        </CardHeaderInfo>
      </CardHeader>
      <CardDetailsInfo>
        <Heading4>{t("dashboard.agentProfile.type")}</Heading4>
        <Paragraph> {extractOptionTitle(type, lang)}</Paragraph>
      </CardDetailsInfo>
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
