import { EditableField } from "@/components/EditableField/EditableField";
import { AgentRoles } from "@/config/constants";
import { Control, Controller, ControllerRenderProps, FieldErrors } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { ContactFormData } from "./contactFormSchema";

type Props = {
  control: Control<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  roleOptions: string[];
  toLabel: (key: AgentRoles) => string;
  toKey: (label: string) => AgentRoles;
};

export const ContactFormFields = ({ control, errors, roleOptions, toLabel, toKey }: Props) => {
  const { t } = useTranslation();

  return (
    <FormDetails data-testid="agent-contact-form-fields">
      <Controller
        name="firstName"
        control={control}
        render={({ field }: { field: ControllerRenderProps<ContactFormData, "firstName"> }) => (
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
        name="lastName"
        control={control}
        render={({ field }: { field: ControllerRenderProps<ContactFormData, "lastName"> }) => (
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
      <Controller
        name="role"
        control={control}
        render={({ field }: { field: ControllerRenderProps<ContactFormData, "role"> }) => (
          <EditableField
            mode="edit"
            type="radio-list"
            label={t("dashboard.agentProfile.contactDetails.roles.label")}
            value={field.value ? toLabel(field.value as AgentRoles) : ""}
            setValue={(value) => field.onChange(toKey(value as string))}
            options={roleOptions}
            errorMessage={errors.role?.message}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }: { field: ControllerRenderProps<ContactFormData, "email"> }) => (
          <EditableField
            mode="edit"
            type="text"
            label={t("dashboard.agentProfile.contactDetails.email")}
            value={field.value ?? ""}
            setValue={field.onChange}
            errorMessage={errors.email?.message}
          />
        )}
      />
      <Controller
        name="phone"
        control={control}
        render={({ field }: { field: ControllerRenderProps<ContactFormData, "phone"> }) => (
          <EditableField
            mode="edit"
            type="text"
            label={t("dashboard.agentProfile.contactDetails.mobile")}
            value={field.value ?? ""}
            setValue={field.onChange}
            errorMessage={errors.phone?.message}
          />
        )}
      />
      <Controller
        name="landline"
        control={control}
        render={({ field }: { field: ControllerRenderProps<ContactFormData, "landline"> }) => (
          <EditableField
            mode="edit"
            type="text"
            label={t("dashboard.agentProfile.contactDetails.landline")}
            value={field.value ?? ""}
            setValue={field.onChange}
            errorMessage={errors.landline?.message}
          />
        )}
      />
    </FormDetails>
  );
};
