import { EditableField } from "@/components/EditableField/EditableField";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { OpportunityContactDetailsFormData } from "./opportunityContactDetailsSchema";

export const OpportunityContactDetailsDisplay = () => {
  const { t } = useTranslation();
  const { watch } = useFormContext<OpportunityContactDetailsFormData>();
  const values = watch();

  return (
    <FormDetails data-testid="opportunity-contact-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.contactDetails.name")}
        value={values.name}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.contactDetails.phone")}
        value={values.phone}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.contactDetails.email")}
        value={values.email}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
