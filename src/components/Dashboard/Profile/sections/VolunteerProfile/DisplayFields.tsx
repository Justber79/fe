import { CheckCircleIcon } from "@phosphor-icons/react";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import styled from "styled-components";
import { StatusValue } from "../../common/statusMaps";
import { ProfileStatusBadge } from "../ProfileHeader/common/ProfileStatusBadge";

const FieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
  gap: var(--spacing-32);
  padding: var(--profile-section-field-row-padding);
  border-bottom: none;

  &:last-child {
    border-bottom: none;
  }
`;

const FieldLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--color-midnight);
  width: 220px;
  flex-shrink: 0;
`;

const FieldValue = styled.div`
  font-size: 20px;
  color: var(--color-midnight);
  flex: 1;
  line-height: 1.5;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-8);
`;

const BadgeWithCheck = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-8);
`;

type Props = {
  languages: string;
  availability: string;
  districts: string;
  volunteerType: string;
  volunteerTypeStatus: StatusValue | undefined;
  showBriefedCheck?: boolean;
  activities: string[];
  skills: string[];
  comments: string | undefined;
  t: (key: string) => string;
};

export function DisplayFields({
  languages,
  availability,
  districts,
  volunteerType,
  volunteerTypeStatus,
  showBriefedCheck,
  activities,
  skills,
  comments,
  t,
}: Props) {
  return (
    <>
      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.languages")}</FieldLabel>
        <FieldValue>{languages}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.availability")}</FieldLabel>
        <FieldValue>{availability}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.districts")}</FieldLabel>
        <FieldValue>{districts}</FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.volunteerType")}</FieldLabel>
        <FieldValue>
          {volunteerType && volunteerTypeStatus ? (
            <BadgeWithCheck>
              <ProfileStatusBadge status={volunteerTypeStatus} label={volunteerType} />
              {showBriefedCheck && <CheckCircleIcon size={20} color="var(--color-green-700)" weight="fill" />}
            </BadgeWithCheck>
          ) : (
            <EmptyPlaceholder />
          )}
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.activities")}</FieldLabel>
        <FieldValue>
          {activities.length > 0 ? (
            <TagsWrapper>
              <Tags tags={activities} backgroundColor="var(--color-salmon)" />
            </TagsWrapper>
          ) : (
            <EmptyPlaceholder />
          )}
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.skills")}</FieldLabel>
        <FieldValue>
          {skills.length > 0 ? (
            <TagsWrapper>
              <Tags tags={skills} backgroundColor="var(--color-pink-50)" />
            </TagsWrapper>
          ) : (
            <EmptyPlaceholder />
          )}
        </FieldValue>
      </FieldRow>

      <FieldRow>
        <FieldLabel>{t("dashboard.volunteerProfile.profileSection.comments")}</FieldLabel>
        <FieldValue>{comments || <EmptyPlaceholder />}</FieldValue>
      </FieldRow>
    </>
  );
}
