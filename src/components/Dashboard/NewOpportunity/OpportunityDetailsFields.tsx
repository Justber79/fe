import { ApiLanguageOption } from "../Profile/sections/VolunteerProfile/hooks";
import { apiToFormAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/availabilityUtils";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { FormDetails } from "@/components/Dashboard/Profile/sections/shared/styles";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { ErrorMessage } from "@/components/core/common";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { Lang } from "need4deed-sdk";
import { MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { useFormContext, Controller } from "react-hook-form";
import { FieldGroup, DateFieldRow, DatePickerContainer, TimeInputWrapper, TimeInput } from "./styled";
import { useTranslation } from "react-i18next";
import { de, enUS } from "date-fns/locale";
import { OpportunityDetailsFormData } from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { EditableField } from "@/components/EditableField/EditableField";

export function OpportunityDetailsFields({
  isEvent,
  apiLanguages,
  apiActivities,
  apiSkills,
  isAccompanying,
}: {
  isEvent: boolean;
  apiLanguages: ApiLanguageOption[];
  apiActivities: ApiLanguageOption[];
  apiSkills: ApiLanguageOption[];
  isAccompanying: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();

  const activityMapping = createMapping(apiActivities);
  const skillMapping = createMapping(apiSkills);
  const languagesForForm = apiLanguages.map((l) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  }));

  if (isAccompanying) {
    return (
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
      </FormDetails>
    );
  }

  return (
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
          <FieldGroup>
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
          <FieldGroup>
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

      {isEvent ? (
        <>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DateFieldRow>
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
              <DateFieldRow>
                <label htmlFor="new-opp-eventTime">{t(`${prefix}.eventTime`)}</label>
                <TimeInputWrapper>
                  <TimeInput
                    id="new-opp-eventTime"
                    type="time"
                    value={field.value || ""}
                    onChange={field.onChange}
                    $hasError={!!errors.eventTime}
                  />
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
            <FieldGroup>
              <label>{t(`${prefix}.schedule`)}</label>
              <div>
                <AvailabilityGrid
                  availability={field.value ?? apiToFormAvailability(undefined)}
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
  );
}
