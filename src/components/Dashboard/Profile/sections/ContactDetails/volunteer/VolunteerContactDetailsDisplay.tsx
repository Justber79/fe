import { EditableField } from "@/components/EditableField/EditableField";
import { VolunteerCommunicationType } from "need4deed-sdk";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { VolunteerContactDetailsFormData } from "./volunteerContactDetailsSchema";

type Props = {
  keysToLabels: (keys: VolunteerCommunicationType[]) => string[];
};

export const VolunteerContactDetailsDisplay = ({ keysToLabels }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<VolunteerContactDetailsFormData>();
  const values = watch();
  const address = [values.street, values.postcode].filter(Boolean).join(", ");

  return (
    <FormDetails data-testid="volunteer-contact-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.volunteerProfile.contactDetails.phone")}
        value={values.phone}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.volunteerProfile.contactDetails.email")}
        value={values.email}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.volunteerProfile.contactDetails.address")}
        value={address}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="checkbox-list"
        label={t("dashboard.volunteerProfile.contactDetails.preferredCommunicationType.label")}
        value={keysToLabels(values.preferredCommunicationType ?? [])}
        setValue={() => {}}
        options={[]}
      />
    </FormDetails>
  );
};
