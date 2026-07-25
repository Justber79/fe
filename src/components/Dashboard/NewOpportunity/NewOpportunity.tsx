"use client";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import {
  useApiActivities,
  useApiLanguages,
  useApiSkills,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import {
  createNewOpportunityDetailsSchema,
  getMainCommunicationLanguageOptions,
  NewOpportunityDetailsFormData,
} from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { resolveFormLanguageToOption } from "@/components/Dashboard/Profile/sections/OpportunityDetails/formatters";
import { AccompanyingDetailsEdit } from "@/components/Dashboard/Profile/sections/AccompanyingDetails/AccompanyingDetailsEdit";
import { BackButton, PageContainer } from "@/components/Dashboard/Profile/styles";
import { IconName } from "@/components/Dashboard/Profile/types";
import Button from "@/components/core/button/Button/Button";
import { apiPathOpportunity, DashboardRoutes } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { de, enUS } from "date-fns/locale";
import { TranslatedIntoType, VolunteerStateTypeType, OpportunityFormDataWithAgentSubmitter } from "need4deed-sdk";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createAccompanyingDetailsSchema,
  AccompanyingDetailsFormData,
} from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";
import { SaveRow } from "./styled";
import { OpportunityDetailsFields } from "./fields/OpportunityDetailsFields";
import { buildCreatePayload } from "./helper";
import { createHeaderSchema, HeaderFormData } from "./headerSchema";
import OpportunityHeaderCard from "./OpportunityHeaderCard";

export function NewOpportunity() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const router = useRouter();
  const { agentId } = useGetCurrentAgent();

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  // Header form: title + volunteerType
  const headerMethods = useForm<HeaderFormData>({
    resolver: zodResolver(createHeaderSchema(t)),
    mode: "onChange",
    defaultValues: { title: "", volunteerType: VolunteerStateTypeType.REGULAR },
  });
  const { watch: watchHeader } = headerMethods;
  const selectedType = watchHeader("volunteerType");
  const isAccompanying = selectedType === VolunteerStateTypeType.ACCOMPANYING;
  const isEvent = selectedType === VolunteerStateTypeType.EVENTS;

  // Opportunity details form
  const detailsMethods = useForm<NewOpportunityDetailsFormData>({
    resolver: zodResolver(createNewOpportunityDetailsSchema(t, getMainCommunicationLanguageOptions(apiLanguages))),
    mode: "onChange",
    defaultValues: {
      description: "",
      numberOfVolunteers: "1",
      mainCommunication: [{ id: 1, language: "", level: "" }],
      residentsSpeak: [{ id: 1, language: "", level: "" }],
      availability: undefined,
      eventDate: null,
      eventTime: "",
      activities: [],
      skills: [],
    },
  });

  // Accompanying details form (always initialised; only included in payload when type is ACCOMPANYING)
  const accompanyingMethods = useForm<AccompanyingDetailsFormData>({
    resolver: zodResolver(createAccompanyingDetailsSchema(t, true)),
    mode: "onChange",
    defaultValues: {
      appointmentAddress: "",
      appointmentPostcode: "",
      appointmentDate: null,
      appointmentTime: "",
      refugeeNumber: "",
      refugeeName: "",
      refugeeLanguage: [],
      appointmentLanguage: undefined,
    },
  });

  // Accompanying section helpers
  const keyToLabel: Record<string, string> = {};
  const labelToKey: Record<string, string> = {};
  apiLanguages.forEach((l) => {
    keyToLabel[String(l.id)] = l.title;
    labelToKey[l.title] = String(l.id);
  });
  const appointmentLanguageKeys = Object.values(TranslatedIntoType);
  const appointmentLanguageKeyToLabel: Record<string, string> = {};
  const appointmentLanguageLabelToKey: Record<string, string> = {};
  appointmentLanguageKeys.forEach((key) => {
    const label = t(`dashboard.opportunityProfile.accompanyingDetails.appointmentLanguageOptions.${key}`);
    appointmentLanguageKeyToLabel[key] = label;
    appointmentLanguageLabelToKey[label] = key;
  });
  const minAppointmentDate = useMemo(() => getMinAppointmentDate(), []);

  const { mutate: createOpportunity, isPending } = useMutationQuery<OpportunityFormDataWithAgentSubmitter, unknown>({
    apiPath: `${apiPathOpportunity}/`,
    method: "post",
    onSuccessCallback: () => {
      router.push(`/${lang}${DashboardRoutes.Home}`);
    },
    queryKeyToInvalidate: ["agent-opportunities", String(agentId)],
  });

  const handleCreate = async () => {
    const headerValid = await headerMethods.trigger();
    const detailsValid = await detailsMethods.trigger();
    const accompValid = !isAccompanying || (await accompanyingMethods.trigger());
    if (!headerValid || !detailsValid || !accompValid || !agentId) return;

    const payload = buildCreatePayload(
      headerMethods.getValues(),
      detailsMethods.getValues(),
      isAccompanying ? accompanyingMethods.getValues() : null,
      apiLanguages,
      apiActivities,
      apiSkills,
      lang,
      t,
      agentId,
    );
    createOpportunity(payload);
  };

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>

      <Heading2>{t("dashboard.newOpportunity.title")}</Heading2>

      {/* Header card — title input + volunteer type selector */}
      <FormProvider {...headerMethods}>
        <OpportunityHeaderCard selectedType={selectedType} />
      </FormProvider>

      {/* Opportunity Details section */}
      <SectionCard
        iconName={IconName.Wrench}
        title={t("dashboard.opportunityProfile.opportunityDetails.title")}
        subComponent={
          <FormProvider {...detailsMethods}>
            <OpportunityDetailsFields
              isEvent={isEvent}
              apiLanguages={apiLanguages}
              apiActivities={apiActivities}
              apiSkills={apiSkills}
              isAccompanying={isAccompanying}
            />
          </FormProvider>
        }
      />

      {/* Accompanying Details section — only for ACCOMPANYING type */}
      {isAccompanying && (
        <SectionCard
          iconName={IconName.Users}
          title={t("dashboard.opportunityProfile.accompanyingDetailsTitle")}
          subComponent={
            <FormProvider {...accompanyingMethods}>
              <AccompanyingDetailsEdit
                locale={locale}
                languageOptions={apiLanguages.map((l) => l.title)}
                keyToLabel={keyToLabel}
                labelToKey={labelToKey}
                appointmentLanguageOptions={appointmentLanguageKeys.map((k) => appointmentLanguageKeyToLabel[k])}
                appointmentLanguageKeyToLabel={appointmentLanguageKeyToLabel}
                appointmentLanguageLabelToKey={appointmentLanguageLabelToKey}
                onCancel={() => {}}
                onSubmit={() => {}}
                isPending={false}
                minAppointmentDate={minAppointmentDate}
                hideButtons
              />
            </FormProvider>
          }
        />
      )}

      <SaveRow>
        <Button
          text={t("dashboard.newOpportunity.submit")}
          backgroundcolor="var(--color-aubergine)"
          textColor="var(--color-white)"
          onClick={handleCreate}
          disabled={isPending || !agentId}
        />
      </SaveRow>
    </PageContainer>
  );
}
