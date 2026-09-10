"use client";
import CenteredWrapper from "@/components/core/common/CenteredWrapper";
import { MultipleProfilesController } from "@/components/Dashboard/Profile/MultipleProfilesController";
import ProfileLayout from "@/components/Dashboard/Profile/ProfileLayout";
import { DashboardLayout } from "@/components/Layout";
import { Paragraph } from "@/components/styled/text";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { UserRole } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ProfileStateContainer = styled(CenteredWrapper)`
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  height: auto;
  min-height: 60dvh;
  padding: var(--spacing-32) var(--spacing-16);
  text-align: center;

  p {
    max-width: 100%;
    overflow-wrap: anywhere;
  }
`;

const ProfileState = ({ children }: { children: React.ReactNode }) => (
  <DashboardLayout background="var(--layout-static-page-background-default)">
    <ProfileStateContainer>{children}</ProfileStateContainer>
  </DashboardLayout>
);

export default function DashboardProfilePage() {
  const { t } = useTranslation();
  const { agentId, volunteerId, userRole, isLoading } = useGetCurrentAgent();

  // test multiple agentIds here
  const agentIds: Array<number> = [];

  if (isLoading) {
    return (
      <ProfileState>
        <Paragraph>{t("dashboard.profile.loading")}</Paragraph>
      </ProfileState>
    );
  }

  if (userRole === UserRole.VOLUNTEER && !volunteerId) {
    return (
      <ProfileState>
        <Paragraph>{t("dashboard.profile.notVolProfSetUp")}</Paragraph>
      </ProfileState>
    );
  }

  if (!agentId && agentIds.length === 0 && !volunteerId) {
    return (
      <ProfileState>
        <Paragraph>{t("dashboard.profile.notSetUp")}</Paragraph>
      </ProfileState>
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
