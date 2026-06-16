import { SectionCardProps } from "@/components/Dashboard/Profile/common/SectionCard";
import { AccompanyingDetails } from "@/components/Dashboard/Profile/sections/AccompanyingDetails";
import { Comments } from "@/components/Dashboard/Profile/sections/Comments";
import { ContactDetails } from "@/components/Dashboard/Profile/sections/ContactDetails";
import { OpportunityDetails } from "@/components/Dashboard/Profile/sections/OpportunityDetails";
import { OpportunityVolunteers } from "@/components/Dashboard/Profile/sections/OpportunityVolunteers";
import { SuggestDialog } from "@/components/Dashboard/Profile/sections/OpportunityVolunteers/SuggestDialog";
import { ProfileHeader } from "@/components/Dashboard/Profile/sections/ProfileHeader";
import { RefugeeAccommodationCentre } from "@/components/Dashboard/Profile/sections/RefugeeAccommodationCentre";
import { EditableSectionRef } from "@/components/Dashboard/Profile/sections/shared/types";
import { IconName } from "@/components/Dashboard/Profile/types";
import { useGetVolunteer } from "@/hooks/useGetVolunteer";
import { useSuggestVolunteerOpportunity } from "@/hooks/useSuggestVolunteerOpportunity";
import { ApiOpportunityGet, OpportunityVolunteerStatusType, VolunteerStateTypeType } from "need4deed-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "./useAuth";

export const useOpportunityProfileSections = (opportunity: ApiOpportunityGet | undefined) => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthorized, isOwnProfile } = useAuth(opportunity?.contact.id);
  const hasEditingRights = isAuthorized || isOwnProfile;

  const opportunityContactDetailsRef = useRef<EditableSectionRef>(null);
  const racRef = useRef<EditableSectionRef>(null);
  const accompanyingDetailsRef = useRef<EditableSectionRef>(null);
  const opportunityDetailsRef = useRef<EditableSectionRef>(null);

  const [isOppDetailsEditing, setIsOppDetailsEditing] = useState(false);
  const [isContactEditing, setIsContactEditing] = useState(false);
  const [isRacEditing, setIsRacEditing] = useState(false);
  const [isAccompanyingEditing, setIsAccompanyingEditing] = useState(false);
  const [isSuggestDialogOpen, setIsSuggestDialogOpen] = useState(false);

  const handleOppDetailsEditingChange = useCallback((editing: boolean) => setIsOppDetailsEditing(editing), []);
  const handleContactEditingChange = useCallback((editing: boolean) => setIsContactEditing(editing), []);
  const handleRacEditingChange = useCallback((editing: boolean) => setIsRacEditing(editing), []);
  const handleAccompanyingEditingChange = useCallback((editing: boolean) => setIsAccompanyingEditing(editing), []);

  const volunteerId = searchParams.get("volunteer") ?? undefined;
  const volunteer = useGetVolunteer(volunteerId);

  const { mutate: suggestMutate } = useSuggestVolunteerOpportunity(() => {
    setIsSuggestDialogOpen(false);
    router.push(`/${i18n.language}/dashboard/volunteers/${volunteerId}`);
  }, ["volunteer-opportunities", String(volunteerId)]);

  if (!opportunity) return null;

  const commentsCount = opportunity.comments.length;
  const isAccompanyingType =
    opportunity.volunteerType === VolunteerStateTypeType.ACCOMPANYING ||
    opportunity.volunteerType === VolunteerStateTypeType.REGULAR_ACCOMPANYING;

  const handleSuggestConfirm = () => {
    if (!volunteerId) return;
    suggestMutate({
      opportunityId: Number(opportunity.id),
      volunteerId: Number(volunteerId),
      status: OpportunityVolunteerStatusType.PENDING,
    });
  };

  const sections: SectionCardProps[] = [
    {
      iconName: IconName.Wrench,
      title: t("dashboard.opportunityProfile.opportunityDetails.title"),
      ...(!isOppDetailsEditing &&
        hasEditingRights && {
          headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
          onHeaderButtonClick: () => opportunityDetailsRef.current?.handleEditClick(),
        }),
      subComponent: (
        <OpportunityDetails
          ref={opportunityDetailsRef}
          opportunity={opportunity}
          onEditingChange={handleOppDetailsEditingChange}
        />
      ),
    },
    {
      iconName: IconName.House,
      title: t("dashboard.opportunityProfile.racTitle"),
      ...(!isRacEditing &&
        hasEditingRights && {
          headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
          onHeaderButtonClick: () => racRef.current?.handleEditClick(),
        }),
      subComponent: (
        <RefugeeAccommodationCentre ref={racRef} opportunity={opportunity} onEditingChange={handleRacEditingChange} />
      ),
    },
  ];

  if (hasEditingRights) {
    sections.push(
      {
        iconName: IconName.Users,
        title: t("dashboard.opportunityProfile.accompanyingDetailsTitle"),
        ...(isAccompanyingType &&
          !isAccompanyingEditing && {
            headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
            onHeaderButtonClick: () => accompanyingDetailsRef.current?.handleEditClick?.(),
          }),
        subComponent: (
          <AccompanyingDetails
            ref={accompanyingDetailsRef}
            opportunity={opportunity}
            onEditingChange={handleAccompanyingEditingChange}
          />
        ),
      },
      {
        iconName: IconName.UsersThree,
        title: t("dashboard.opportunityProfile.volunteersSec.title"),
        headerButtonName: volunteerId
          ? t("dashboard.opportunityProfile.volunteersSec.suggestButtonName")
          : t("dashboard.opportunityProfile.volunteersSec.findVolunteers"),
        onHeaderButtonClick: volunteerId
          ? () => setIsSuggestDialogOpen(true)
          : () => router.push(`/${i18n.language}/dashboard/volunteers?opportunity=${opportunity.id}`),
        subComponent: (
          <>
            <OpportunityVolunteers opportunityId={opportunity.id} />
            {isSuggestDialogOpen && (
              <SuggestDialog
                opportunityName={opportunity.title}
                volunteerName={volunteer?.name}
                onCancel={() => setIsSuggestDialogOpen(false)}
                onConfirm={handleSuggestConfirm}
              />
            )}
          </>
        ),
      },
      {
        iconName: IconName.ChatsCircle,
        title: t("dashboard.opportunityProfile.contactDetailsTitle"),
        ...(!isContactEditing && {
          headerButtonName: t("dashboard.opportunityProfile.editButtonName"),
          onHeaderButtonClick: () => opportunityContactDetailsRef.current?.handleEditClick(),
        }),
        subComponent: (
          <ContactDetails
            ref={opportunityContactDetailsRef}
            opportunity={opportunity}
            onEditingChange={handleContactEditingChange}
          />
        ),
      },
    );
  }

  if (isAuthorized) {
    sections.push({
      iconName: IconName.ChatCircleDots,
      title: `${t("dashboard.volunteerProfile.coordinatorComments")} • ${commentsCount}`,
      subComponent: <Comments opportunity={opportunity} />,
    });
  }

  return {
    sections,
    heading: t("dashboard.opportunityProfile.opportunityProfile"),
    header: <ProfileHeader opportunity={opportunity} />,
  };
};
