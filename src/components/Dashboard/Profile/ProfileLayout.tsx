"use client";
import { DashboardLayout } from "@/components/Layout";
import { ProfileController } from "./ProfileController";
import { EntityType } from "./types/types";
import { ApiResponse } from "@/hooks/api/types";

interface ProfileLayoutProps<T> {
  entityId: string;
  entityType: EntityType;
  secureData?: ApiResponse<T> | null;
}

export default function ProfileLayout<T>({ entityId, entityType, secureData }: ProfileLayoutProps<T>) {
  const backgroundColor = "var(--layout-static-page-background-default)";
  return (
    <DashboardLayout background={backgroundColor}>
      <ProfileController entityId={entityId} entityType={entityType} secureData={secureData} />
    </DashboardLayout>
  );
}
