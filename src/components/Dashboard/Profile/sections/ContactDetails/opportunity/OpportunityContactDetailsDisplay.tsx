import { EditableField } from "@/components/EditableField/EditableField";
import { PreferredCommunicationType } from "need4deed-sdk";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { OpportunityContactDetailsFormData } from "./opportunityContactDetailsSchema";

type Props = {
  keysToLabels: (keys: PreferredCommunicationType[]) => string[];
};

export const OpportunityContactDetailsDisplay = ({ keysToLabels }: Props) => {
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

      <EditableField
        mode="display"
        type="checkbox-list"
        label={t("dashboard.opportunityProfile.contactDetails.waysToContact.label")}
        value={keysToLabels(values.waysToContact ?? [])}
        setValue={() => {}}
        options={[]}
      />
    </FormDetails>
  );
};
