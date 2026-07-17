import { EditableField } from "@/components/EditableField/EditableField";
import { AgentRoles } from "@/config/constants";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FieldWrapper, FormDetails } from "../../shared/styles";
import { AgentContactDetailsFormData } from "./agentContactDetailsSchema";

type Props = {
  keysToLabels: (keys: AgentRoles[]) => string[];
};

export const AgentContactDetailsDisplay = ({ keysToLabels }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<AgentContactDetailsFormData>();
  const values = watch();

  const fullName = values.firstName
    ? [values.firstName, values.middleName, values.lastName].filter(Boolean).join(" ")
    : "–";

  return (
    <FormDetails>
      <FieldWrapper>
        <>
          <label>{t("dashboard.agentProfile.contactDetails.fullName")}</label>
          <span>{fullName}</span>
        </>
      </FieldWrapper>
      <EditableField
        mode="display"
        type="checkbox-list"
        label={t("dashboard.agentProfile.contactDetails.roles.label")}
        value={values.role ? keysToLabels([values?.role]) : []}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.agentProfile.contactDetails.email")}
        value={values.email}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.agentProfile.contactDetails.mobile")}
        value={values.phone}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.agentProfile.contactDetails.landline")}
        value={values.landline || ""}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
