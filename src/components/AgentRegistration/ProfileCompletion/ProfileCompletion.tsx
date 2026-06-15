"use client";
import { Button } from "@/components/core/button";
import { FormInput } from "@/components/core/common";
import { apiPathAgentRegister, apiPathOption, LOGGED_IN_COOKIE } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import axios from "axios";
import i18next from "i18next";
import {
  AgentMembershipStatus,
  ApiAgentRegister,
  ApiAgentRegisterNew,
  ApiAgentRegisterResponse,
  ApiOptionLists,
} from "need4deed-sdk";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { validateCompletionStep } from "../helpers";
import { ProgressBar } from "../ProgressBar";
import { AddressStep } from "../steps/AddressStep";
import { OrgInfoStep } from "../steps/OrgInfoStep";
import { ServicesStep } from "../steps/ServicesStep";
import {
  Actions,
  Card,
  ErrorBanner,
  FieldLabel,
  FieldWrapper,
  PageSubtitle,
  PageTitle,
  StepDescription,
  StepTitle,
  SuccessText,
  SuccessTitle,
  SuccessWrapper,
  Wrapper,
} from "../styled";
import { defaultProfileCompletionData, ProfileCompletionData, TOTAL_COMPLETION_STEPS } from "../types";
import { CheckMark, MatchBanner, MatchActions, SmallButton } from "./styled";
import { useAgentAddressLookup } from "./useAgentAddressLookup";

function buildNewAgent(formData: ProfileCompletionData): ApiAgentRegisterNew {
  return {
    title: formData.organizationName,
    // `info`/`languages: number[]` follow the registration contract — these
    // deliberately differ from the agent PATCH shape (`about`/`OptionById[]`).
    type: formData.organizationType || undefined,
    info: formData.about || undefined,
    website: formData.website || undefined,
    services: formData.services.length > 0 ? formData.services : undefined,
    addressStreet: formData.addressStreet || undefined,
    addressPostcode: formData.addressPostcode || undefined,
    districtId: formData.districtId ?? undefined,
    languages: formData.clientLanguageIds.length > 0 ? formData.clientLanguageIds : undefined,
  };
}

export function ProfileCompletion() {
  const { t } = useTranslation();
  const router = useRouter();
  const token = useSearchParams().get("token");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileCompletionData>(defaultProfileCompletionData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileCompletionData, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pending, setPending] = useState(false);
  // When a CREATE collides with an existing title, the API returns its id so we
  // can offer to JOIN it instead.
  const [titleConflictAgentId, setTitleConflictAgentId] = useState<number | null>(null);
  const errorBannerRef = useRef<HTMLDivElement>(null);

  const { data: optionLists } = useGetQuery<ApiOptionLists>({
    queryKey: ["options"],
    apiPath: apiPathOption,
  });

  const { matched, selectedAgent, showBanner, confirmMatch, dismissMatch } = useAgentAddressLookup(
    formData.addressStreet,
    token,
    (m) => update({ addressStreet: m.title }),
  );

  const showSubmitError = useCallback((message: string) => {
    setSubmitError(message);
    requestAnimationFrame(() => {
      errorBannerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, []);

  useEffect(() => {
    if (!token) showSubmitError(t("agentRegistration.errors.missingToken"));
  }, [token, t, showSubmitError]);

  const update = (fields: Partial<ProfileCompletionData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
    const touchedKeys = Object.keys(fields) as (keyof ProfileCompletionData)[];
    if (touchedKeys.some((k) => errors[k])) {
      setErrors((prev) => {
        const next = { ...prev };
        touchedKeys.forEach((k) => delete next[k]);
        return next;
      });
    }
  };

  const submit = async (body: ApiAgentRegister) => {
    if (!token) {
      showSubmitError(t("agentRegistration.errors.missingToken"));
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const { data } = await axios.post<{ message: string; data: ApiAgentRegisterResponse }>(
        `${apiPathAgentRegister}?token=${encodeURIComponent(token)}`,
        body,
      );
      const status = data?.data?.membershipStatus;
      if (status === AgentMembershipStatus.PENDING) {
        setPending(true);
        return;
      }
      document.cookie = LOGGED_IN_COOKIE;
      router.push(`/${i18next.language}/dashboard`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        const conflictAgentId = (err.response.data as { agentId?: number })?.agentId;
        setTitleConflictAgentId(conflictAgentId ?? null);
        return;
      }
      showSubmitError(t("message.errorGeneric"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // JOIN an existing agent (picked from the street lookup, or accepted from a
  // title conflict). Membership lands ACTIVE on email-domain match, else PENDING.
  const submitJoin = (agentId: number) => submit({ agentId });

  const handleSubmit = () => {
    // Joining an existing agent submits only { agentId } — the create-form
    // (street/postcode/org) validation must not run, or the missing postcode
    // blocks the join.
    if (selectedAgent) {
      submitJoin(selectedAgent.id);
      return;
    }
    const stepErrors = validateCompletionStep(step, formData, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    submit({ agent: buildNewAgent(formData) });
  };

  const handleNext = () => {
    const stepErrors = validateCompletionStep(step, formData, t);
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

  if (pending) {
    return (
      <Wrapper>
        <Card>
          <SuccessWrapper>
            <SuccessTitle>{t("agentRegistration.pending.title")}</SuccessTitle>
            <SuccessText>{t("agentRegistration.pending.description")}</SuccessText>
          </SuccessWrapper>
        </Card>
      </Wrapper>
    );
  }

  // A picked agent (or accepted title conflict) is a JOIN: submit the membership
  // request directly without the create-only org/services steps.
  const isJoining = !!selectedAgent;
  const isLastStep = step === TOTAL_COMPLETION_STEPS;
  const tokenMissing = !token;

  return (
    <Wrapper>
      <Card>
        <PageTitle>{t("agentRegistration.completion.title")}</PageTitle>
        <PageSubtitle>{t("agentRegistration.completion.subtitle")}</PageSubtitle>

        {!isJoining && <ProgressBar currentStep={step} totalSteps={TOTAL_COMPLETION_STEPS} />}

        {submitError && <ErrorBanner ref={errorBannerRef}>{submitError}</ErrorBanner>}

        {titleConflictAgentId !== null && (
          <MatchBanner $matched={false}>
            <span>{t("agentRegistration.completion.titleTaken")}</span>
            <MatchActions>
              <SmallButton $primary onClick={() => submitJoin(titleConflictAgentId)}>
                {t("agentRegistration.completion.joinInstead")}
              </SmallButton>
              <SmallButton onClick={() => setTitleConflictAgentId(null)}>
                {t("agentRegistration.completion.skip")}
              </SmallButton>
            </MatchActions>
          </MatchBanner>
        )}

        {step === 1 &&
          (isJoining ? (
            // Picked an existing org: this is a membership request, not an edit.
            // Show a clear read-only confirmation + an undo back to creating.
            <div>
              <StepTitle>{t("agentRegistration.completion.joinTitle")}</StepTitle>
              <MatchBanner $matched>
                <CheckMark>✓</CheckMark>
                <span>{t("agentRegistration.completion.joiningOrg", { name: selectedAgent?.title })}</span>
              </MatchBanner>
              <StepDescription>{t("agentRegistration.completion.joinDescription")}</StepDescription>
              <MatchActions>
                <SmallButton onClick={dismissMatch}>{t("agentRegistration.completion.createInstead")}</SmallButton>
              </MatchActions>
            </div>
          ) : (
            <div>
              <StepTitle>{t("agentRegistration.steps.address.title")}</StepTitle>
              <StepDescription>{t("agentRegistration.steps.address.description")}</StepDescription>
              <FieldWrapper>
                <FieldLabel>{t("agentRegistration.fields.addressStreet")}</FieldLabel>
                <FormInput
                  value={formData.addressStreet}
                  onInputChange={(v) => update({ addressStreet: v })}
                  placeHolder={t("agentRegistration.fields.addressStreet")}
                  errors={errors.addressStreet ? [errors.addressStreet] : []}
                />
                {showBanner && (
                  <MatchBanner $matched={false}>
                    <span>{t("agentRegistration.completion.matchFound", { name: matched!.title })}</span>
                    <MatchActions>
                      <SmallButton $primary onClick={confirmMatch}>
                        {t("agentRegistration.completion.useThisOrg")}
                      </SmallButton>
                      <SmallButton onClick={dismissMatch}>{t("agentRegistration.completion.skip")}</SmallButton>
                    </MatchActions>
                  </MatchBanner>
                )}
              </FieldWrapper>
              <AddressStep data={formData} onChange={update} errors={errors} optionLists={optionLists} hideStreet />
            </div>
          ))}

        {!isJoining && step === 2 && <OrgInfoStep data={formData} onChange={update} errors={errors} />}
        {!isJoining && step === 3 && <ServicesStep data={formData} onChange={update} optionLists={optionLists} />}

        <Actions>
          {!isJoining && step > 1 ? (
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

          {isJoining || isLastStep ? (
            <Button
              text={isJoining ? t("agentRegistration.completion.requestToJoin") : t("agentRegistration.submit")}
              backgroundcolor="var(--color-aubergine)"
              textColor="var(--color-white)"
              onClick={handleSubmit}
              disabled={isSubmitting || tokenMissing}
            />
          ) : (
            <Button
              text={t("agentRegistration.next")}
              backgroundcolor="var(--color-aubergine)"
              textColor="var(--color-white)"
              onClick={handleNext}
              disabled={tokenMissing}
            />
          )}
        </Actions>
      </Card>
    </Wrapper>
  );
}
