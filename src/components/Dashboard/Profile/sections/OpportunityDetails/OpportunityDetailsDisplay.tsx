import { EmptyPlaceholder } from "@/components/core/common/EmptyPlaceholder";
import { Tags } from "@/components/core/common/Tags";
import { formatAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/formatters";
import { EditableField } from "@/components/EditableField/EditableField";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { format } from "date-fns";
import { ApiOpportunityGet, Lang, LangPurpose, VolunteerStateTypeType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { extractOptionTitles, formatLanguagesByPurpose } from "./formatters";
import { DateFieldRow, FieldRow, TagsValue } from "./styles";
import { OpportunityWithDetails } from "./types";
import { dateFromDateTimeUTCStrings, formatToLocalTime } from "@/utils";

type Props = {
  opportunity: ApiOpportunityGet;
};

export function OpportunityDetailsDisplay({ opportunity }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language as Lang;
  const opp = opportunity as OpportunityWithDetails;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const isEventType = opp.volunteerType === VolunteerStateTypeType.EVENTS;

  const mainCommunication = formatLanguagesByPurpose(opp.languages, LangPurpose.GENERAL, t);
  const residentsSpeak = formatLanguagesByPurpose(opp.languages, [LangPurpose.RECIPIENT, LangPurpose.TRANSLATION], t);
  const schedule = formatAvailability(opp.availability, t);
  const activities = extractOptionTitles(opp.activities, lang);
  const skills = extractOptionTitles(opp.skills, lang);

  let eventDate: Date | null = null;

  if (opp.event?.date && opp.event?.time) {
    eventDate = dateFromDateTimeUTCStrings(opp.event.date, opp.event.time);
  }

  return (
    <FormDetails>
      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.opportunityName`)}
        value={opp.title ?? ""}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.description`)}
        value={opp.description ?? ""}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.mainCommunication`)}
        value={mainCommunication}
        setValue={() => {}}
      />

      <EditableField
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
          mode="display"
          type="text"
          label={t(`${prefix}.schedule`)}
          value={schedule}
          setValue={() => {}}
        />
      )}

      <EditableField
        mode="display"
        type="text"
        label={t(`${prefix}.numberOfVolunteers`)}
        value={opp.numberOfVolunteers ?? ""}
        setValue={() => {}}
      />

      <FieldRow data-testid="opportunity-details-activities">
        <label>{t(`${prefix}.activities`)}</label>
        <TagsValue>
          {activities.length > 0 ? (
            <Tags tags={activities} backgroundColor="var(--color-salmon)" />
          ) : (
            <EmptyPlaceholder />
          )}
        </TagsValue>
      </FieldRow>

      <FieldRow data-testid="opportunity-details-skills">
        <label>{t(`${prefix}.skills`)}</label>
        <TagsValue>
          {skills.length > 0 ? <Tags tags={skills} backgroundColor="var(--color-pink-50)" /> : <EmptyPlaceholder />}
        </TagsValue>
      </FieldRow>
    </FormDetails>
  );
}
