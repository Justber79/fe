import Button from "@/components/core/button/Button/Button";
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { EditableField } from "@/components/EditableField/EditableField";
import { Locale } from "date-fns";
import { Controller, ControllerFieldState, ControllerRenderProps, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ErrorMessage } from "@/components/core/common";

import { ButtonRow, DateFieldRow, DatePickerContainer, Details, TimeInput, TimeInputWrapper } from "./styles";
import { AccompanyingDetailsFormData } from "./createAccompanyingDetailsSchema";

type Props = {
  locale: Locale;
  languageOptions: string[];
  keyToLabel: Record<string, string>;
  labelToKey: Record<string, string>;
  appointmentLanguageOptions: string[];
  appointmentLanguageKeyToLabel: Record<string, string>;
  appointmentLanguageLabelToKey: Record<string, string>;
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
  minAppointmentDate: Date;
  hideButtons?: boolean;
};

export const AccompanyingDetailsEdit = ({
  locale,
  languageOptions,
  keyToLabel,
  labelToKey,
  appointmentLanguageOptions,
  appointmentLanguageKeyToLabel,
  appointmentLanguageLabelToKey,
  onCancel,
  onSubmit,
  isPending,
  minAppointmentDate,
  hideButtons = false,
}: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isValid, isDirty },
  } = useFormContext<AccompanyingDetailsFormData>();

  return (
    <>
      <Details data-testid="accompanying-details-edit">
        <Controller
          name="appointmentAddress"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentAddress"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentAddress")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.appointmentAddress?.message}
            />
          )}
        />

        <Controller
          name="appointmentPostcode"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentPostcode"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentPostcode")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.appointmentPostcode?.message}
            />
          )}
        />

        <Controller
          name="appointmentDate"
          control={control}
          render={({
            field,
            fieldState,
          }: {
            field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentDate">;
            fieldState: ControllerFieldState;
          }) => (
            <DateFieldRow data-testid="appointment-date-field">
              <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentDate")}</label>
              <DatePickerContainer>
                <DatePickerWithLabel
                  hasError={!!fieldState.error}
                  date={field.value ?? undefined}
                  onSelect={(d) => field.onChange(d ?? null)}
                  locale={locale}
                  allowFuture
                  minDate={minAppointmentDate}
                />
                {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
              </DatePickerContainer>
            </DateFieldRow>
          )}
        />

        <Controller
          name="appointmentTime"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentTime"> }) => (
            <DateFieldRow data-testid="appointment-time-field">
              <label htmlFor="appointmentTime">
                {t("dashboard.opportunityProfile.accompanyingDetails.appointmentTime")}
              </label>
              <TimeInputWrapper>
                <TimeInput
                  id="appointmentTime"
                  name="appointmentTime"
                  type="time"
                  value={field.value || ""}
                  onChange={field.onChange}
                  $hasError={!!errors.appointmentTime}
                />
                {errors.appointmentTime?.message && <ErrorMessage message={errors.appointmentTime.message} />}
              </TimeInputWrapper>
            </DateFieldRow>
          )}
        />

        <Controller
          name="refugeeNumber"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeNumber"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeNumber")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.refugeeNumber?.message}
            />
          )}
        />

        <Controller
          name="refugeeName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeName"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeName")}
              value={field.value || ""}
              setValue={field.onChange}
              errorMessage={errors.refugeeName?.message}
            />
          )}
        />

        <Controller
          name="refugeeLanguage"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "refugeeLanguage"> }) => (
            <EditableField
              mode="edit"
              type="checkbox-list"
              label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeLanguage")}
              value={(field.value ?? []).map((id) => keyToLabel[id] || id)}
              setValue={(value) => {
                const labels = Array.isArray(value) ? value : [value];
                field.onChange(labels.map((label) => labelToKey[label] || label));
              }}
              options={languageOptions}
              errorMessage={errors.refugeeLanguage?.message}
            />
          )}
        />

        <Controller
          name="appointmentLanguage"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AccompanyingDetailsFormData, "appointmentLanguage"> }) => (
            <EditableField
              mode="edit"
              type="radio-list"
              label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentLanguage")}
              value={appointmentLanguageKeyToLabel[field.value || ""] || field.value || ""}
              setValue={(value) => {
                const label = Array.isArray(value) ? value[0] : value;
                field.onChange(appointmentLanguageLabelToKey[label] || label);
              }}
              options={appointmentLanguageOptions}
              errorMessage={errors.appointmentLanguage?.message}
            />
          )}
        />
      </Details>

      {!hideButtons && (
        <ButtonRow>
          <Button
            text={t("dashboard.opportunityProfile.accompanyingDetails.cancel")}
            onClick={onCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.opportunityProfile.accompanyingDetails.saveChanges")}
            onClick={onSubmit}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            disabled={!isDirty || !isValid || isPending}
          />
        </ButtonRow>
      )}
    </>
  );
};
