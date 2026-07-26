"use client";
import { FormInput } from "@/components/core/common";
import { ApiOptionLists, EntityTableName } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle, StyledSelect, StyledTextarea } from "../styled";
import { ProfileCompletionData } from "../types";

type OrgData = Pick<ProfileCompletionData, "organizationName" | "organizationType" | "about" | "website">;

type Props = {
  data: OrgData;
  onChange: (fields: Partial<OrgData>) => void;
  errors: Partial<Record<string, string>>;
  optionLists?: ApiOptionLists;
};

export function OrgInfoStep({ data, onChange, errors, optionLists }: Props) {
  const { t } = useTranslation();
  const agentTypes = optionLists?.[EntityTableName.AGENT_TYPE] ?? [];

  return (
    <div>
      <StepTitle>{t("agentRegistration.steps.orgInfo.title")}</StepTitle>
      <StepDescription>{t("agentRegistration.steps.orgInfo.description")}</StepDescription>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.organizationName")}</FieldLabel>
        <FormInput
          value={data.organizationName}
          onInputChange={(v) => onChange({ organizationName: v })}
          placeHolder={t("agentRegistration.fields.organizationName")}
          errors={errors.organizationName ? [errors.organizationName] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.organizationType")}</FieldLabel>
        <StyledSelect
          value={data.organizationType}
          onChange={(e) => onChange({ organizationType: e.target.value ? Number(e.target.value) : "" })}
          $hasError={!!errors.organizationType}
        >
          <option value="">{t("agentRegistration.fields.selectOrganizationType")}</option>
          {agentTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.title}
            </option>
          ))}
        </StyledSelect>
        {errors.organizationType && (
          <span style={{ color: "var(--form-input-error-message-color)", fontSize: "0.875rem" }}>
            {errors.organizationType}
          </span>
        )}
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.about")}</FieldLabel>
        <StyledTextarea
          value={data.about}
          onChange={(e) => onChange({ about: e.target.value })}
          placeholder={t("agentRegistration.fields.aboutPlaceholder")}
          rows={4}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>
          {t("agentRegistration.fields.website")} ({t("agentRegistration.optional")})
        </FieldLabel>
        <FormInput
          type="url"
          value={data.website}
          onInputChange={(v) => onChange({ website: v })}
          placeHolder="https://..."
        />
      </FieldWrapper>
    </div>
  );
}
