"use client";
import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { MultipleProfilesController } from "@/components/Dashboard/Profile/MultipleProfilesController";
import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { Paragraph } from "@/components/styled/text";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { useTranslation } from "react-i18next";

export default function DashboardProfilePage() {
  const { t } = useTranslation();
  const { agentId, isLoading } = useGetCurrentAgent();
  const data = useCurrentUser();
  const volunteerId = data?.volunteerId ?? null;

  // test multiple agentIds here
  const agentIds: Array<number> = [];

  if (isLoading) {
    return (
      <CenteredWrapper>
        <Paragraph>{t("dashboard.profile.loading")}</Paragraph>
      </CenteredWrapper>
    );
  }

  if (!agentId && agentIds.length === 0 && !volunteerId) {
    return (
      <CenteredWrapper>
        <Paragraph>{t("dashboard.profile.notSetUp")}</Paragraph>
      </CenteredWrapper>
    );
  }

  if (volunteerId) {
    return <ProfileLayout entityId={String(volunteerId)} entityType={"volunteer"} />;
  }

  return agentIds.length > 1 ? (
    <MultipleProfilesController agentIds={agentIds} />
  ) : (
    <ProfileLayout entityId={String(agentId)} entityType={"agent"} />
  );
}
