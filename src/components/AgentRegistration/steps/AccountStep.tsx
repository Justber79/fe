"use client";
import { FormInput } from "@/components/core/common";
import { useTranslation } from "react-i18next";
import { AgentRegistrationData } from "../types";
import { FieldConsent, FieldLabel, FieldWrapper, StepDescription, StepTitle, StyledErrorMessage } from "../styled";
import { Subpage } from "@/types";
import { WarningCircle } from "@phosphor-icons/react";
import { useId } from "react";

type Props = {
  data: AgentRegistrationData;
  onChange: (fields: Partial<AgentRegistrationData>) => void;
  errors: Partial<Record<keyof AgentRegistrationData, string>>;
  namespace?: string;
};

export function AccountStep({ data, onChange, errors, namespace = "agentRegistration" }: Props) {
  const { t } = useTranslation();
  const fieldId = useId();

  return (
    <div>
      <StepTitle>{t(`${namespace}.steps.account.title`)}</StepTitle>
      <StepDescription>{t(`${namespace}.steps.account.description`)}</StepDescription>

      <FieldWrapper>
        <FieldLabel htmlFor={`${fieldId}-first-name`}>{t(`${namespace}.fields.firstName`)}</FieldLabel>
        <FormInput
          id={`${fieldId}-first-name`}
          value={data.firstName}
          onInputChange={(v) => onChange({ firstName: v })}
          placeHolder={t(`${namespace}.fields.firstName`)}
          errors={errors.firstName ? [errors.firstName] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor={`${fieldId}-last-name`}>{t(`${namespace}.fields.lastName`)}</FieldLabel>
        <FormInput
          id={`${fieldId}-last-name`}
          value={data.lastName}
          onInputChange={(v) => onChange({ lastName: v })}
          placeHolder={t(`${namespace}.fields.lastName`)}
          errors={errors.lastName ? [errors.lastName] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor={`${fieldId}-email`}>{t(`${namespace}.fields.email`)}</FieldLabel>
        <FormInput
          id={`${fieldId}-email`}
          type="email"
          value={data.email}
          onInputChange={(v) => onChange({ email: v })}
          placeHolder={t(`${namespace}.fields.email`)}
          errors={errors.email ? [errors.email] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor={`${fieldId}-password`}>{t(`${namespace}.fields.password`)}</FieldLabel>
        <FormInput
          id={`${fieldId}-password`}
          type="password"
          value={data.password}
          onInputChange={(v) => onChange({ password: v })}
          placeHolder={t(`${namespace}.fields.password`)}
          errors={errors.password ? [errors.password] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor={`${fieldId}-confirm-password`}>{t(`${namespace}.fields.confirmPassword`)}</FieldLabel>
        <FormInput
          id={`${fieldId}-confirm-password`}
          type="password"
          value={data.confirmPassword}
          onInputChange={(v) => onChange({ confirmPassword: v })}
          placeHolder={t(`${namespace}.fields.confirmPassword`)}
          errors={errors.confirmPassword ? [errors.confirmPassword] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldLabel htmlFor={`${fieldId}-phone`}>{t(`${namespace}.fields.phone`)}</FieldLabel>
        <FormInput
          id={`${fieldId}-phone`}
          type="tel"
          value={data.phone}
          onInputChange={(v) => onChange({ phone: v })}
          placeHolder={t(`${namespace}.fields.phone`)}
          errors={errors.phone ? [errors.phone] : []}
        />
      </FieldWrapper>

      <FieldWrapper>
        <FieldConsent htmlFor={`${fieldId}-consent`}>
          <input
            id={`${fieldId}-consent`}
            type="checkbox"
            aria-invalid={!!errors.consent || undefined}
            aria-describedby={errors.consent ? `${fieldId}-consent-error` : undefined}
            checked={data.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
          />
          <span>
            {t(`${namespace}.fields.consent.header`)}{" "}
            <a href={`/${Subpage.DATA_PRIVACY}`}>{t("homepage.footer.legal.dataPrivacy")}</a>,{" "}
            <a href={`/${Subpage.RAC_GUIDELINES}`}>{t("homepage.footer.legal.guidelines")}</a>{" "}
            {t(`${namespace}.fields.consent.and`)}{" "}
            <a href={`/${Subpage.AGREEMENT}`}>{t("homepage.footer.legal.agreement")}</a>{" "}
          </span>
        </FieldConsent>
        {errors.consent && (
          <StyledErrorMessage id={`${fieldId}-consent-error`}>
            <WarningCircle aria-hidden="true" size={20} weight="regular" />
            {errors.consent}
          </StyledErrorMessage>
        )}
      </FieldWrapper>
    </div>
  );
}
