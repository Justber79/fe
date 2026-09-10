import { ErrorMessage } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { TFunction } from "i18next";
import { Lang, VolunteerStateTypeType } from "need4deed-sdk";
import { Control, Controller, ControllerRenderProps, FieldErrors, UseFormTrigger } from "react-hook-form";
import styled from "styled-components";
import { VolunteerProfileFormData } from "./volunteerProfileSchema";

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

  @media (max-width: 767px) {
    flex-direction: column;
    gap: var(--spacing-8);
  }
`;

const FieldLabel = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--color-midnight);
  width: 220px;
  flex-shrink: 0;

  @media (max-width: 767px) {
    width: 100%;
  }
`;

const FieldValue = styled.div`
  font-size: 20px;
  color: var(--color-midnight);
  flex: 1;
  line-height: 1.5;
  min-width: 0;
  width: 100%;
`;

const LanguageFieldsWrapper = styled.div`
  margin-bottom: var(--spacing-8);
`;

type Mapping = {
  idToTitle: Record<number, string>;
  titleToId: Record<string, number>;
};

type ApiItem = { id: number; title: string };

type Props = {
  control: Control<VolunteerProfileFormData>;
  errors: FieldErrors<VolunteerProfileFormData>;
  t: TFunction<"translation", undefined>;
  i18n: { language: string };
  districts: ApiItem[];
  districtMapping: Mapping;
  activities: ApiItem[];
  activityMapping: Mapping;
  skills: ApiItem[];
  skillMapping: Mapping;
  languagesForForm: Array<{ id: number | string; title: Record<Lang, string> }>;
  trigger: UseFormTrigger<VolunteerProfileFormData>;
};

export function FormFields({
  control,
  errors,
  t,
  i18n,
  districts,
  districtMapping,
  activities,
  activityMapping,
  skills,
  skillMapping,
  languagesForForm,
  trigger,
}: Props) {
  return (
    <>
      <Controller
        name="languages"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "languages"> }) => (
          <FieldRow>
            <FieldLabel>{t("dashboard.volunteerProfile.profileSection.languages")}:</FieldLabel>
            <FieldValue>
              <LanguageFieldsWrapper>
                <LanguageFields
                  languages={field.value}
                  onChange={field.onChange}
                  t={t}
                  availableLanguages={languagesForForm}
                />
              </LanguageFieldsWrapper>
              {errors.languages?.message && <ErrorMessage message={errors.languages.message} />}
            </FieldValue>
          </FieldRow>
        )}
      />

      <Controller
        name="availability"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "availability"> }) => (
          <FieldRow>
            <FieldLabel>{t("dashboard.volunteerProfile.profileSection.availability")}:</FieldLabel>
            <FieldValue>
              <AvailabilityGrid
                availability={field.value}
                onChange={field.onChange}
                t={t}
                currentLanguage={i18n.language as Lang}
              />
              {errors.availability?.message && <ErrorMessage message={errors.availability.message} />}
            </FieldValue>
          </FieldRow>
        )}
      />

      <Controller
        name="districts"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "districts"> }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t("dashboard.volunteerProfile.profileSection.districts")}
            value={field.value.map((id) => districtMapping.idToTitle[Number(id)] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(districtMapping.titleToId[label])));
              trigger("districts");
            }}
            options={districts.map((d) => d.title)}
            errorMessage={errors.districts?.message}
          />
        )}
      />

      <Controller
        name="volunteerType"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "volunteerType"> }) => (
          <EditableField
            mode="edit"
            type="radio-list"
            label={t("dashboard.volunteerProfile.profileSection.volunteerType")}
            value={field.value}
            setValue={field.onChange}
            options={Object.values(VolunteerStateTypeType)
              .filter((type): type is VolunteerStateTypeType => type !== undefined)
              .map((type) => t(`dashboard.volunteerProfile.volunteerHeader.volunteerType_options.${type}`))}
            errorMessage={errors.volunteerType?.message}
          />
        )}
      />

      <Controller
        name="activities"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "activities"> }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t("dashboard.volunteerProfile.profileSection.activities")}
            value={field.value.map((id) => activityMapping.idToTitle[Number(id)] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(activityMapping.titleToId[label])));
              trigger("activities");
            }}
            options={activities.map((a) => a.title)}
            errorMessage={errors.activities?.message}
          />
        )}
      />

      <Controller
        name="skills"
        control={control}
        render={({ field }: { field: ControllerRenderProps<VolunteerProfileFormData, "skills"> }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t("dashboard.volunteerProfile.profileSection.skills")}
            value={field.value.map((id) => skillMapping.idToTitle[Number(id)] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(skillMapping.titleToId[label])));
              trigger("skills");
            }}
            options={skills.map((s) => s.title)}
            errorMessage={errors.skills?.message}
          />
        )}
      />
    </>
  );
}
