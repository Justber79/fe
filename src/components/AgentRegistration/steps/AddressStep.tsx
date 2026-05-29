"use client";
import { FormInput } from "@/components/core/common";
import { ApiOptionLists, EntityTableName } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle, StyledSelect } from "../styled";
import { AgentRegistrationData } from "../types";

interface Props {
  data: AgentRegistrationData;
  onChange: (fields: Partial<AgentRegistrationData>) => void;
  errors: Partial<Record<keyof AgentRegistrationData, string>>;
  optionLists?: ApiOptionLists;
}

export function AddressStep({ data, onChange, errors, optionLists }: Props) {
  const { t } = useTranslation();
  const districts = optionLists?.[EntityTableName.DISTRICT] ?? [];

  return (
    <div>
      <StepTitle>{t("agentRegistration.steps.address.title")}</StepTitle>
      <StepDescription>{t("agentRegistration.steps.address.description")}</StepDescription>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.addressStreet")}</FieldLabel>
        <FormInput
          value={data.addressStreet}
          onInputChange={(v) => onChange({ addressStreet: v })}
          placeHolder={t("agentRegistration.fields.addressStreet")}
          errors={errors.addressStreet ? [errors.addressStreet] : []}
        />
      </FieldWrapper>

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
