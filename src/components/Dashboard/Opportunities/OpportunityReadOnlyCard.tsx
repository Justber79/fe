import { ApiVolunteerOpportunityGetList, LangPurpose, OptionItem, ProfileVolunteeringType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { Paragraph } from "@/components/styled/text";
import CardDetail from "../Volunteers/CardDetail";
import { CardParagraph } from "../Volunteers/VolunteerCard";
import { IconName } from "../Volunteers/icon";
import { matchStatusColorMap, matchStatusIconMap, volunteerTypeIconMap } from "./OpportunityCard.helpers";
import { Card, LanguageRow, StatusDiv, StatusTagsDiv, TagDiv, TitleParagraph } from "./styles";
import { getLanguagesByPurpose } from "./helpers";
import Link from "next/link";

type Props = {
  opportunity: ApiVolunteerOpportunityGetList;
  volunteerId?: string;
  activitiesList?: OptionItem[];
  districtsList?: OptionItem[];
};

export function OpportunityReadOnlyCard({ opportunity, districtsList }: Props) {
  const { t, i18n } = useTranslation();

  const { id, title, volunteerType, location, languages, statusMatch } =
    opportunity as ApiVolunteerOpportunityGetList & {
      accompanyingDetails?: { appointmentDate?: string; appointmentTime?: string };
      statusMatch?: string;
      district?: { id: number };
    };

  const mainCommunication = getLanguagesByPurpose(languages, LangPurpose.GENERAL);
  const recipientLanguage = getLanguagesByPurpose(languages, LangPurpose.RECIPIENT);

  const districtTitle = location[0]?.id ? (districtsList?.find((d) => d.id === location[0].id)?.title ?? null) : null;

  const profileUrl = id ? `/${i18n.language}/dashboard/opportunities/${id}` : "";

  return (
    <Card as={Link} data-testid="opportunity-card" href={profileUrl}>
      <StatusTagsDiv>
        {statusMatch && (
          <StatusDiv>
            {matchStatusIconMap[statusMatch as import("./OpportunityCard.helpers").OpportunityMatchStatusType]}
            <Paragraph
              fontWeight="var(--dashboard-volunteers-card-status-fontWeight)"
              fontSize="var(--dashboard-volunteers-card-status-fontSize)"
              lineheight="var(--dashboard-volunteers-card-status-lineHeight)"
              color={matchStatusColorMap[statusMatch as import("./OpportunityCard.helpers").OpportunityMatchStatusType]}
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

      <CardDetail header={t("dashboard.opportunities.district")} iconName={IconName.MapPin}>
        {districtTitle && <CardParagraph text={districtTitle} />}
      </CardDetail>
    </Card>
  );
}
