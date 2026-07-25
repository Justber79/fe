"use client";
import { apiPathVolunteer, cacheTTL, defaultAvatarVolunteerProfile, EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { useGetQuery } from "@/hooks/useGetQuery";
import { formatDateTime, getImageUrl } from "@/utils";
import { CheckCircleIcon } from "@phosphor-icons/react";
import {
  ApiOpportunityVolunteerGet,
  ApiVolunteerGet,
  OpportunityVolunteerStatusType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
} from "need4deed-sdk";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  AvatarContainer,
  createVolunteerTypeLabelMap,
  EditButton,
  HeaderCard,
  isBriefedAccompanying,
  ReturnDateText,
  StatusRowField,
} from "../common";
import { ChangeEngagementStatusDialog } from "./ChangeEngagementStatusDialog";
import { createEngagementLabelMap, createMatchLabelMap } from "./constants";
import { useEngagementStatusDialog } from "./useEngagementStatusDialog";
import { useAuth } from "@/hooks/useAuth";

function deriveMatchStatus(opportunities: ApiOpportunityVolunteerGet[]): VolunteerStateMatchType {
  if (!opportunities.length) return VolunteerStateMatchType.NO_MATCHES;
  const statuses = opportunities.map((o) => o.status);
  if (
    statuses.some((s) => s === OpportunityVolunteerStatusType.MATCHED || s === OpportunityVolunteerStatusType.ACTIVE)
  ) {
    return VolunteerStateMatchType.MATCHED;
  }
  if (statuses.some((s) => s === OpportunityVolunteerStatusType.PENDING)) {
    return VolunteerStateMatchType.PENDING_MATCH;
  }
  if (statuses.some((s) => s === OpportunityVolunteerStatusType.PAST)) {
    // VolunteerStateMatchType.PAST no longer in SDK — fall back to NO_MATCHES
    return VolunteerStateMatchType.NO_MATCHES;
  }
  return VolunteerStateMatchType.NO_MATCHES;
}

type Props = {
  volunteer: ApiVolunteerGet;
};

export const VolunteerHeader = ({ volunteer }: Props) => {
  const { t } = useTranslation();
  const dialog = useEngagementStatusDialog(volunteer);
  const { isAuthorized, isOwnProfile } = useAuth(volunteer.person.id);
  const hasEditingRights = isAuthorized || isOwnProfile;

  const { data: opportunitiesData } = useGetQuery<ApiOpportunityVolunteerGet[]>({
    queryKey: ["volunteer-opportunities", String(volunteer.id)],
    apiPath: `${apiPathVolunteer}/${volunteer.id}/opportunity-linked`,
    staleTime: cacheTTL,
    enabled: !!volunteer.id,
  });

  const matchStatus = deriveMatchStatus(opportunitiesData ?? []);

  const engagementLabelMap = createEngagementLabelMap(t);
  const matchLabelMap = createMatchLabelMap(t);
  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);
  const showBriefedCheck = isBriefedAccompanying(volunteer.statusType, volunteer.statusCommunication);

  const fullName = hasEditingRights
    ? `${volunteer.person.firstName} ${volunteer.person.lastName}`
    : volunteer.person.firstName;
  const avatarUrl = getImageUrl(volunteer.person.avatarUrl || defaultAvatarVolunteerProfile);
  const subtitle = `${t("dashboard.volunteerProfile.volunteerHeader.volunteer_since")} ${formatDateTime(volunteer.createdAt)}`;

  const formatDateReturn = (date: Date | undefined): string =>
    `${t("dashboard.volunteerProfile.volunteerHeader.until")} ${date ? date.toLocaleDateString("de-DE") : EMPTY_PLACEHOLDER_VALUE}`;

  return (
    <HeaderCard
      testId="volunteer-header"
      avatar={
        <AvatarContainer>
          <Image src={avatarUrl} alt={volunteer.person.firstName} fill style={{ objectFit: "cover" }} />
        </AvatarContainer>
      }
      title={fullName}
      subtitle={subtitle}
      after={<ChangeEngagementStatusDialog dialog={dialog} />}
    >
      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.engagementStatus_title")}
        status={dialog.selected}
        label={engagementLabelMap[dialog.selected]}
        extra={
          dialog.selected === VolunteerStateEngagementType.TEMP_UNAVAILABLE && (
            <ReturnDateText>{formatDateReturn(dialog.dateReturn)}</ReturnDateText>
          )
        }
        action={
          isAuthorized && (
            <EditButton onClick={dialog.openDialog}>
              {t("dashboard.volunteerProfile.volunteerHeader.change_status")}
            </EditButton>
          )
        }
      />

      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.matchStatus_title")}
        status={matchStatus}
        label={matchLabelMap[matchStatus]}
      />

      <StatusRowField
        title={t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}
        status={volunteer.statusType}
        label={volunteer.statusType ? volunteerTypeLabelMap[volunteer.statusType] : undefined}
        extra={
          showBriefedCheck ? <CheckCircleIcon size={20} color="var(--color-green-700)" weight="fill" /> : undefined
        }
      />
    </HeaderCard>
  );
};
