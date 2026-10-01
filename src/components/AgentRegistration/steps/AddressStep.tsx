"use client";
import { FormInput } from "@/components/core/common";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle } from "../styled";
import { ProfileCompletionData } from "../types";

// No district picker (fe#1089): the backend derives the district from the
// postcode (be#1059) and drops any districtId the client sends.
type AddressData = Pick<ProfileCompletionData, "addressStreet" | "addressPostcode">;

type Props = {
  data: AddressData;
  onChange: (fields: Partial<AddressData>) => void;
  errors: Partial<Record<string, string>>;
  hideStreet?: boolean;
};

export function AddressStep({ data, onChange, errors, hideStreet = false }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      {!hideStreet && (
        <>
          <StepTitle>{t("agentRegistration.steps.address.title")}</StepTitle>
          <StepDescription>{t("agentRegistration.steps.address.description")}</StepDescription>
        </>
      )}

      {!hideStreet && (
        <FieldWrapper>
          <FieldLabel>{t("agentRegistration.fields.addressStreet")}</FieldLabel>
          <FormInput
            value={data.addressStreet}
            onInputChange={(v) => onChange({ addressStreet: v })}
            placeHolder={t("agentRegistration.fields.addressStreet")}
            errors={errors.addressStreet ? [errors.addressStreet] : []}
          />
        </FieldWrapper>
      )}

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.addressPostcode")}</FieldLabel>
        <FormInput
          value={data.addressPostcode}
          onInputChange={(v) => onChange({ addressPostcode: v })}
          placeHolder="12345"
          errors={errors.addressPostcode ? [errors.addressPostcode] : []}
        />
      </FieldWrapper>
    </div>
  );
}
