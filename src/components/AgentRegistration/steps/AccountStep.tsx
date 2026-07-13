"use client";
import { FormInput } from "@/components/core/common";
import { useTranslation } from "react-i18next";
import { AgentRegistrationData } from "../types";
import { FieldConsent, FieldLabel, FieldWrapper, StepDescription, StepTitle, StyledErrorMessage } from "../styled";
import { Subpage } from "@/types";
import { WarningCircle } from "@phosphor-icons/react";

type Props = {
  data: AgentRegistrationData;
  onChange: (fields: Partial<AgentRegistrationData>) => void;
  errors: Partial<Record<keyof AgentRegistrationData, string>>;
};

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

      <FieldWrapper>
        <FieldLabel>{t("agentRegistration.fields.phone")}</FieldLabel>
        <FormInput
          type="tel"
          value={data.phone}
          onInputChange={(v) => onChange({ phone: v })}
          placeHolder={t("agentRegistration.fields.phone")}
          errors={errors.phone ? [errors.phone] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldConsent>
          <input
            id="consent"
            type="checkbox"
            checked={data.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
          />
          <span>
            {t("agentRegistration.fields.consent.header")}{" "}
            <a href={`/${Subpage.DATA_PRIVACY}`}>{t("homepage.footer.legal.dataPrivacy")}</a>,{" "}
            <a href={`/${Subpage.RAC_GUIDELINES}`}>{t("homepage.footer.legal.guidelines")}</a>{" "}
            {t("agentRegistration.fields.consent.and")}{" "}
            <a href={`/${Subpage.AGREEMENT}`}>{t("homepage.footer.legal.agreement")}</a>{" "}
          </span>
        </FieldConsent>
        {errors.consent && (
          <StyledErrorMessage>
            <WarningCircle size={20} weight="regular" />
            {errors.consent}
          </StyledErrorMessage>
        )}
      </FieldWrapper>
    </div>
  );
}
