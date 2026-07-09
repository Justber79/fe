"use client";
import { EditableField } from "@/components/EditableField/EditableField";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import {
  useApiActivities,
  useApiLanguages,
  useApiSkills,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import {
  createOpportunityDetailsSchema,
  OpportunityDetailsFormData,
} from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import { AccompanyingDetailsEdit } from "@/components/Dashboard/Profile/sections/AccompanyingDetails/AccompanyingDetailsEdit";
import { BackButton, PageContainer } from "@/components/Dashboard/Profile/styles";
import { IconName } from "@/components/Dashboard/Profile/types";
import {
  Card,
  IconContainer,
  ProfileContent,
  ProfileInfo,
  StatusSection,
  TitleSection,
} from "@/components/Dashboard/Profile/sections/ProfileHeader/common/profileHeaderStyles";
import { createVolunteerTypeLabelMap } from "@/components/Dashboard/Profile/sections/ProfileHeader/common/labelMaps";
import Button from "@/components/core/button/Button/Button";
import { apiPathOpportunity, DashboardRoutes } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2, Heading4 } from "@/components/styled/text";
import { ShootingStarIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { de, enUS } from "date-fns/locale";
import { TranslatedIntoType, VolunteerStateTypeType, OpportunityFormDataWithAgentSubmitter } from "need4deed-sdk";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  createAccompanyingDetailsSchema,
  AccompanyingDetailsFormData,
} from "../Profile/sections/AccompanyingDetails/createAccompanyingDetailsSchema";
import { VolunteerTypeRow, TypeButtons, TypeButton, SaveRow } from "./styled";
import { OpportunityDetailsFields } from "./OpportunityDetailsFields";
import { buildCreatePayload } from "./helper";

// ─── Types ──────────────────────────────────────────────────────────────────

const SELECTABLE_VOLUNTEER_TYPES = [
  VolunteerStateTypeType.REGULAR,
  VolunteerStateTypeType.ACCOMPANYING,
  VolunteerStateTypeType.EVENTS,
] as const;

const createHeaderSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("form.error.required")),
    volunteerType: z.enum([
      VolunteerStateTypeType.REGULAR,
      VolunteerStateTypeType.ACCOMPANYING,
      VolunteerStateTypeType.EVENTS,
    ]),
  });

export type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;

// ─── Main component ──────────────────────────────────────────────────────────

export function NewOpportunity() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const router = useRouter();
  const { agentId } = useGetCurrentAgent();

  const volunteerTypeLabelMap = createVolunteerTypeLabelMap(t);

  const { data: apiLanguages = [] } = useApiLanguages();
  const { data: apiActivities = [] } = useApiActivities();
  const { data: apiSkills = [] } = useApiSkills();

  // Header form: title + volunteerType
  const headerMethods = useForm<HeaderFormData>({
    resolver: zodResolver(createHeaderSchema(t)),
    mode: "onChange",
    defaultValues: { title: "", volunteerType: VolunteerStateTypeType.REGULAR },
  });
  const {
    control: headerControl,
    watch: watchHeader,
    formState: { errors: headerErrors },
  } = headerMethods;
  const selectedType = watchHeader("volunteerType");
  const isAccompanying = selectedType === VolunteerStateTypeType.ACCOMPANYING;
  const isEvent = selectedType === VolunteerStateTypeType.EVENTS;

  // Opportunity details form
  const detailsMethods = useForm<OpportunityDetailsFormData>({
    resolver: zodResolver(createOpportunityDetailsSchema(t)),
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
  const minAppointmentDate = useMemo(() => new Date(), []);

  const { mutate: createOpportunity, isPending } = useMutationQuery<OpportunityFormDataWithAgentSubmitter, unknown>({
    apiPath: `${apiPathOpportunity}/`,
    method: "post",
    onSuccessCallback: () => {
      router.push(`/${lang}${DashboardRoutes.Home}`);
    },
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
      <Card>
        <ProfileContent>
          <IconContainer>
            <ShootingStarIcon size={120} color="var(--color-blue-500)" weight="duotone" />
          </IconContainer>
          <ProfileInfo>
            <TitleSection>
              <Controller
                name="title"
                control={headerControl}
                render={({ field }) => (
                  <EditableField
                    mode="edit"
                    type="text"
                    label={t("dashboard.newOpportunity.fields.title")}
                    value={field.value}
                    setValue={field.onChange}
                    errorMessage={headerErrors.title?.message}
                  />
                )}
              />
            </TitleSection>

            <StatusSection>
              <VolunteerTypeRow>
                <Heading4>{t("dashboard.volunteerProfile.volunteerHeader.volunteerType_title")}</Heading4>
                <TypeButtons>
                  {SELECTABLE_VOLUNTEER_TYPES.map((type) => (
                    <TypeButton
                      key={type}
                      type="button"
                      $active={selectedType === type}
                      onClick={() => headerMethods.setValue("volunteerType", type, { shouldValidate: true })}
                    >
                      {volunteerTypeLabelMap[type]}
                    </TypeButton>
                  ))}
                </TypeButtons>
              </VolunteerTypeRow>
            </StatusSection>
          </ProfileInfo>
        </ProfileContent>
      </Card>

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
