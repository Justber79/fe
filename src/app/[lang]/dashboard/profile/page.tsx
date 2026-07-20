"use client";
import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { Paragraph } from "@/components/styled/text";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { useTranslation } from "react-i18next";

export default function DashboardProfilePage() {
  const { t } = useTranslation();
  const { agentId, isLoading } = useGetCurrentAgent();

  if (isLoading) {
    return (
      <CenteredWrapper>
        <Paragraph>{t("dashboard.profile.loading")}</Paragraph>
      </CenteredWrapper>
    );
  }

  if (!agentId) {
    return (
      <CenteredWrapper>
        <Paragraph>{t("dashboard.profile.notSetUp")}</Paragraph>
      </CenteredWrapper>
    );
  }

  return <ProfileLayout entityId={String(agentId)} entityType={"agent"} />;
}
