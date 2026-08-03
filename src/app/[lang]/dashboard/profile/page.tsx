"use client";
import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { MultipleProfilesController } from "@/components/Dashboard/Profile/MultipleProfilesController";
import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { Paragraph } from "@/components/styled/text";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { useTranslation } from "react-i18next";

export default function DashboardProfilePage() {
  const { t } = useTranslation();
  const { agentId, isLoading } = useGetCurrentAgent();

  // test agentIds
  const agentIds = [1, 2, 3, 4, 5, 6];

  if (isLoading) {
    return (
      <CenteredWrapper>
        <Paragraph>{t("dashboard.profile.loading")}</Paragraph>
      </CenteredWrapper>
    );
  }

  if (!agentId || agentIds.length === 0) {
    return (
      <CenteredWrapper>
        <Paragraph>{t("dashboard.profile.notSetUp")}</Paragraph>
      </CenteredWrapper>
    );
  }

  return agentIds.length === 1 ? (
    <ProfileLayout entityId={String(agentIds[0])} entityType={"agent"} />
  ) : (
    <MultipleProfilesController agentIds={agentIds} />
  );
}
