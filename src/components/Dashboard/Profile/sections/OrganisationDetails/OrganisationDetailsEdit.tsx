import Button from "@/components/core/button/Button/Button";
import { ErrorMessage } from "@/components/core/common";
import { EditableField } from "@/components/EditableField/EditableField";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { Option } from "need4deed-sdk";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../shared/styles";
import { OrganisationDetailsFormData } from "./organisationDetailsSchema";
import { useCallback } from "react";

const i18nPrefix = "dashboard.agentProfile.organisationDetails";

type Props = {
  languagesForForm: Option[];
  organizationTypeOptions: string[];
  servicesOptions: string[];
  operatorOptions: string[];
  onCancel: () => void;
  onSubmit: () => void;
};

export const OrganisationDetailsEdit = ({
  languagesForForm,
  organizationTypeOptions,
  servicesOptions,
  operatorOptions,
  onCancel,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isDirty, isValid },
  } = useFormContext<OrganisationDetailsFormData>();

  const displayOperators = useCallback(
    (value: string) => {
      if (value?.length >= 3) {
        return operatorOptions.filter((op) => op.toLowerCase().includes(value.toLowerCase()));
      } else {
        return [];
      }
    },
    [operatorOptions],
  );
  return (
    <>
      <FormDetails data-testid="organisation-details-edit">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.ngoTitle`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.title?.message}
            />
          )}
        />
        <Controller
          name="about"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.about`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.about?.message}
            />
          )}
        />
        <Controller
          name="website"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.website`)}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.website?.message}
            />
          )}
        />
        <Controller
          name="addressStreet"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.addressStreet`)}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.addressStreet?.message}
            />
          )}
        />
        <Controller
          name="addressPostcode"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t(`${i18nPrefix}.addressPostcode`)}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.addressPostcode?.message}
            />
          )}
        />
        <Controller
          name="organizationType"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="radio-list"
              label={t(`${i18nPrefix}.organisationType`)}
              value={field.value}
              setValue={field.onChange}
              options={organizationTypeOptions}
              errorMessage={errors.organizationType?.message}
            />
          )}
        />
        <Controller
          name="operator"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="radio-list"
              label={t(`${i18nPrefix}.operator`)}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.operator?.message}
              options={displayOperators(field.value)}
              placeholder={t(`${i18nPrefix}.placeholders.operatorPlaceholder`)}
              hint={t(`dashboard.agentProfile.organisationDetails.validation.operatorHint`)}
              isAutocomplete={true}
            />
          )}
        />
        <Controller
          name="services"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="checkbox-list"
              label={t(`${i18nPrefix}.services`)}
              value={field.value}
              setValue={field.onChange}
              options={servicesOptions}
              errorMessage={errors.services?.message}
            />
          )}
        />
        <Controller
          name="clientLanguages"
          control={control}
          render={({ field }) => (
            <>
              <LanguageFields
                languages={field.value}
                onChange={field.onChange}
                t={t}
                availableLanguages={languagesForForm}
                showLevel={false}
              />
              {errors.clientLanguages?.message && <ErrorMessage message={errors.clientLanguages.message} />}
            </>
          )}
        />
      </FormDetails>

      <FormButtonRow>
        <Button
          text={t(`${i18nPrefix}.cancel`)}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t(`${i18nPrefix}.saveChanges`)}
          onClick={onSubmit}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid}
        />
      </FormButtonRow>
    </>
  );
};
