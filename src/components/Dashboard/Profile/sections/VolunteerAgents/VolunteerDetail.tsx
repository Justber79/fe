import { CalendarDotsIcon, MapPinIcon, ShootingStarIcon, TranslateIcon } from "@phosphor-icons/react";
import { OpportunityVolunteerStatusType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";

import { Tags } from "@/components/core/common";
import { Paragraph } from "@/components/styled/text";

import { StatusAccordionActions } from "../shared/AccordionActions";
import { DetailContainer, SplitContainer } from "../shared/accordionStyles";
import { InfoSection } from "../shared/InfoSection";
import { LanguageRow, LanguagesList } from "./styles";
import { MappedVolunteerAgent } from "./types";

type Props = {
  volunteer: MappedVolunteerAgent;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

export const VolunteerDetail = ({
  volunteer,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) => {
  const { t } = useTranslation();

  const { languages, locations, activities, availability, skills } = volunteer;

  const languagesText = languages.map((lan) => lan.title).join(", ");
  const district = locations.map((loc) => loc.title).join(", ");
  const activity = activities.map((act) => act.title);
  const skill = skills.map((s) => s.title);

  return (
    <DetailContainer>
      <SplitContainer>
        <InfoSection icon={TranslateIcon} title={t("dashboard.volunteerProfile.profileSection.languages")}>
          <LanguagesList>
            <LanguageRow>
              <Paragraph
                $textWrap="nowrap"
                fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-bold-font)"
              >
                {t("dashboard.opportunities.residentsSpeak")}:
              </Paragraph>
              <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
                {languagesText}
              </Paragraph>
            </LanguageRow>
          </LanguagesList>
        </InfoSection>

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteerProfile.profileSection.activities")}>
          <Tags tags={activity} />
        </InfoSection>

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteerProfile.profileSection.skills")}>
          <Tags tags={skill} />
        </InfoSection>
      </SplitContainer>

      <SplitContainer>
        <InfoSection icon={MapPinIcon} title={t("dashboard.volunteerProfile.profileSection.districts")}>
          <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
            {district}
          </Paragraph>
        </InfoSection>

        <InfoSection icon={CalendarDotsIcon} title={t("dashboard.volunteerProfile.profileSection.availability")}>
          <Paragraph fontWeight="var(--volunteer-profile-opportunities-accordion-opp-detail-light-font)">
            {availability?.map(
              (date) => `${t(`dashboard.volunteers.filters.preferredAv.days.${[date.day]}`)} ${date.daytime}`,
            )}
          </Paragraph>
        </InfoSection>
      </SplitContainer>

      <StatusAccordionActions
        currentStatus={currentStatus}
        onMatch={onMatch}
        onNotAMatch={onNotAMatch}
        onMarkAsActive={onMarkAsActive}
        onMarkAsPast={onMarkAsPast}
      />
    </DetailContainer>
  );
};
