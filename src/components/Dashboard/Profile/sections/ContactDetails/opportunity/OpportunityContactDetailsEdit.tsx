import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormButtonRow, FormDetails } from "../../shared/styles";
import { OpportunityContactDetailsFormData } from "./opportunityContactDetailsSchema";

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
};

export const OpportunityContactDetailsEdit = ({ onCancel, onSubmit, isPending }: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isValid, isDirty },
  } = useFormContext<OpportunityContactDetailsFormData>();

  return (
    <>
      <FormDetails data-testid="opportunity-contact-details-edit">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.contactDetails.name")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.name?.message}
            />
          )}
        />

        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.contactDetails.phone")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.opportunityProfile.contactDetails.email")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />
      </FormDetails>

      <FormButtonRow>
        <Button
          text={t("dashboard.opportunityProfile.contactDetails.cancel")}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.opportunityProfile.contactDetails.saveChanges")}
          onClick={onSubmit}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          disabled={!isDirty || !isValid || isPending}
        />
      </FormButtonRow>
    </>
  );
};
