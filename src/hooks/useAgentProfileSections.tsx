import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { AgentOpportunities } from "@/components/Dashboard/Profile/sections/AgentOpportunities";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import {
  CommunicationTracker,
  CommunicationTrackerRef,
} from "@/components/Dashboard/Profile/sections/CommunicationTracker";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { OrganisationDetails } from "@/components/Dashboard/Profile/sections/OrganisationDetails";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import { VolunteerAgents } from "@/components/Dashboard/Profile/sections/VolunteerAgents/VolunteerAgents";
import { ApiAgentProfileGet, IconName } from "@/components/Dashboard/Profile/types";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./useAuth";

export const useAgentProfileSections = (agent: ApiAgentProfileGet | undefined) => {
  const { t } = useTranslation();
  const { isAuthorized: isAdminOrCoordinator, isOwnProfile } = useAuth(agent?.representative?.id);
  const hasEditingRights = isAdminOrCoordinator || isOwnProfile;

  const contactDetailsRef = useRef<EditableSectionRef>(null);
  const organisationDetailsRef = useRef<EditableSectionRef>(null);
  const communicationTrackerRef = useRef<CommunicationTrackerRef>(null);

  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isOrgEditing, setIsOrgEditing] = useState(false);

  const handleContactEditingChange = useCallback((editing: boolean) => setIsContactEditing(editing), []);
  const handleOrgEditingChange = useCallback((editing: boolean) => setIsOrgEditing(editing), []);

  if (!agent) return null;

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.ChatsCircle,
      title: t("dashboard.agentProfile.contactDetails.title"),
      ...(!isContactEditing &&
        hasEditingRights && {
          headerButtonName: t("dashboard.agentProfile.contactDetails.edit"),
          onHeaderButtonClick: () => contactDetailsRef.current?.handleEditClick(),
        }),
      subComponent: (
        <ContactDetails ref={contactDetailsRef} agent={agent} onEditingChange={handleContactEditingChange} />
      ),
    },
    {
      iconName: IconName.UsersThree,
      title: t("dashboard.agentProfile.organisationDetails.title"),
      ...(!isOrgEditing &&
        hasEditingRights && {
          headerButtonName: t("dashboard.agentProfile.organisationDetails.edit"),
          onHeaderButtonClick: () => organisationDetailsRef.current?.handleEditClick(),
        }),
      subComponent: (
        <OrganisationDetails ref={organisationDetailsRef} agent={agent} onEditingChange={handleOrgEditingChange} />
      ),
    },
    {
      iconName: IconName.UserCheck,
      title: t("dashboard.volunteers.volunteers"),
      subComponent: <VolunteerAgents />,
    },
    {
      iconName: IconName.ShootingStar,
      title: t("dashboard.volunteerProfile.opportunities"),
      ...(hasEditingRights && {
        headerButtonName: t("dashboard.agentProfile.opportunitiesSec.postOpportunity"),
      }),
      subComponent: <AgentOpportunities agentId={agent.id} />,
    },
    {
      iconName: IconName.ChatsTeardrop,
      title: t("dashboard.communicationSection.title"),
      ...(hasEditingRights && {
        headerButtonName: t("dashboard.communicationSection.addNew"),
        onHeaderButtonClick: () => communicationTrackerRef.current?.handleAddNew(),
      }),
      subComponent: <CommunicationTracker ref={communicationTrackerRef} entityId={agent.id} entityType="agent" />,
    },
  ];

  const adminOrCoordinatorSections: SectionCardProps[] = [
    ...sections,
    {
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${agent.comments?.length ?? 0}`,
      subComponent: <Comments agent={agent} />,
    },
  ];

  return {
    sections: isAdminOrCoordinator ? adminOrCoordinatorSections : sections,
    heading: t("dashboard.agentProfile.agentProfile"),
    header: <ProfileHeader agent={agent} />,
  };
};
