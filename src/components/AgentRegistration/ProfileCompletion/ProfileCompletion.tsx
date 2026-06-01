"use client";
import { Button } from "@/components/core/button";
import { FormInput } from "@/components/core/common";
import { apiPathAgent, apiPathOption, LOGGED_IN_COOKIE } from "@/config/constants";
import { useGetQuery, useMutationQuery } from "@/hooks";
import i18next from "i18next";
import { ApiAgentGet, ApiOptionLists } from "need4deed-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  Wrapper,
} from "../styled";
import { defaultProfileCompletionData, ProfileCompletionData, TOTAL_COMPLETION_STEPS } from "../types";
import { CheckMark, MatchBanner, MatchActions, SmallButton } from "./styled";
import { useAgentAddressLookup } from "./useAgentAddressLookup";

type CreateAgentBody = {
  title: string;
  type?: string;
  info?: string;
  website?: string;
  services?: string[];
  addressStreet?: string;
  addressPostcode?: string;
  districtId?: number;
  languages?: number[];
};

export function ProfileCompletion() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ProfileCompletionData>(defaultProfileCompletionData);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileCompletionData, string>>>({});

  const { data: optionLists } = useGetQuery<ApiOptionLists>({
    queryKey: ["options"],
    apiPath: apiPathOption,
  });

  const { matched, isMatch, showBanner, confirmMatch, dismissMatch } = useAgentAddressLookup(
    formData.addressStreet,
  );

  const { mutate: createAgent, isPending, error: mutationError } = useMutationQuery<
    CreateAgentBody,
    { message: string; data: ApiAgentGet }
  >({
    apiPath: `${apiPathAgent}/`,
    method: "post",
    queryKeyToInvalidate: ["agents"],
    onSuccessCallback: () => {
      document.cookie = LOGGED_IN_COOKIE;
      router.push(`/${i18next.language}/dashboard`);
    },
  });

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

  const handleMatchAccept = () => {
    if (!matched) return;
    confirmMatch();
    update({
      organizationName: matched.title,
      organizationType: matched.type,
      districtId: matched.district?.id ?? null,
    });
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

  const handleSubmit = () => {
    const stepErrors = validateCompletionStep(step, formData, t);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    createAgent({
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
  };

  const isLastStep = step === TOTAL_COMPLETION_STEPS;

  return (
    <Wrapper>
      <Card>
        <PageTitle>{t("agentRegistration.completion.title")}</PageTitle>
        <PageSubtitle>{t("agentRegistration.completion.subtitle")}</PageSubtitle>

        <ProgressBar currentStep={step} totalSteps={TOTAL_COMPLETION_STEPS} />

        {mutationError && <ErrorBanner>{t("message.errorGeneric")}</ErrorBanner>}

        {step === 1 && (
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
                    <SmallButton $primary onClick={handleMatchAccept}>
                      {t("agentRegistration.completion.useThisOrg")}
                    </SmallButton>
                    <SmallButton onClick={dismissMatch}>{t("agentRegistration.completion.skip")}</SmallButton>
                  </MatchActions>
                </MatchBanner>
              )}
              {isMatch && (
                <MatchBanner $matched>
                  <CheckMark>✓</CheckMark>
                  <span>{t("agentRegistration.completion.matched", { name: matched?.title })}</span>
                </MatchBanner>
              )}
            </FieldWrapper>
            <AddressStep
              data={formData}
              onChange={update}
              errors={errors}
              optionLists={optionLists}
              hideStreet
            />
          </div>
        )}

        {step === 2 && <OrgInfoStep data={formData} onChange={update} errors={errors} />}
        {step === 3 && <ServicesStep data={formData} onChange={update} optionLists={optionLists} />}

        <Actions>
          {step > 1 ? (
            <Button
              text={t("agentRegistration.back")}
              backgroundcolor="var(--color-white)"
              textColor="var(--color-aubergine)"
              border="1px solid var(--color-aubergine)"
              onClick={handleBack}
              disabled={isPending}
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
              disabled={isPending}
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
