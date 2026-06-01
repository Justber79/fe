"use client";
import { FormInput } from "@/components/core/common";
import { ApiOptionLists, EntityTableName } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle, StyledSelect } from "../styled";
import { AgentRegistrationData, ProfileCompletionData } from "../types";

type AddressData = Pick<AgentRegistrationData | ProfileCompletionData, "addressStreet" | "addressPostcode" | "districtId">;

type Props = {
  data: AddressData;
  onChange: (fields: Partial<AddressData>) => void;
  errors: Partial<Record<string, string>>;
  optionLists?: ApiOptionLists;
  hideStreet?: boolean;
};

export function AddressStep({ data, onChange, errors, optionLists, hideStreet = false }: Props) {
  const { t } = useTranslation();
  const districts = optionLists?.[EntityTableName.DISTRICT] ?? [];

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

      <FieldWrapper>
        <FieldLabel>
          {t("agentRegistration.fields.district")} ({t("agentRegistration.optional")})
        </FieldLabel>
        <StyledSelect
          value={data.districtId ?? ""}
          onChange={(e) => onChange({ districtId: e.target.value ? Number(e.target.value) : null })}
          $hasError={false}
        >
          <option value="">{t("agentRegistration.fields.selectDistrict")}</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.title}
            </option>
          ))}
        </StyledSelect>
      </FieldWrapper>
    </div>
  );
}
