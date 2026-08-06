"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";
import { EntityType, ProfileNavigationDirection } from "./types/types";

interface ProfileLayoutProps {
  entityId: string;
  entityType: EntityType;
  handleProfileNavigation?: (direction: ProfileNavigationDirection) => void;
}

export default function ProfileLayout({ entityId, entityType, handleProfileNavigation }: ProfileLayoutProps) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <ProfileController
        entityId={entityId}
        entityType={entityType}
        handleProfileNavigation={handleProfileNavigation}
      />
    </DashboardLayout>
  );
}
