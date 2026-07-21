import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { AgentRoles } from "@/config/constants";
import { Controller, ControllerRenderProps, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonRow, FormDetails } from "../../shared/styles";
import { AgentContactDetailsFormData } from "./agentContactDetailsSchema";

type Props = {
  options: string[];
  toLabel: (key: AgentRoles) => string;
  toKey: (label: string) => AgentRoles;
  onCancel: () => void;
  onSubmit: () => void;
  isPending: boolean;
};

export const AgentContactDetailsEdit = ({ options, toLabel, toKey, onCancel, onSubmit, isPending }: Props) => {
  const { t } = useTranslation();
  const {
    control,
    formState: { errors, isValid, isDirty },
  } = useFormContext<AgentContactDetailsFormData>();

  return (
    <>
      <FormDetails data-testid="opportunity-contact-details-edit">
        <>
          <Controller
            name="firstName"
            control={control}
            render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "firstName"> }) => (
              <EditableField
                mode="edit"
                type="text"
                label={t("dashboard.agentProfile.contactDetails.firstName")}
                value={field.value}
                setValue={field.onChange}
                errorMessage={errors.firstName?.message}
              />
            )}
          />

          <Controller
            name="middleName"
            control={control}
            render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "middleName"> }) => (
              <EditableField
                mode="edit"
                type="text"
                label={t("dashboard.agentProfile.contactDetails.middleName")}
                value={field.value ? field.value : ""}
                setValue={field.onChange}
                errorMessage={errors.middleName?.message}
              />
            )}
          />

          <Controller
            name="lastName"
            control={control}
            render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "lastName"> }) => (
              <EditableField
                mode="edit"
                type="text"
                label={t("dashboard.agentProfile.contactDetails.lastName")}
                value={field.value}
                setValue={field.onChange}
                errorMessage={errors.lastName?.message}
              />
            )}
          />
        </>
        <Controller
          name="role"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "role"> }) => (
            <EditableField
              mode="edit"
              type="radio-list"
              label={t("dashboard.agentProfile.contactDetails.roles.label")}
              value={field.value ? toLabel(field.value) : ""}
              setValue={(value) => field.onChange(toKey(value as string))}
              options={options}
              errorMessage={errors.role?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "email"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.email")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "phone"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.mobile")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />
        <Controller
          name="landline"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AgentContactDetailsFormData, "landline"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.landline")}
              value={field.value ? field.value : ""}
              setValue={field.onChange}
              errorMessage={errors.landline?.message}
            />
          )}
        />
      </FormDetails>

      <ButtonRow>
        <Button
          text={t("dashboard.agentProfile.contactDetails.cancel")}
          onClick={onCancel}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.agentProfile.contactDetails.saveChanges")}
          onClick={onSubmit}
          width="auto"
          disabled={!isDirty || !isValid || isPending}
          padding="var(--volunteer-profile-section-card-header-button-padding)"
        />
      </ButtonRow>
    </>
  );
};
