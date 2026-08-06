import React from "react";
import { AgentProfileController } from "./AgentProfileController";
import { OpportunityProfileController } from "./OpportunityProfileController";
import { EntityType, ProfileNavigationDirection } from "./types";
import { VolunteerProfileController } from "./VolunteerProfileController";

const CONTROLLER_MAP: Record<
  EntityType,
  React.ComponentType<{ entityId: string; handleProfileNavigation?: (direction: ProfileNavigationDirection) => void }>
> = {
  volunteer: VolunteerProfileController,
  agent: AgentProfileController,
  opportunity: OpportunityProfileController,
};

type Props = {
  entityId: string;
  entityType: EntityType;
  handleProfileNavigation?: (direction: ProfileNavigationDirection) => void;
};

export const ProfileController = ({ entityId, entityType, handleProfileNavigation }: Props) => {
  const EntityController = CONTROLLER_MAP[entityType];
  return <EntityController entityId={entityId} handleProfileNavigation={handleProfileNavigation} />;
};
