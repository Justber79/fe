"use client";
import { Button } from "@/components/core/button";
import { apiPathAgent, apiPathLogin, apiPathOption, apiPathUser, LOGGED_IN_COOKIE } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import axios from "axios";
import i18next from "i18next";
import { ApiOptionLists, UserRole } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { validateStep } from "./helpers";
import { ProgressBar } from "./ProgressBar";
import { AccountStep } from "./steps/AccountStep";
import { AddressStep } from "./steps/AddressStep";
import { OrgInfoStep } from "./steps/OrgInfoStep";
import { ReviewStep } from "./steps/ReviewStep";
import { ServicesStep } from "./steps/ServicesStep";
import {
  Actions,
  Card,
  ErrorBanner,
  PageSubtitle,
  PageTitle,
  SuccessText,
  SuccessTitle,
  SuccessWrapper,
  Wrapper,
} from "./styled";
import { AgentRegistrationData, defaultAgentRegistrationData, TOTAL_STEPS } from "./types";

// NOTE: Two BE changes are required before this flow is fully functional:
// 1. POST /api/user must allow role: "agent" (currently only "user" | "admin" are permitted)
// 2. POST /api/agent endpoint must be created (currently only GET/PATCH/DELETE exist)

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
    const stepErrors = validateStep(step, formData, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await axios.post(apiPathUser, {
        email: formData.email,
        password: formData.password,
        role: UserRole.AGENT,
        person: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      });

      await axios.post(apiPathLogin, {
        email: formData.email,
        password: formData.password,
      });
      document.cookie = LOGGED_IN_COOKIE;

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
        router.push(`/${i18next.language}/dashboard`);
      }, 3000);
    } catch (err) {
      let message = t("message.errorGeneric");
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        message = data?.message ?? message;
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
