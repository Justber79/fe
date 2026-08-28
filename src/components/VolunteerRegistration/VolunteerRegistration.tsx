"use client";
import { Button } from "@/components/core/button";
import { PageLayout } from "@/components/Layout";
import { apiPathUser, DashboardRoutes } from "@/config/constants";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import axios from "axios";
import { UserRole } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { validateStep } from "@/components/AgentRegistration/helpers";
import { AccountStep } from "@/components/AgentRegistration/steps/AccountStep";
import {
  Actions,
  Card,
  ErrorBanner,
  ExistingUserText,
  ExistingUserWrapper,
  PageSubtitle,
  PageTitle,
  SuccessText,
  SuccessTitle,
  SuccessWrapper,
  Wrapper,
} from "@/components/AgentRegistration/styled";
import { AccountRegistrationData, defaultAccountRegistrationData } from "@/components/AgentRegistration/types";
import Link from "next/link";

const NAMESPACE = "volunteerRegistration";

// Wrapper's own min-height: 100vh would double up with PageLayout's flex: 1
// container, adding a spurious extra viewport of empty space (see the same
// override in AgentRegistration.tsx).
const PageWrapper = styled(Wrapper)`
  min-height: 0;
  flex: 1;
`;

export function VolunteerRegistration() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const user = useCurrentUser(true);
  const [formData, setFormData] = useState<AccountRegistrationData>(defaultAccountRegistrationData);
  const [errors, setErrors] = useState<Partial<Record<keyof AccountRegistrationData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    router.push(`/${i18n.language}${DashboardRoutes.Home}`);
  }, [user, i18n.language, router]);

  const update = (fields: Partial<AccountRegistrationData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    const touchedKeys = Object.keys(fields) as (keyof AccountRegistrationData)[];
    if (touchedKeys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        touchedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    const stepErrors = validateStep(1, formData, t, NAMESPACE);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await axios.post(apiPathUser, {
        email: formData.email,
        password: formData.password,
        role: UserRole.VOLUNTEER,
        person: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      });

      setIsSuccess(true);
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

  if (user) {
    return null;
  }

  if (isSuccess) {
    return (
      <PageLayout>
        <PageWrapper>
          <Card>
            <SuccessWrapper>
              <SuccessTitle>{t(`${NAMESPACE}.checkEmail.title`)}</SuccessTitle>
              <SuccessText>{t(`${NAMESPACE}.checkEmail.description`)}</SuccessText>
            </SuccessWrapper>
          </Card>
        </PageWrapper>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageWrapper>
        <Card>
          <PageTitle>{t(`${NAMESPACE}.title`)}</PageTitle>
          <PageSubtitle>{t(`${NAMESPACE}.subtitle`)}</PageSubtitle>

          <ExistingUserWrapper>
            <ExistingUserText>{t(`${NAMESPACE}.alreadyUser`)}</ExistingUserText>
            <Link href="/login">{t(`${NAMESPACE}.loginLink`)}</Link>
          </ExistingUserWrapper>

          {submitError && <ErrorBanner>{submitError}</ErrorBanner>}

          <AccountStep data={formData} onChange={update} errors={errors} namespace={NAMESPACE} />

          <Actions>
            <div />
            <Button
              text={t(`${NAMESPACE}.next`)}
              backgroundcolor="var(--color-aubergine)"
              textColor="var(--color-white)"
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </Actions>
        </Card>
      </PageWrapper>
    </PageLayout>
  );
}
