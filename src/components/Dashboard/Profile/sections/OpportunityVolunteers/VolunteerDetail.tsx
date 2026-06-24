import { TagsContainer } from "@/components/core/common/Tags";
import { Tag } from "@/components/styled/tags";
import { ActivitySpan } from "@/components/styled/text";
import { CalendarDotsIcon, MapPinIcon, ShootingStarIcon, TranslateIcon, WrenchIcon } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/hooks/useAuth";
import { ApiLanguage, ApiVolunteerOpportunityGet, OpportunityVolunteerStatusType } from "need4deed-sdk";
import { ActivityLog } from "../ActivityLog";
import { StatusAccordionActions } from "../shared/AccordionActions";
import { DetailContainer, SplitContainer } from "../shared/accordionStyles";
import { InfoSection } from "../shared/InfoSection";
import { DetailParagraph } from "./styles";

type Props = {
  volunteer: ApiVolunteerOpportunityGet;
  currentStatus: OpportunityVolunteerStatusType;
  onMatch: () => void;
  onNotAMatch: () => void;
  onMarkAsActive: () => void;
  onMarkAsPast: () => void;
};

const MAX_VISIBLE_TAGS = 3;

function groupLanguages(languages: ApiLanguage[]): [string, string[]][] {
  const grouped = languages.reduce<Record<string, string[]>>((acc, lang) => {
    const key = lang.proficiency ?? "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lang.title);
    return acc;
  }, {});

  return Object.entries(grouped);
}

function LanguagesText({ languages }: { languages: ApiLanguage[] }) {
  const groups = groupLanguages(languages);

  return (
    <DetailParagraph>
      {groups.map(([proficiency, titles], i) => (
        <span key={proficiency}>
          {i > 0 && ", "}
          <strong>{proficiency}</strong>: {titles.join(", ")}
        </span>
      ))}
    </DetailParagraph>
  );
}

function TagsWithOverflow({ tags }: { tags: string[] }) {
  const visible = tags.slice(0, MAX_VISIBLE_TAGS);
  const remaining = tags.length - MAX_VISIBLE_TAGS;

  return (
    <TagsContainer>
      {visible.map((tag) => (
        <Tag key={tag} $backgroundColor="var(--color-salmon)">
          <ActivitySpan color="var(--color-midnight)">{tag}</ActivitySpan>
        </Tag>
      ))}
      {remaining > 0 && (
        <Tag $backgroundColor="var(--color-salmon)">
          <ActivitySpan color="var(--color-midnight)">+{remaining}</ActivitySpan>
        </Tag>
      )}
    </TagsContainer>
  );
}

export default function VolunteerDetail({
  volunteer,
  currentStatus,
  onMatch,
  onNotAMatch,
  onMarkAsActive,
  onMarkAsPast,
}: Props) {
  const { t } = useTranslation();
  const { isAuthorized } = useAuth();
  const { languages, activities, skills, availability, locations } = volunteer;

  const activityTags = activities.map((a) => a.title);
  const skillTags = skills.map((s) => s.title);
  const availabilityText = availability.map((a) => [a.day, a.daytime].filter(Boolean).join(" ")).join(", ") || "–";
  const districtsText = locations.map((l) => l.title).join(", ");

  return (
    <DetailContainer>
      {/* 1. Languages & Activities */}
      <SplitContainer>
        <InfoSection icon={TranslateIcon} title={t("dashboard.volunteers.languages")}>
          <LanguagesText languages={languages} />
        </InfoSection>

        <InfoSection icon={ShootingStarIcon} title={t("dashboard.volunteers.activities")}>
          <TagsWithOverflow tags={activityTags} />
        </InfoSection>
      </SplitContainer>

      {/* 2. Skills & Preferred availability */}
      <SplitContainer>
        <InfoSection icon={WrenchIcon} title={t("dashboard.volunteers.skillsExperience")}>
          <TagsWithOverflow tags={skillTags} />
        </InfoSection>

        <InfoSection icon={CalendarDotsIcon} title={t("dashboard.volunteers.preferredAvailability")}>
          <DetailParagraph>{availabilityText}</DetailParagraph>
        </InfoSection>
      </SplitContainer>

      {/* 3. Preferred districts */}
      <InfoSection icon={MapPinIcon} title={t("dashboard.volunteers.preferredDistricts")}>
        <DetailParagraph>{districtsText}</DetailParagraph>
      </InfoSection>

      {(currentStatus === OpportunityVolunteerStatusType.ACTIVE ||
        currentStatus === OpportunityVolunteerStatusType.PAST) && (
        <ActivityLog
          opportunityVolunteerId={volunteer.id}
          readOnly={!isAuthorized || currentStatus === OpportunityVolunteerStatusType.PAST}
        />
      )}

      {/* 4. Action Buttons */}
      <StatusAccordionActions
        currentStatus={currentStatus}
        onMatch={onMatch}
        onNotAMatch={onNotAMatch}
        onMarkAsActive={onMarkAsActive}
        onMarkAsPast={onMarkAsPast}
      />
    </DetailContainer>
  );
}
