"use client";
import { AgentType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { StepDescription, StepTitle } from "../styled";
import { AgentRegistrationData } from "../types";

const ReviewList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ReviewRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ReviewKey = styled.dt`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-grey-500);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ReviewValue = styled.dd`
  font-size: 0.9375rem;
  color: var(--color-midnight);
  margin: 0;
`;

const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  [AgentType.AE]: "AE",
  [AgentType.GU1]: "GU1",
  [AgentType.GU2]: "GU2",
  [AgentType.GU2_PLUS]: "GU2+",
  [AgentType.GU3]: "GU3",
  [AgentType.NU]: "NU",
  [AgentType.ASOG]: "ASOG",
  [AgentType.COUNSELING_CENTER]: "Counseling Center",
  [AgentType.TANDEM]: "Tandem",
  [AgentType.MULTIPLE_SOCIAL_SUPPORT]: "Multiple Social Support",
};

interface Props {
  data: AgentRegistrationData;
}

export function ReviewStep({ data }: Props) {
  const { t } = useTranslation();

  const rows: { key: string; value: string }[] = [
    { key: t("agentRegistration.fields.firstName"), value: data.firstName },
    { key: t("agentRegistration.fields.lastName"), value: data.lastName },
    { key: t("agentRegistration.fields.email"), value: data.email },
    { key: t("agentRegistration.fields.organizationName"), value: data.organizationName },
    {
      key: t("agentRegistration.fields.organizationType"),
      value: data.organizationType ? AGENT_TYPE_LABELS[data.organizationType] : "—",
    },
    { key: t("agentRegistration.fields.addressStreet"), value: data.addressStreet || "—" },
    { key: t("agentRegistration.fields.addressPostcode"), value: data.addressPostcode || "—" },
    {
      key: t("agentRegistration.fields.services"),
      value:
        data.services.length > 0
          ? data.services
              .map((s) => t(`dashboard.agents.filters.services.${s}`, { defaultValue: s }))
              .join(", ")
          : "—",
    },
  ];

  return (
    <div>
      <StepTitle>{t("agentRegistration.steps.review.title")}</StepTitle>
      <StepDescription>{t("agentRegistration.steps.review.description")}</StepDescription>
      <ReviewList>
        {rows.map(({ key, value }) => (
          <ReviewRow key={key}>
            <ReviewKey>{key}</ReviewKey>
            <ReviewValue>{value}</ReviewValue>
          </ReviewRow>
        ))}
      </ReviewList>
    </div>
  );
}
