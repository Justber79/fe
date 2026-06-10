import React from "react";
import { AgentProfileController } from "./AgentProfileController";
import { OpportunityProfileController } from "./OpportunityProfileController";
import { EntityType } from "./types";
import { VolunteerProfileController } from "./VolunteerProfileController";

const CONTROLLER_MAP: Record<EntityType, React.ComponentType<{ entityId: string }>> = {
  volunteer: VolunteerProfileController,
  agent: AgentProfileController,
  opportunity: OpportunityProfileController,
};

type Props = {
  entityId: string;
  entityType: EntityType;
};

export const ProfileController = ({ entityId, entityType }: Props) => {
  const EntityController = CONTROLLER_MAP[entityType] as React.ComponentType<{
    entityId: string;
  }>;

  return <EntityController entityId={entityId} />;
};
