"use client";
import { FormInput } from "@/components/core/common";
import { useTranslation } from "react-i18next";
import { AgentRegistrationData } from "../types";
import { FieldLabel, FieldWrapper, StepDescription, StepTitle } from "../styled";

interface Props {
  data: AgentRegistrationData;
  onChange: (fields: Partial<AgentRegistrationData>) => void;
  errors: Partial<Record<keyof AgentRegistrationData, string>>;
}

export function AccountStep({ data, onChange, errors }: Props) {
  const { t } = useTranslation();

  return (
    <div>
      <StepTitle>{t("agentRegistration.steps.account.title")}</StepTitle>
      <StepDescription>{t("agentRegistration.steps.account.description")}</StepDescription>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.firstName")}</FieldLabel>
        <FormInput
          value={data.firstName}
          onInputChange={(v) => onChange({ firstName: v })}
          placeHolder={t("agentRegistration.fields.firstName")}
          errors={errors.firstName ? [errors.firstName] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.lastName")}</FieldLabel>
        <FormInput
          value={data.lastName}
          onInputChange={(v) => onChange({ lastName: v })}
          placeHolder={t("agentRegistration.fields.lastName")}
          errors={errors.lastName ? [errors.lastName] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.email")}</FieldLabel>
        <FormInput
          type="email"
          value={data.email}
          onInputChange={(v) => onChange({ email: v })}
          placeHolder={t("agentRegistration.fields.email")}
          errors={errors.email ? [errors.email] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.password")}</FieldLabel>
        <FormInput
          type="password"
          value={data.password}
          onInputChange={(v) => onChange({ password: v })}
          placeHolder={t("agentRegistration.fields.password")}
          errors={errors.password ? [errors.password] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.confirmPassword")}</FieldLabel>
        <FormInput
          type="password"
          value={data.confirmPassword}
          onInputChange={(v) => onChange({ confirmPassword: v })}
          placeHolder={t("agentRegistration.fields.confirmPassword")}
          errors={errors.confirmPassword ? [errors.confirmPassword] : []}
        />
      </FieldWrapper>
    </div>
  );
}
