import Button from "@/components/core/button/Button/Button";
import { ErrorMessage } from "@/components/core/common";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { EditableField } from "@/components/EditableField/EditableField";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import {
  apiToFormAvailability,
  formToApiAvailability,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/availabilityUtils";
import {
  ApiLanguageOption,
  useApiActivities,
  useApiLanguages,
  useApiSkills,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { useUpdateOpportunityDetails } from "@/hooks/useUpdateOpportunityDetails";
import { zodResolver } from "@hookform/resolvers/zod";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { de, enUS } from "date-fns/locale";
import { TFunction } from "i18next";
import { ApiOpportunityGet, Lang, LangPurpose, OptionItem, VolunteerStateTypeType } from "need4deed-sdk";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../shared/styles";
import { languagesToFormValues } from "./formatters";
import { createOpportunityDetailsSchema, OpportunityDetailsFormData } from "./opportunityDetailsSchema";
import { DateFieldRow, DatePickerContainer, ErrorText, FieldGroup, TimeInput, TimeInputWrapper } from "./styles";
import { OpportunityWithDetails } from "./types";

function toLangOptionItems(
  formLangs: { language: string }[],
  apiLanguages: ApiLanguageOption[],
  t: TFunction,
): OptionItem[] {
  return formLangs.flatMap(({ language }) => {
    if (!language) return [];
    // LanguageFieldRow stores the ID as a string when the user picks from the dropdown
    const numId = Number(language);
    if (!isNaN(numId) && numId > 0) {
      const found = apiLanguages.find((a) => a.id === numId);
      return found ? [{ id: found.id, title: found.title }] : [];
    }
    // languagesToFormValues stores translated names on initial load; reverse the lookup
    const found = apiLanguages.find((a) => {
      if (a.title === language || a.title.toLowerCase() === language.toLowerCase()) return true;
      const key = `languageNames.${a.title.toLowerCase()}`;
      const translated = t(key);
      return translated !== key && translated === language;
    });
    return found ? [{ id: found.id, title: found.title }] : [];
  });
}

function toOptionItems(ids: string[], apiItems: ApiLanguageOption[]): OptionItem[] {
  const map = new Map(apiItems.map((i) => [i.id, i.title]));
  return ids.flatMap((id) => {
    const numId = Number(id);
    const title = map.get(numId);
    return title ? [{ id: numId, title }] : [];
  });
}

type Props = {
  opportunity: ApiOpportunityGet;
  onCancel: () => void;
};

export function OpportunityDetailsEdit({ opportunity, onCancel }: Props) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const opp = opportunity as OpportunityWithDetails;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const isEventType = opp.volunteerType === VolunteerStateTypeType.EVENTS;

  const { mutate: updateOpportunityDetails } = useUpdateOpportunityDetails(opp.id);
  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  const activityMapping = createMapping(apiActivities);
  const skillMapping = createMapping(apiSkills);
  const languagesForForm = apiLanguages.map((l) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  }));

  const generalLangs = opp.languages.filter((l) => l.purpose === LangPurpose.GENERAL);
  const recipientLangs = opp.languages.filter((l) => l.purpose === LangPurpose.RECIPIENT);

  const schema = createOpportunityDetailsSchema(t);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<OpportunityDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      description: opp.description ?? "",
      numberOfVolunteers: String(opp.numberOfVolunteers ?? ""),
      mainCommunication: languagesToFormValues(generalLangs, t),
      residentsSpeak: languagesToFormValues(recipientLangs, t),
      availability: isEventType ? undefined : apiToFormAvailability(opp.availability),
      eventDate: null,
      eventTime: "",
      activities: opp.activities.map((a) => String(a.id)),
      skills: opp.skills.map((s) => String(s.id)),
    },
  });

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const onSubmit = (values: OpportunityDetailsFormData) => {
    updateOpportunityDetails(
      {
        description: values.description,
        numberVolunteers: Number(values.numberOfVolunteers),
        languagesMain: toLangOptionItems(values.mainCommunication, apiLanguages, t),
        languagesResidents: toLangOptionItems(values.residentsSpeak, apiLanguages, t),
        activities: toOptionItems(values.activities, apiActivities),
        skills: toOptionItems(values.skills, apiSkills),
        schedule: values.availability ? formToApiAvailability(values.availability) : undefined,
      },
      { onSuccess: onCancel },
    );
  };

  return (
    <>
      <FormDetails>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="textarea"
              label={t(`${prefix}.description`)}
              value={field.value}
              setValue={field.onChange}
              maxLength={MAX_DESCRIPTION_LENGTH}
              hint={t(`${prefix}.descriptionHint`, { max: MAX_DESCRIPTION_LENGTH })}
              errorMessage={errors.description?.message}
            />
          )}
        />

        <Controller
          name="mainCommunication"
          control={control}
          render={({ field, fieldState }) => (
            <FieldGroup data-testid="opportunity-details-main-communication-edit">
              <label>{t(`${prefix}.mainCommunication`)}</label>
              <div>
                <LanguageFields
                  languages={field.value}
                  onChange={field.onChange}
                  t={t}
                  availableLanguages={languagesForForm}
                  showLevel={false}
                />
                {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
              </div>
            </FieldGroup>
          )}
        />

        <Controller
          name="residentsSpeak"
          control={control}
          render={({ field, fieldState }) => (
            <FieldGroup data-testid="opportunity-details-residents-speak-edit">
              <label>{t(`${prefix}.residentsSpeak`)}</label>
              <div>
                <LanguageFields
                  languages={field.value}
                  onChange={field.onChange}
                  t={t}
                  availableLanguages={languagesForForm}
                  showLevel={false}
                />
                {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
              </div>
            </FieldGroup>
          )}
        />

        {isEventType ? (
          <>
            <Controller
              name="eventDate"
              control={control}
              render={({ field }) => (
                <DateFieldRow data-testid="opportunity-details-event-date-edit">
                  <label>{t(`${prefix}.eventDate`)}</label>
                  <DatePickerContainer>
                    <DatePickerWithLabel
                      date={field.value ?? undefined}
                      onSelect={(d) => field.onChange(d ?? null)}
                      locale={locale}
                      allowFuture
                    />
                  </DatePickerContainer>
                </DateFieldRow>
              )}
            />

            <Controller
              name="eventTime"
              control={control}
              render={({ field }) => (
                <DateFieldRow data-testid="opportunity-details-event-time-edit">
                  <label htmlFor="eventTime">{t(`${prefix}.eventTime`)}</label>
                  <TimeInputWrapper>
                    <TimeInput
                      id="eventTime"
                      name="eventTime"
                      type="time"
                      value={field.value || ""}
                      onChange={field.onChange}
                      $hasError={!!errors.eventTime}
                    />
                    {errors.eventTime && <ErrorText>{errors.eventTime.message}</ErrorText>}
                  </TimeInputWrapper>
                </DateFieldRow>
              )}
            />
          </>
        ) : (
          <Controller
            name="availability"
            control={control}
            render={({ field, fieldState }) => (
              <FieldGroup data-testid="opportunity-details-schedule-edit">
                <label>{t(`${prefix}.schedule`)}</label>
                <div>
                  <AvailabilityGrid
                    availability={field.value ?? apiToFormAvailability(opp.availability)}
                    onChange={field.onChange}
                    t={t}
                    currentLanguage={lang as Lang}
                  />
                  {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
                </div>
              </FieldGroup>
            )}
          />
        )}

        <Controller
          name="numberOfVolunteers"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="stepper"
              label={t(`${prefix}.numberOfVolunteers`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.numberOfVolunteers?.message}
            />
          )}
        />

        <Controller
          name="activities"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="checkbox-list"
              label={t(`${prefix}.activities`)}
              value={field.value.map((id) => activityMapping.idToTitle[Number(id)] || String(id))}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                field.onChange(labels.map((label) => String(activityMapping.titleToId[label])));
              }}
              options={apiActivities.map((a) => a.title)}
              errorMessage={errors.activities?.message}
            />
          )}
        />

        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="checkbox-list"
              label={t(`${prefix}.skills`)}
              value={field.value.map((id) => skillMapping.idToTitle[Number(id)] || String(id))}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                field.onChange(labels.map((label) => String(skillMapping.titleToId[label])));
              }}
              options={apiSkills.map((s) => s.title)}
              errorMessage={errors.skills?.message}
            />
          )}
        />
      </FormDetails>

      <FormButtonRow>
        <Button
          text={t(`${prefix}.cancel`)}
          onClick={handleCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t(`${prefix}.saveChanges`)}
          onClick={handleSubmit(onSubmit)}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid}
        />
      </FormButtonRow>
    </>
  );
}
