import { EditableField } from "@/components/EditableField/EditableField";
import { EMPTY_PLACEHOLDER_VALUE } from "@/config/constants";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { AccompanyingDetailsFormData } from "./accompanyingDetailsSchema";
import { formatTimeForDisplay } from "./helpers";
import { DateFieldRow, Details } from "./styles";

type Props = {
  values: AccompanyingDetailsFormData;
  languageLabel: string;
};

export const AccompanyingDetailsDisplay = ({ values, languageLabel }: Props) => {
  const { t } = useTranslation();

  return (
    <Details data-testid="accompanying-details-display">
      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentAddress")}
        value={values.appointmentAddress || ""}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentPostcode")}
        value={values.appointmentPostcode || ""}
        setValue={() => {}}
      />

      <DateFieldRow data-testid="appointment-date-field">
        <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentDate")}</label>
        <span>{values.appointmentDate ? format(values.appointmentDate, "dd.MM.yyyy") : EMPTY_PLACEHOLDER_VALUE}</span>
      </DateFieldRow>

      <DateFieldRow data-testid="appointment-time-field">
        <label>{t("dashboard.opportunityProfile.accompanyingDetails.appointmentTime")}</label>
        <span>{formatTimeForDisplay(values.appointmentTime) || EMPTY_PLACEHOLDER_VALUE}</span>
      </DateFieldRow>

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeNumber")}
        value={values.refugeeNumber || ""}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeName")}
        value={values.refugeeName || ""}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="text"
        label={t("dashboard.opportunityProfile.accompanyingDetails.refugeeLanguage")}
        value={languageLabel}
        setValue={() => {}}
      />

      <EditableField
        mode="display"
        type="radio-list"
        label={t("dashboard.opportunityProfile.accompanyingDetails.appointmentLanguage")}
        value={
          values.appointmentLanguage
            ? t(
                `dashboard.opportunityProfile.accompanyingDetails.appointmentLanguageOptions.${values.appointmentLanguage}`,
              )
            : ""
        }
        setValue={() => {}}
        options={[]}
      />
    </Details>
  );
};
