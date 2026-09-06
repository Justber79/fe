"use client";

import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import { ApiLanguageOption } from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { EditableField } from "@/components/EditableField/EditableField";
import { ErrorMessage, FormInput } from "@/components/core/common";
import { ApiOptionLists, Lang } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper } from "../styled";
import { DefaultVolunteerRegistrationData } from "../types";
import { useForm } from "@tanstack/react-form";
import { useMemo } from "react";

type Props = {
  form: ReturnType<typeof useForm<DefaultVolunteerRegistrationData>>;
  optionLists?: ApiOptionLists;
};

export function AddressStep({ form, optionLists }: Props) {
  const { t, i18n } = useTranslation();

  const locations = optionLists?.district;
  const locationMapping = createMapping(optionLists?.district as ApiLanguageOption[]);
  const languagesForForm = useMemo(
    () =>
      optionLists?.language?.map((lang) => ({
        id: lang.id,
        title: { [i18n.language as Lang]: lang.title } as Record<Lang, string>,
      })),
    [optionLists?.language, i18n.language],
  );
  return (
    <div>
      <form.Field
        name="addressPostcode"
        validators={{
          onChange: ({ value }) => (!value ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.postcode")}</FieldLabel>
            <FormInput
              value={field.state.value || ""}
              onInputChange={(v) => field.handleChange(v)}
              placeHolder="12345"
            />
            {field.state.meta.errors.length > 0 && <ErrorMessage message={field.state.meta.errors.join(", ")} />}
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field
        name="locations"
        validators={{ onChange: ({ value }) => (value.length === 0 ? t("form.error.required") : undefined) }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.locations.header")}</FieldLabel>
            <EditableField
              mode="edit"
              type="checkbox-list"
              value={(field.state.value || []).map((location) => locationMapping.idToTitle[location])}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                const mappedIds = labels.map((val) => locationMapping.titleToId[val]);
                field.handleChange(mappedIds);
              }}
              options={locations?.map((a) => a.title)}
            />
            {field.state.meta.errors.length > 0 && <ErrorMessage message={field.state.meta.errors.join(", ")} />}
          </FieldWrapper>
        )}
      </form.Field>

      <form.Field
        name="languages"
        validators={{
          onBlur: ({ value }) => (!value[0].language || !value[0].level ? t("form.error.required") : undefined),
        }}
      >
        {(field) => (
          <FieldWrapper>
            <FieldLabel>{t("volunteerRegistration.fields.languages.header")}</FieldLabel>
            <LanguageFields
              languages={field.state.value}
              t={t}
              onChange={(languages) =>
                field.handleChange(
                  languages.map((language) => ({
                    ...language,
                    id: language.language ? Number(language.language) : language.id,
                  })),
                )
              }
              availableLanguages={languagesForForm}
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
    </div>
  );
}
