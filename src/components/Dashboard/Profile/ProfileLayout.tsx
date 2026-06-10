"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";
import { EntityType } from "./types/types";

interface ProfileLayoutProps {
  entityId: string;
  entityType: EntityType;
}

export default function ProfileLayout({ entityId, entityType }: ProfileLayoutProps) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <ProfileController entityId={entityId} entityType={entityType} />
    </DashboardLayout>
  );
}
