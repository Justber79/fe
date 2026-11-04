import { opportunityFieldStackingThreshold } from "@/config/constants";
import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import { formatAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/formatters";
import { EditableField } from "@/components/EditableField/EditableField";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { format } from "date-fns";
import { ApiOpportunityGet, LangPurpose, VolunteerStateTypeType } from "need4deed-sdk";
import { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { formatLanguagesByPurpose } from "./formatters";
import { useApiActivities, useApiSkills } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { toOptionItems } from "@/components/Dashboard/NewOpportunity/helper";
import { DateFieldRow, FieldRow, TagsValue } from "./styles";
import { OpportunityWithDetails } from "./types";
import { dateFromDateTimeUTCStrings, formatToLocalTime } from "@/utils";

type Props = {
  opportunity: ApiOpportunityGet;
};

type OptionTagsProps = {
  titles: string[];
  savedCount: number;
  options: { isLoading: boolean; isError: boolean };
  backgroundColor: ComponentProps<typeof Tags>["backgroundColor"];
};

function OptionTags({ titles, savedCount, options, backgroundColor }: OptionTagsProps) {
  const { t } = useTranslation();
  if (titles.length > 0) return <Tags tags={titles} backgroundColor={backgroundColor} />;
  if (savedCount > 0 && options.isLoading) return <span role="status">{t("dashboard.common.loading")}</span>;
  if (savedCount > 0 && options.isError) return <span role="alert">{t("message.errorGeneric")}</span>;
  return <EmptyPlaceholder />;
}

export function OpportunityDetailsDisplay({ opportunity }: Props) {
  const { t } = useTranslation();
  const opp = opportunity as OpportunityWithDetails;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const isEventType = opp.volunteerType === VolunteerStateTypeType.EVENTS;

  const mainCommunication = formatLanguagesByPurpose(opp.languages, LangPurpose.GENERAL, t);
  const residentsSpeak = formatLanguagesByPurpose(opp.languages, [LangPurpose.RECIPIENT, LangPurpose.TRANSLATION], t);
  const schedule = formatAvailability(opp.availability, t);
  const activityOptions = useApiActivities();
  const skillOptions = useApiSkills();
  const activities = toOptionItems(
    opp.activities.map(({ id }) => String(id)),
    activityOptions.data,
  ).map(({ title }) => title);
  const skills = toOptionItems(
    opp.skills.map(({ id }) => String(id)),
    skillOptions.data,
  ).map(({ title }) => title);

  let eventDate: Date | null = null;

  if (opp.event?.date && opp.event?.time) {
    eventDate = dateFromDateTimeUTCStrings(opp.event.date, opp.event.time);
  }

  return (
    <FormDetails>
      <EditableField
        stackAt={opportunityFieldStackingThreshold}
        mode="display"
        type="text"
        label={t(`${prefix}.opportunityName`)}
        value={opp.title ?? ""}
        setValue={() => {}}
      />

      <EditableField
        stackAt={opportunityFieldStackingThreshold}
        mode="display"
        type="text"
        label={t(`${prefix}.description`)}
        value={opp.description ?? ""}
        setValue={() => {}}
      />

      <EditableField
        stackAt={opportunityFieldStackingThreshold}
        mode="display"
        type="text"
        label={t(`${prefix}.mainCommunication`)}
        value={mainCommunication}
        setValue={() => {}}
      />

      <EditableField
        stackAt={opportunityFieldStackingThreshold}
        mode="display"
        type="text"
        label={t(`${prefix}.residentsSpeak`)}
        value={residentsSpeak}
        setValue={() => {}}
      />

      {isEventType ? (
        <>
          <DateFieldRow data-testid="opportunity-details-event-date">
            <label>{t(`${prefix}.eventDate`)}</label>
            <span>{eventDate ? format(new Date(eventDate), "dd.MM.yyyy") : EMPTY_PLACEHOLDER_VALUE}</span>
          </DateFieldRow>

          <DateFieldRow data-testid="opportunity-details-event-time">
            <label>{t(`${prefix}.eventTime`)}</label>
            <span>{eventDate ? formatToLocalTime(eventDate) : EMPTY_PLACEHOLDER_VALUE}</span>
          </DateFieldRow>
        </>
      ) : (
        <EditableField
          stackAt={opportunityFieldStackingThreshold}
          mode="display"
          type="text"
          label={t(`${prefix}.schedule`)}
          value={schedule}
          setValue={() => {}}
        />
      )}

      <EditableField
        stackAt={opportunityFieldStackingThreshold}
        mode="display"
        type="text"
        label={t(`${prefix}.numberOfVolunteers`)}
        value={opp.numberOfVolunteers ?? ""}
        setValue={() => {}}
      />

      <FieldRow data-testid="opportunity-details-activities">
        <label>{t(`${prefix}.activities`)}</label>
        <TagsValue>
          <OptionTags
            titles={activities}
            savedCount={opp.activities.length}
            options={activityOptions}
            backgroundColor="var(--color-salmon)"
          />
        </TagsValue>
      </FieldRow>

      <FieldRow data-testid="opportunity-details-skills">
        <label>{t(`${prefix}.skills`)}</label>
        <TagsValue>
          <OptionTags
            titles={skills}
            savedCount={opp.skills.length}
            options={skillOptions}
            backgroundColor="var(--color-pink-50)"
          />
        </TagsValue>
      </FieldRow>
    </FormDetails>
  );
}
