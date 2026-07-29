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
import { validateRACEmail } from "@/components/forms/validators";
import { validateStep } from "./helpers";
import { AccountStep } from "./steps/AccountStep";
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
} from "./styled";
import { AgentRegistrationData, defaultAgentRegistrationData } from "./types";
import Link from "next/link";

const PENDING_ROLE_COOKIE = "n4d_pending_role=agent; path=/; max-age=86400; SameSite=Lax; Secure";

// Wrapper's own min-height: 100vh would double up with PageLayout's flex: 1
// container (which already fills the viewport minus header/footer), adding
// a spurious extra viewport of empty space. Override it only here — the
// other consumer of Wrapper (ProfileCompletion) isn't rendered inside PageLayout.
const PageWrapper = styled(Wrapper)`
  min-height: 0;
  flex: 1;
`;

export function AgentRegistration() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const user = useCurrentUser(true);
  const [formData, setFormData] = useState<AgentRegistrationData>(defaultAgentRegistrationData);
  const [errors, setErrors] = useState<Partial<Record<keyof AgentRegistrationData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    router.push(`/${i18n.language}${DashboardRoutes.Home}`);
  }, [user, i18n.language, router]);

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

  const handleSubmit = async () => {
    const stepErrors = validateStep(1, formData, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const domainError = await validateRACEmail(formData.email, t("agentRegistration.errors.emailDomainNotAllowed"));
      if (domainError) {
        setErrors((prev) => ({ ...prev, email: domainError }));
        setIsSubmitting(false);
        return;
      }

      await axios.post(apiPathUser, {
        email: formData.email,
        password: formData.password,
        role: UserRole.AGENT,
        person: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
        },
      });

      document.cookie = PENDING_ROLE_COOKIE;
      setIsSuccess(true);
    } catch (err) {
      let message = t("message.errorGeneric");
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { error?: string; message?: string } | undefined;
        message =
          data?.error === "InvalidOrganizationEmailError"
            ? t("agentRegistration.errors.invalidOrganizationEmail")
            : (data?.message ?? message);
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
              <SuccessTitle>{t("agentRegistration.checkEmail.title")}</SuccessTitle>
              <SuccessText>{t("agentRegistration.checkEmail.description")}</SuccessText>
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
          <PageTitle>{t("agentRegistration.title")}</PageTitle>
          <PageSubtitle>{t("agentRegistration.subtitle")}</PageSubtitle>

          <ExistingUserWrapper>
            <ExistingUserText>{t("agentRegistration.alreadyUser")}</ExistingUserText>
            <Link href="/login">{t("agentRegistration.loginLink")}</Link>
          </ExistingUserWrapper>

          {submitError && <ErrorBanner>{submitError}</ErrorBanner>}

          <AccountStep data={formData} onChange={update} errors={errors} />

          <Actions>
            <div />
            <Button
              text={t("agentRegistration.next")}
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
