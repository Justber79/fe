import { EditableField } from "@/components/EditableField/EditableField";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";

type RefugeeAccommodationCentreDisplayProps = {
  name: string;
  address: string;
  district: string;
};

export const RefugeeAccommodationCentreDisplay = ({
  name,
  address,
  district,
}: RefugeeAccommodationCentreDisplayProps) => {
  const { t } = useTranslation();

  return (
    <FormDetails data-testid="refugee-accommodation-centre-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.rac.name")}
        value={name}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.rac.address")}
        value={address}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.rac.district")}
        value={district}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
