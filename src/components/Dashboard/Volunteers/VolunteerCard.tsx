import { CheckCircleIcon, CheckIcon, FlagIcon, HourglassIcon, SealCheckIcon, SparkleIcon } from "@phosphor-icons/react";
import {
  ApiVolunteerGetList,
  VolunteerStateCommunicationType,
  VolunteerStateEngagementType,
  VolunteerStateMatchType,
  VolunteerStateTypeType,
} from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import { Tags } from "@/components/core/common";
import { BaseCard } from "@/components/styled/container";
import { CirclePic } from "@/components/styled/img";
import { Paragraph } from "@/components/styled/text";
import { defaultAvatarURL } from "@/config/constants";
import { getImageUrl } from "@/utils";
import { isBriefedAccompanying } from "../Profile/sections/ProfileHeader/common";
import { formatAvailabilityItem } from "../Profile/sections/VolunteerProfile/formatters";
import CardDetail from "./CardDetail";
import { getNormalizedVolunteer, groupLanguagesByProficiency } from "./helpers";
import { IconName } from "./icon";

interface Props {
  volunteer: ApiVolunteerGetList;
  opportunityId?: string;
}

export function VolunteerCard({ volunteer, opportunityId }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const { id, name, languages, activities, skills, locations, availability, avatarUrl, statusEngagement, statusType } =
    getNormalizedVolunteer(volunteer);

  // Cast until SDK PR #99 adds statusCommunication and statusMatch to ApiVolunteerGetList
  const { statusCommunication, statusMatch } = volunteer as ApiVolunteerGetList & {
    statusCommunication?: VolunteerStateCommunicationType;
    statusMatch?: VolunteerStateMatchType;
  };

  const showBriefedCheck = isBriefedAccompanying(statusType as VolunteerStateTypeType, statusCommunication);

  const groupedLanguages = groupLanguagesByProficiency(languages);

  const availabilities = availability
    .filter((a): a is typeof a & { day: string; daytime: string } => Boolean(a.day && a.daytime))
    .map((a) => formatAvailabilityItem(a.day, a.daytime, t));

  const handleCardClick = () => {
    if (!id) return;

    const params = opportunityId ? `?opportunity=${opportunityId}` : "";
    router.push(`/${i18n.language}/dashboard/volunteers/${id}${params}`);
  };

  return (
    <Card onClick={handleCardClick}>
      <StatusTagsDiv>
        <>
          {statusEngagement && (
            <StatusDiv>
              {stateEngagementIconMap[statusEngagement]}

              <Paragraph
                fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
                fontSize="var(--dashboard-volunteers-card-status-fontSize)"
                lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
                color={stateEngagementColorMap[statusEngagement]}
              >
                {statusEngagement.toUpperCase()}
              </Paragraph>
            </StatusDiv>
          )}

          {statusType && (
            <>
              <TagDiv>
                <Paragraph
                  fontWeight="var(--dashboard-volunteers-card-tag-fontWeight)"
                  fontSize="var(--dashboard-volunteers-card-status-fontSize)"
                  lineheight="var(--dashboard-volunteers-card-tag-lineHeight)"
                >
                  {statusType.toUpperCase()}
                </Paragraph>
                <SparkleIcon size={18} color="var(--color-midnight)" />
                {showBriefedCheck && <CheckCircleIcon size={18} color="var(--color-green-700)" weight="fill" />}
              </TagDiv>
            </>
          )}

          {statusMatch && (
            <StatusDiv>
              <Paragraph
                fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
                fontSize="var(--dashboard-volunteers-card-status-fontSize)"
                lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
                color={stateMatchColorMap[statusMatch]}
              >
                {t(`dashboard.volunteers.matchStatus.${statusMatch}`)}
              </Paragraph>
            </StatusDiv>
          )}
        </>
      </StatusTagsDiv>

      <ProfileDiv>
        <CirclePic src={getImageUrl(avatarUrl || defaultAvatarURL)} size="64px" />
        <Paragraph
          fontWeight="var(--dashboard-volunteers-card-profile-fontWeight)"
          fontSize="var(--dashboard-volunteers-card-profile-fontSize)"
          lineheight="var(--dashboard-volunteers-card-profile-lineHeight)"
        >
          {name}
        </Paragraph>
      </ProfileDiv>

      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        {groupedLanguages.map(({ proficiency, list }) => (
          <LanguageDetailContainer key={proficiency}>
            <CardParagraph text={`${t(`dashboard.volunteers.langProficiency.${proficiency}`)}:`} isBold />
            <CardParagraph text={`${list.join(", ")}`} />
          </LanguageDetailContainer>
        ))}
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.activities")} iconName={IconName.ShootingStar}>
        <Tags tags={activities as unknown as string[]} />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.skillsExperience")} iconName={IconName.Wrench}>
        <Tags
          tags={skills as unknown as string[]}
          backgroundColor="var(--color-white)"
          icon={<CheckIcon size={18} />}
        />
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.preferredAvailability")} iconName={IconName.CalendarDots}>
        {availabilities.map((a) => (
          <LanguageDetailContainer key={a}>
            <CardParagraph text={a} />
          </LanguageDetailContainer>
        ))}
      </CardDetail>

      <CardDetail header={t("dashboard.volunteers.preferredDistricts")} iconName={IconName.MapPin}>
        <CardParagraph text={locations.join(", ")} />
      </CardDetail>
    </Card>
  );
}

export default VolunteerCard;

/* Helper maps */

const stateMatchColorMap: Record<VolunteerStateMatchType, string> = {
  [VolunteerStateMatchType.NO_MATCHES]: "var(--color-grey-700)",
  [VolunteerStateMatchType.PENDING_MATCH]: "var(--color-blue-700)",
  [VolunteerStateMatchType.MATCHED]: "var(--color-green-700)",
  [VolunteerStateMatchType.NEEDS_REMATCH]: "var(--color-red-700)",
  [VolunteerStateMatchType.PAST]: "var(--color-grey-500)",
};

const stateEngagementColorMap: Record<VolunteerStateEngagementType, string> = {
  [VolunteerStateEngagementType.NEW]: "var(--color-red-500)",
  [VolunteerStateEngagementType.ACTIVE]: "var(--color-green-700)",
  [VolunteerStateEngagementType.AVAILABLE]: "var(--color-green-700)",
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: "var(--color-red-700)",
  [VolunteerStateEngagementType.INACTIVE]: "var(--color-grey-700)",
  [VolunteerStateEngagementType.UNRESPONSIVE]: "var(--color-500-200)",
};

const stateEngagementIconMap: Record<VolunteerStateEngagementType, JSX.Element> = {
  [VolunteerStateEngagementType.NEW]: (
    <HourglassIcon size={18} color={stateEngagementColorMap[VolunteerStateEngagementType.NEW]} />
  ),
  [VolunteerStateEngagementType.ACTIVE]: (
    <SealCheckIcon size={18} color={stateEngagementColorMap[VolunteerStateEngagementType.ACTIVE]} />
  ),
  [VolunteerStateEngagementType.TEMP_UNAVAILABLE]: (
    <FlagIcon size={18} color={stateEngagementColorMap[VolunteerStateEngagementType.TEMP_UNAVAILABLE]} />
  ),
  [VolunteerStateEngagementType.AVAILABLE]: (
    <HourglassIcon size={18} color={stateEngagementColorMap[VolunteerStateEngagementType.AVAILABLE]} />
  ),
  [VolunteerStateEngagementType.INACTIVE]: (
    <FlagIcon size={18} color={stateEngagementColorMap[VolunteerStateEngagementType.INACTIVE]} />
  ),
  [VolunteerStateEngagementType.UNRESPONSIVE]: (
    <FlagIcon size={18} color={stateEngagementColorMap[VolunteerStateEngagementType.INACTIVE]} />
  ),
};

/*  Helper components */
interface CardParagraphProps {
  text: string;
  isBold?: boolean;
}

export const CardParagraph = ({ text, isBold }: CardParagraphProps) => (
  <Paragraph
    fontWeight={`var(--dashboard-volunteers-card-paragraph-fontWeight${isBold ? "-bold" : ""})`}
    fontSize="var(--dashboard-volunteers-card-paragraph-fontSize)"
    lineheight="var(--dashboard-volunteers-card-paragraph-lineHeight)"
  >
    {text}
  </Paragraph>
);

/*  Styles */

const Card = styled(BaseCard)`
  background-color: var(--color-orchid-subtle);
  width: var(--dashboard-volunteers-card-width);
  height: var(--dashboard-volunteers-card-height);
  gap: var(--dashboard-volunteers-card-gap);
  padding: var(--dashboard-volunteers-card-padding);
  transition:
    transform 0.3s ease-in-out,
    box-shadow 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: var(--color-orchid);
  }
`;

const StatusTagsDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-status-tags-div-gap);
  margin-top: var(--dashboard-volunteers-card-status-tags-div-margin-top);
`;

const StatusDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-white);
  height: var(--dashboard-volunteers-card-status-div-height);
  border-bottom-left-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  border-bottom-right-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  gap: var(--dashboard-volunteers-card-status-div-gap);
  padding: var(--dashboard-volunteers-card-status-div-padding);
`;

const TagDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: var(--color-green-200);
  height: var(--dashboard-volunteers-card-status-div-height);
  border-bottom-left-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  border-bottom-right-radius: var(--dashboard-volunteers-card-status-div-bordor-bottom);
  padding: var(--dashboard-volunteers-card-tag-div-padding);
  gap: var(--dashboard-volunteers-card-tag-div-gap);
`;

const ProfileDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--dashboard-volunteers-card-profile-div-gap);
`;

const LanguageDetailContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: var(--dashboard-volunteers-card-detail-gap);
`;
