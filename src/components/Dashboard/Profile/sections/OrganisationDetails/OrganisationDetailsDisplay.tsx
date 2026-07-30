import { EditableField } from "@/components/EditableField/EditableField";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../shared/styles";
import { clientLanguagesToDisplay } from "./formatters";
import { OrganisationDetailsFormData } from "./organisationDetailsSchema";

const i18nPrefix = "dashboard.agentProfile.organisationDetails";

type Props = {
  rawClientLanguages?: Array<{ id: number; title: string }>;
  address?: string;
};

export const OrganisationDetailsDisplay = ({ rawClientLanguages, address }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<OrganisationDetailsFormData>();
  const values = watch();

  return (
    <FormDetails data-testid="organisation-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.ngoTitle`)}
        value={values.title}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.about`)}
        value={values.about}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.website`)}
        value={values.website ?? ""}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.address`)}
        value={address || "—"}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.organisationType`)}
        value={values.organizationType}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.operator`)}
        value={values.operator}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="checkbox-list"
        label={t(`${i18nPrefix}.services`)}
        value={values.services}
        setValue={() => {}}
      />
      <EditableField
        mode="display"
        type="text"
        label={t(`${i18nPrefix}.clientLanguages`)}
        value={clientLanguagesToDisplay(rawClientLanguages)}
        setValue={() => {}}
      />
    </FormDetails>
  );
};
