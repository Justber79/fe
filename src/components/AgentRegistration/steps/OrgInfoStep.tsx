"use client";
import { FormInput } from "@/components/core/common";
import { AgentType } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle, StyledSelect, StyledTextarea } from "../styled";
import { AgentRegistrationData } from "../types";

interface Props {
  data: AgentRegistrationData;
  onChange: (fields: Partial<AgentRegistrationData>) => void;
  errors: Partial<Record<keyof AgentRegistrationData, string>>;
}

const AGENT_TYPE_LABELS: Record<AgentType, string> = {
  [AgentType.AE]: "AE",
  [AgentType.GU1]: "GU1",
  [AgentType.GU2]: "GU2",
  [AgentType.GU2_PLUS]: "GU2+",
  [AgentType.GU3]: "GU3",
  [AgentType.NU]: "NU",
  [AgentType.ASOG]: "ASOG",
  [AgentType.COUNSELING_CENTER]: "Counseling Center",
  [AgentType.TANDEM]: "Tandem",
  [AgentType.MULTIPLE_SOCIAL_SUPPORT]: "Multiple Social Support",
};

export function OrgInfoStep({ data, onChange, errors }: Props) {
  const { t } = useTranslation();

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
          onChange={(e) => onChange({ organizationType: e.target.value as AgentType })}
          $hasError={!!errors.organizationType}
        >
          <option value="">{t("agentRegistration.fields.selectOrganizationType")}</option>
          {Object.values(AgentType).map((type) => (
            <option key={type} value={type}>
              {AGENT_TYPE_LABELS[type]}
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
