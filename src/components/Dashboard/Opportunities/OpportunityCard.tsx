import { ApiVolunteerOpportunityGetList, LangPurpose, OptionItem, ProfileVolunteeringType } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Tags } from "@/components/core/common";
import { Paragraph } from "@/components/styled/text";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { IconName } from "../Volunteers/icon";
import { getActivityTitles, getLanguagesByPurpose } from "./helpers";
import {
  formatAccompanyingDate,
  formatAvailability,
  matchStatusColorMap,
  matchStatusIconMap,
  statusColorMap,
  statusIconMap,
  volunteerTypeIconMap,
} from "./OpportunityCard.helpers";
import { Card, LanguageRow, StatusDiv, StatusTagsDiv, TagDiv, TitleParagraph } from "./styles";

type Props = {
  opportunity: ApiVolunteerOpportunityGetList;
  volunteerId?: string;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
};

export function OpportunityCard({ opportunity, volunteerId, activitiesList, districtsList }: Props) {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  const {
    id,
    title,
    volunteerType,
    statusOpportunity,
    languages,
    activities,
    availability,
    accompanyingDetails,
    statusMatch,
    district,
  } = opportunity as ApiVolunteerOpportunityGetList & {
    accompanyingDetails?: { appointmentDate?: string; appointmentTime?: string };
    statusMatch?: string;
    district?: { id: number };
  };

  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const recipientLanguage = getLanguagesByPurpose(languages, LangPurpose.RECIPIENT);
  const activityTitles = getActivityTitles(activities, activitiesList);
  const districtTitle = district?.id
    ? (districtsList?.find((d) => d.id === district.id)?.title ?? null)
    : null;

  const isAccompanying = volunteerType === ProfileVolunteeringType.ACCOMPANYING;
  const scheduleText = isAccompanying
    ? formatAccompanyingDate(accompanyingDetails)
    : availability?.length > 0
      ? formatAvailability(availability)
      : null;

  const handleCardClick = () => {
    if (!id) return;
    const params = volunteerId ? `?volunteer=${volunteerId}` : "";
    router.push(`/${i18n.language}/dashboard/opportunities/${id}${params}`);
  };

  return (
    <Card onClick={handleCardClick} data-testid="opportunity-card">
      <StatusTagsDiv>
        {statusOpportunity && (
          <StatusDiv>
            {statusIconMap[statusOpportunity]}
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-status-fontSize)"
              lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
              color={statusColorMap[statusOpportunity]}
            >
              {t(`dashboard.opportunities.status.${statusOpportunity}`)}
            </Paragraph>
          </StatusDiv>
        )}
        {statusMatch && (
          <StatusDiv>
            {matchStatusIconMap[statusMatch]}
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-status-fontSize)"
              lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
              color={matchStatusColorMap[statusMatch]}
            >
              {t(`dashboard.opportunities.matchStatus.${statusMatch}`)}
            </Paragraph>
          </StatusDiv>
        )}
        {volunteerType && (
          <TagDiv>
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-tag-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-status-fontSize)"
              lineheight="var(--dashboard-volunteers-card-tag-lineHeight)"
            >
              {t(`dashboard.opportunities.type.${volunteerType}`)}
            </Paragraph>
            {volunteerTypeIconMap[volunteerType as ProfileVolunteeringType]}
          </TagDiv>
        )}
      </StatusTagsDiv>

      <TitleParagraph>{title}</TitleParagraph>

      <CardDetail header={t("dashboard.volunteers.languages")} iconName={IconName.Translate}>
        {mainCommunication && (
          <LanguageRow>
            <CardParagraph text={`${t("dashboard.opportunities.card.mainCommunication")}:`} isBold />
            <CardParagraph text={mainCommunication} />
          </LanguageRow>
        )}
        {recipientLanguage && (
          <LanguageRow>
            <CardParagraph text={`${t("dashboard.opportunities.card.residentsSpeak")}:`} isBold />
            <CardParagraph text={recipientLanguage} />
          </LanguageRow>
        )}
      </CardDetail>

      {activityTitles.length > 0 && (
        <CardDetail header={t("dashboard.volunteers.activities")} iconName={IconName.ShootingStar}>
          <Tags tags={activityTitles} />
        </CardDetail>
      )}

      <CardDetail header={t("dashboard.opportunities.dateOfAppointment")} iconName={IconName.CalendarDots}>
        {scheduleText && <CardParagraph text={scheduleText} />}
      </CardDetail>

      <CardDetail header={t("dashboard.opportunities.district")} iconName={IconName.MapPin}>
        {districtTitle && <CardParagraph text={districtTitle} />}
      </CardDetail>
    </Card>
  );
}
