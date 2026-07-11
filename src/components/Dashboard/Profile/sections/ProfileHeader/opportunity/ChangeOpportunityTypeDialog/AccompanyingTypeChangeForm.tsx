"use client";
import { useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { type Locale } from "date-fns";
import { Id, OpportunityType, TranslatedIntoType, VolunteerStateTypeType } from "need4deed-sdk";
import styled from "styled-components";
import { AccompanyingDetailsEdit } from "../../../AccompanyingDetails/AccompanyingDetailsEdit";
import {
  createAccompanyingDetailsSchema,
  AccompanyingDetailsFormData,
} from "../../../AccompanyingDetails/createAccompanyingDetailsSchema";
import {
  buildAccompanyingPayload,
  getInitialFormValues,
  getMinAppointmentDate,
} from "../../../AccompanyingDetails/helpers";
import { useApiLanguages } from "../../../VolunteerProfile/hooks";
import { useUpdateOpportunityType } from "@/hooks/useUpdateOpportunityType";
import { TypeChangeButtons } from "./TypeChangeButtons";

type Props = {
  opportunityId: Id;
  locale: Locale;
  onCancel: () => void;
};

export const AccompanyingTypeChangeForm = ({ opportunityId, locale, onCancel }: Props) => {
  const { t } = useTranslation();
  const { data: apiLanguages = [] } = useApiLanguages();
  const { mutateAsync: updateType, isPending } = useUpdateOpportunityType(opportunityId);

  const minAppointmentDate = useMemo(() => getMinAppointmentDate(), []);

  const languageOptions = apiLanguages.map((lang) => lang.title);
  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  apiLanguages.forEach((lang) => {
    keyToLabel[String(lang.id)] = lang.title;
    labelToKey[lang.title] = String(lang.id);
  });

  const appointmentLanguageKeys = Object.values(TranslatedIntoType);
  const appointmentLanguageKeyToLabel: Record<string, string> = {};
  const appointmentLanguageLabelToKey: Record<string, string> = {};
  appointmentLanguageKeys.forEach((key) => {
    const label = t(`dashboard.opportunityProfile.accompanyingDetails.appointmentLanguageOptions.${key}`);
    appointmentLanguageKeyToLabel[key] = label;
    appointmentLanguageLabelToKey[label] = key;
  });
  const appointmentLanguageOptions = appointmentLanguageKeys.map((key) => appointmentLanguageKeyToLabel[key]);

  const methods = useForm<AccompanyingDetailsFormData>({
    resolver: zodResolver(createAccompanyingDetailsSchema(t, true)),
    mode: "onChange",
    defaultValues: getInitialFormValues(undefined),
  });

  useEffect(() => {
    methods.reset(getInitialFormValues(undefined));
  }, [methods]);

  const handleSave = async () => {
    const valid = await methods.trigger();
    if (!valid) return;

    await updateType({
      opportunity_type: VolunteerStateTypeType.ACCOMPANYING as OpportunityType,
      accompanyingDetails: buildAccompanyingPayload(methods.getValues()),
    });
    onCancel();
  };

  return (
    <>
      <AccompanyingSection>
        <AccompanyingSectionTitle>
          {t("dashboard.opportunityProfile.accompanyingDetailsTitle")}
        </AccompanyingSectionTitle>
        <FormProvider {...methods}>
          <AccompanyingDetailsEdit
            locale={locale}
            languageOptions={languageOptions}
            keyToLabel={keyToLabel}
            labelToKey={labelToKey}
            appointmentLanguageOptions={appointmentLanguageOptions}
            appointmentLanguageKeyToLabel={appointmentLanguageKeyToLabel}
            appointmentLanguageLabelToKey={appointmentLanguageLabelToKey}
            onCancel={() => {}}
            onSubmit={() => {}}
            isPending={false}
            minAppointmentDate={minAppointmentDate}
            hideButtons
          />
        </FormProvider>
      </AccompanyingSection>
      <TypeChangeButtons
        onCancel={onCancel}
        onSave={handleSave}
        cancelLabel={t("dashboard.opportunityProfile.typeModal.cancel")}
        saveLabel={t("dashboard.opportunityProfile.typeModal.save")}
        loading={isPending}
      />
    </>
  );
};

const AccompanyingSection = styled.div`
  margin-top: var(--spacing-16);
`;

const AccompanyingSectionTitle = styled.h4`
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-24);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-blue-700);
  margin: 0 0 var(--spacing-12) 0;
`;
