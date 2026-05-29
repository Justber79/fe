"use client";
import { Button } from "@/components/core/button";
import { apiPathAgent, apiPathLogin, apiPathOption, LOGGED_IN_COOKIE } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import axios from "axios";
import i18next from "i18next";
import { ApiOptionLists, UserRole } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ProgressBar } from "./ProgressBar";
import { AccountStep } from "./steps/AccountStep";
import { AddressStep } from "./steps/AddressStep";
import { OrgInfoStep } from "./steps/OrgInfoStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ServicesStep } from "./steps/ServicesStep";
import { AgentRegistrationData, defaultAgentRegistrationData, TOTAL_STEPS } from "./types";

// NOTE: The following BE changes are required before this flow is fully functional:
// 1. POST /api/user must allow role: "agent" (currently only "user" | "admin" are permitted)
// 2. POST /api/agent endpoint must be created (currently only GET/PATCH/DELETE exist)
const API_PATH_USER = "/api/user";

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px;
  background: var(--layout-static-page-background-default, #f8f6f8);
`;

const Card = styled.div`
  background: var(--color-white);
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
`;

const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 700;
  color: var(--color-midnight);
  margin: 0 0 4px;
`;

const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: var(--color-grey-500);
  margin: 0 0 32px;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  gap: 12px;
`;

const ErrorBanner = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 0.9375rem;
  color: #dc2626;
`;

const SuccessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 24px 0;
  text-align: center;
`;

const SuccessTitle = styled.h2`
  font-size: 1.375rem;
  font-weight: 700;
  color: var(--color-midnight);
`;

const SuccessText = styled.p`
  font-size: 0.9375rem;
  color: var(--color-grey-500);
`;

function validateStep(step: number, data: AgentRegistrationData, t: (k: string) => string) {
  const errors: Partial<Record<keyof AgentRegistrationData, string>> = {};
  const required = t("form.error.required");

  if (step === 1) {
    if (!data.firstName.trim()) errors.firstName = required;
    if (!data.lastName.trim()) errors.lastName = required;
    if (!data.email.trim()) errors.email = required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = t("form.error.email");
    if (!data.password) errors.password = required;
    else if (data.password.length < 8) errors.password = t("agentRegistration.errors.passwordTooShort");
    if (!data.confirmPassword) errors.confirmPassword = required;
    else if (data.password !== data.confirmPassword) errors.confirmPassword = t("agentRegistration.errors.passwordMismatch");
  }

  if (step === 2) {
    if (!data.organizationName.trim()) errors.organizationName = required;
    if (!data.organizationType) errors.organizationType = required;
  }

  if (step === 3) {
    if (!data.addressStreet.trim()) errors.addressStreet = required;
    if (!data.addressPostcode.trim()) errors.addressPostcode = required;
  }

  return errors;
}

export function AgentRegistration() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AgentRegistrationData>(defaultAgentRegistrationData);
  const [errors, setErrors] = useState<Partial<Record<keyof AgentRegistrationData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: optionLists } = useGetQuery<ApiOptionLists>({
    queryKey: ["options"],
    apiPath: apiPathOption,
  });

  const update = (fields: Partial<AgentRegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    const touchedKeys = Object.keys(fields) as (keyof AgentRegistrationData)[];
    if (touchedKeys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        touchedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      const stepErrors = validateStep(step, formData, t);
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      setErrors({});
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      // Step 1: create user account with role "agent"
      // BE requirement: POST /api/user must allow role: "agent"
      await axios.post(API_PATH_USER, {
        email: formData.email,
        password: formData.password,
        role: UserRole.AGENT,
        person: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      });

      // Step 2: auto-login to obtain session cookie
      await axios.post(apiPathLogin, {
        email: formData.email,
        password: formData.password,
      });
      document.cookie = LOGGED_IN_COOKIE;

      // Step 3: create agent profile
      // BE requirement: POST /api/agent endpoint must be implemented
      await axios.post(apiPathAgent, {
        title: formData.organizationName,
        type: formData.organizationType || undefined,
        info: formData.about || undefined,
        website: formData.website || undefined,
        services: formData.services.length > 0 ? formData.services : undefined,
        addressStreet: formData.addressStreet || undefined,
        addressPostcode: formData.addressPostcode || undefined,
        districtId: formData.districtId ?? undefined,
        languages: formData.clientLanguageIds.length > 0 ? formData.clientLanguageIds : undefined,
      });

      setIsSuccess(true);
      setTimeout(() => {
        const { language } = i18next;
        router.push(`/${language}/dashboard`);
      }, 3000);
    } catch (err) {
      let message = t("message.errorGeneric");
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        message = data?.message || message;
      }
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Wrapper>
        <Card>
          <SuccessWrapper>
            <SuccessTitle>{t("agentRegistration.success.title")}</SuccessTitle>
            <SuccessText>{t("agentRegistration.success.description")}</SuccessText>
          </SuccessWrapper>
        </Card>
      </Wrapper>
    );
  }

  const isLastStep = step === TOTAL_STEPS;

  return (
    <Wrapper>
      <Card>
        <PageTitle>{t("agentRegistration.title")}</PageTitle>
        <PageSubtitle>{t("agentRegistration.subtitle")}</PageSubtitle>

        <ProgressBar currentStep={step} />

        {submitError && <ErrorBanner>{submitError}</ErrorBanner>}

        {step === 1 && <AccountStep data={formData} onChange={update} errors={errors} />}
        {step === 2 && <OrgInfoStep data={formData} onChange={update} errors={errors} />}
        {step === 3 && <AddressStep data={formData} onChange={update} errors={errors} optionLists={optionLists} />}
        {step === 4 && <ServicesStep data={formData} onChange={update} optionLists={optionLists} />}
        {step === 5 && <ReviewStep data={formData} />}

        <Actions>
          {step > 1 ? (
            <Button
              text={t("agentRegistration.back")}
              backgroundcolor="var(--color-white)"
              textColor="var(--color-aubergine)"
              border="1px solid var(--color-aubergine)"
              onClick={handleBack}
              disabled={isSubmitting}
            />
          ) : (
            <div />
          )}

          {isLastStep ? (
            <Button
              text={t("agentRegistration.submit")}
              backgroundcolor="var(--color-aubergine)"
              textColor="var(--color-white)"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          ) : (
            <Button
              text={t("agentRegistration.next")}
              backgroundcolor="var(--color-aubergine)"
              textColor="var(--color-white)"
              onClick={handleNext}
            />
          )}
        </Actions>
      </Card>
    </Wrapper>
  );
}
