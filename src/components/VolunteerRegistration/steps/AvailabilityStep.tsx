"use client";

import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { EditableField } from "@/components/EditableField/EditableField";
import { ErrorMessage } from "@/components/core/common";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid";
import { useForm } from "@tanstack/react-form";
import { ApiOptionLists, Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper } from "../styled";
import { DefaultVolunteerRegistrationData } from "../types";

type Props = {
  form: ReturnType<typeof useForm<DefaultVolunteerRegistrationData>>;
  optionLists?: ApiOptionLists;
};

export function AvailabilityStep({ form, optionLists }: Props) {
  const { t, i18n } = useTranslation();
  const activities = optionLists?.activity;
  const skills = optionLists?.skill;
  const activityMapping = createMapping(optionLists?.activity as ApiLanguageOption[]);
  const skillMapping = createMapping(optionLists?.skill as ApiLanguageOption[]);

  return (
    <div>
      <form.Field
        name="availability"
        validators={{
          onChange: ({ value }) =>
            Array.isArray(value) &&
            !value.some((day) => day.timeSlots.some((slot: { selected: boolean }) => slot.selected))
              ? t("form.error.required")
              : undefined,
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.availability.header")}</FieldLabel>
            <AvailabilityGrid
              availability={field.state.value}
              onChange={(e) => field.handleChange(e)}
              t={t}
              currentLanguage={i18n.language as Lang}
            />
            {field.state.meta.errors.length > 0 && (
              <ErrorMessage
                message={field.state.meta.errors.join(", ")}
                paddingLeft="calc(var(--editableField-fieldWrapper-label-width) + var(--editableField-fieldWrapper-gap))"
              />
            )}
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field
        name="activities"
        validators={{
          onChange: ({ value }) => (value.length === 0 ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.activities.header")}</FieldLabel>
            <EditableField
              mode="edit"
              type="checkbox-list"
              value={(field.state.value || []).map((activity) => activityMapping.idToTitle[activity as number])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                const mappedIds = labels.map((val) => activityMapping.titleToId[val]);
                field.handleChange(mappedIds);
              }}
              options={activities?.map((a) => a.title)}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field name="skills">
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.skills.header")}</FieldLabel>
            <EditableField
              mode="edit"
              type="checkbox-list"
              dropdownDirection="up"
              value={(field.state.value || []).map((skill) => skillMapping.idToTitle[skill as number])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                const mappedIds = labels.map((val) => skillMapping.titleToId[val]);
                field.handleChange(mappedIds);
              }}
              options={skills?.map((a) => a.title)}
              errorMessage={field.state.meta.errors.join(", ")}
            />
          </FieldWrapper>
        )}
      </form.Field>
    </div>
  );
}
