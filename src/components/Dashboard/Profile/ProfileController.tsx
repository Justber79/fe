import React from "react";
import { AgentProfileController } from "./AgentProfileController";
import { OpportunityProfileController } from "./OpportunityProfileController";
import { EntityType } from "./types";
import { VolunteerProfileController } from "./VolunteerProfileController";
import { ApiResponse } from "@/hooks/api/types";

const CONTROLLER_MAP: Record<EntityType, React.ComponentType<{ entityId: string; secureData?: ApiResponse<never> }>> = {
  volunteer: VolunteerProfileController as React.ComponentType<{ entityId: string; secureData?: ApiResponse<never> }>,
  agent: AgentProfileController as React.ComponentType<{ entityId: string; secureData?: ApiResponse<never> }>,
  opportunity: OpportunityProfileController as React.ComponentType<{
    entityId: string;
    secureData?: ApiResponse<never>;
  }>,
};

type Props<T> = {
  entityId: string;
  entityType: EntityType;
  secureData?: ApiResponse<T> | null;
};

export const ProfileController = <T,>({ entityId, entityType, secureData }: Props<T>) => {
  const EntityController = CONTROLLER_MAP[entityType] as React.ComponentType<{
    entityId: string;
    secureData?: ApiResponse<T> | null;
  }>;

  return <EntityController entityId={entityId} secureData={secureData} />;
};
