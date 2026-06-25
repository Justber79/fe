"use client";
import { EditableField } from "@/components/EditableField/EditableField";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import { apiToFormAvailability } from "@/components/Dashboard/Profile/sections/VolunteerProfile/availabilityUtils";
import {
  ApiLanguageOption,
  useApiActivities,
  useApiLanguages,
  useApiSkills,
} from "@/components/Dashboard/Profile/sections/VolunteerProfile/hooks";
import { createMapping } from "@/components/Dashboard/Profile/sections/VolunteerProfile/mappingUtils";
import {
  createOpportunityDetailsSchema,
  OpportunityDetailsFormData,
} from "@/components/Dashboard/Profile/sections/OpportunityDetails/opportunityDetailsSchema";
import {
  AccompanyingDetailsFormData,
  accompanyingDetailsSchema,
} from "@/components/Dashboard/Profile/sections/AccompanyingDetails/accompanyingDetailsSchema";
import { AccompanyingDetailsEdit } from "@/components/Dashboard/Profile/sections/AccompanyingDetails/AccompanyingDetailsEdit";
import { FormDetails } from "@/components/Dashboard/Profile/sections/shared/styles";
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
import { DatePickerWithLabel } from "@/components/core/common/DatePicker";
import { ErrorMessage } from "@/components/core/common";
import { AvailabilityGrid } from "@/components/forms/AvailabilityGrid/AvailabilityGrid";
import { LanguageFields } from "@/components/forms/LanguageFields";
import { apiPathOpportunity, DashboardRoutes, MAX_DESCRIPTION_LENGTH } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2, Heading4 } from "@/components/styled/text";
import { ShootingStarIcon, ArrowLeftIcon } from "@phosphor-icons/react";
import { de, enUS } from "date-fns/locale";
import { TFunction } from "i18next";
import { Lang, OptionItem, TranslatedIntoType, VolunteerStateTypeType } from "need4deed-sdk";

// Not yet in need4deed-sdk — defined locally until the SDK is updated.
type OpportunityFormDataWithAgentSubmitter = {
  title: string;
  opportunity_type: "accompanying" | "volunteering";
  vo_information: string | null;
  volunteers_number: number;
  languages: string[];
  activities: string[];
  skills: string[];
  timeslots: [number, string][] | null;
  onetime_date_time: string | null;
  accomp_address: string | null;
  accomp_postcode: string | null;
  accomp_datetime: string | null;
  accomp_name: string | null;
  accomp_phone: string | null;
  accomp_information: string | null;
  accomp_translation: `${TranslatedIntoType}` | null;
  berlin_locations: string[] | null;
  category: string;
  category_id: string;
  language: `${Lang}`;
  agent_id: number;
  submitted_by_id: number | null;
  last_edited_time_notion: string | null;
};
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { z } from "zod";

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

type HeaderFormData = z.infer<ReturnType<typeof createHeaderSchema>>;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toLangOptionItems(
  formLangs: { language: string }[],
  apiLanguages: ApiLanguageOption[],
  t: TFunction,
): OptionItem[] {
  return formLangs.flatMap(({ language }) => {
    if (!language) return [];
    const numId = Number(language);
    if (!isNaN(numId) && numId > 0) {
      const found = apiLanguages.find((a) => a.id === numId);
      return found ? [{ id: found.id, title: found.title }] : [];
    }
    const found = apiLanguages.find((a) => {
      if (a.title === language || a.title.toLowerCase() === language.toLowerCase()) return true;
      const key = `languageNames.${a.title.toLowerCase()}`;
      const translated = t(key);
      return translated !== key && translated === language;
    });
    return found ? [{ id: found.id, title: found.title }] : [];
  });
}

function toOptionItems(ids: string[], apiItems: ApiLanguageOption[]): OptionItem[] {
  const map = new Map(apiItems.map((i) => [i.id, i.title]));
  return ids.flatMap((id) => {
    const numId = Number(id);
    const title = map.get(numId);
    return title ? [{ id: numId, title }] : [];
  });
}

function availabilityToTimeslots(availability: OpportunityDetailsFormData["availability"]): [number, string][] {
  return (availability ?? []).flatMap(({ weekday, timeSlots }) =>
    timeSlots
      .filter((ts) => ts.selected)
      .map((ts) => {
        const slotId = weekday === 0 ? ts.id.charAt(0).toUpperCase() + ts.id.slice(1) : ts.id;
        return [weekday, slotId] as [number, string];
      }),
  );
}

function buildCreatePayload(
  headerData: HeaderFormData,
  detailsData: OpportunityDetailsFormData,
  accompData: AccompanyingDetailsFormData | null,
  apiLanguages: ApiLanguageOption[],
  apiActivities: ApiLanguageOption[],
  apiSkills: ApiLanguageOption[],
  lang: string,
  t: TFunction,
  agentId: number,
): OpportunityFormDataWithAgentSubmitter {
  const isEvent = headerData.volunteerType === VolunteerStateTypeType.EVENTS;
  const isAccompanying = headerData.volunteerType === VolunteerStateTypeType.ACCOMPANYING;

  const mainLangIds = toLangOptionItems(detailsData.mainCommunication, apiLanguages, t).map((i) => String(i.id));
  const residentsLangIds = toLangOptionItems(detailsData.residentsSpeak, apiLanguages, t).map((i) => String(i.id));
  const refugeeLangIds = (accompData?.refugeeLanguage ?? []).map(String).filter(Boolean);
  const languages = [...new Set([...mainLangIds, ...residentsLangIds, ...refugeeLangIds])];

  const activities = toOptionItems(detailsData.activities, apiActivities).map((i) => String(i.id));
  const skills = toOptionItems(detailsData.skills, apiSkills).map((i) => String(i.id));
  const timeslots = isEvent ? null : availabilityToTimeslots(detailsData.availability);

  const onetime_date_time =
    isEvent && detailsData.eventDate
      ? `${detailsData.eventDate.toISOString().split("T")[0]}T${detailsData.eventTime || "00:00"}:00`
      : null;

  const accomp_datetime =
    isAccompanying && accompData?.appointmentDate
      ? `${accompData.appointmentDate.toISOString().split("T")[0]}T${accompData.appointmentTime || "00:00"}:00`
      : null;

  return {
    title: headerData.title,
    opportunity_type: isAccompanying ? "accompanying" : "volunteering",
    vo_information: detailsData.description || null,
    volunteers_number: Number(detailsData.numberOfVolunteers) || 1,
    languages,
    activities,
    skills,
    timeslots,
    onetime_date_time,
    accomp_address: isAccompanying ? (accompData?.appointmentAddress ?? null) : null,
    accomp_postcode: isAccompanying ? (accompData?.appointmentPostcode ?? null) : null,
    accomp_datetime,
    accomp_name: isAccompanying ? (accompData?.refugeeName ?? null) : null,
    accomp_phone: isAccompanying ? (accompData?.refugeeNumber ?? null) : null,
    accomp_information: null,
    accomp_translation: isAccompanying ? (accompData?.appointmentLanguage ?? null) : null,
    berlin_locations: null,
    category: "",
    category_id: "",
    language: lang as `${Lang}`,
    agent_id: agentId,
    submitted_by_id: null,
    last_edited_time_notion: null,
  };
}

// ─── Opportunity Details fields ───────────────────────────────────────────────

function OpportunityDetailsFields({
  isEvent,
  apiLanguages,
  apiActivities,
  apiSkills,
}: {
  isEvent: boolean;
  apiLanguages: ApiLanguageOption[];
  apiActivities: ApiLanguageOption[];
  apiSkills: ApiLanguageOption[];
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const locale = lang === "de" ? de : enUS;
  const prefix = "dashboard.opportunityProfile.opportunityDetails";

  const {
    control,
    formState: { errors },
  } = useFormContext<OpportunityDetailsFormData>();

  const activityMapping = createMapping(apiActivities);
  const skillMapping = createMapping(apiSkills);
  const languagesForForm = apiLanguages.map((l) => ({
    id: l.id,
    title: { [lang as Lang]: l.title } as Record<Lang, string>,
  }));

  return (
    <FormDetails>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <EditableField
            mode="edit"
            type="textarea"
            label={t(`${prefix}.description`)}
            value={field.value}
            setValue={field.onChange}
            maxLength={MAX_DESCRIPTION_LENGTH}
            hint={t(`${prefix}.descriptionHint`, { max: MAX_DESCRIPTION_LENGTH })}
            errorMessage={errors.description?.message}
          />
        )}
      />

      <Controller
        name="mainCommunication"
        control={control}
        render={({ field, fieldState }) => (
          <FieldGroup>
            <label>{t(`${prefix}.mainCommunication`)}</label>
            <div>
              <LanguageFields
                languages={field.value}
                onChange={field.onChange}
                t={t}
                availableLanguages={languagesForForm}
                showLevel={false}
              />
              {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
            </div>
          </FieldGroup>
        )}
      />

      <Controller
        name="residentsSpeak"
        control={control}
        render={({ field, fieldState }) => (
          <FieldGroup>
            <label>{t(`${prefix}.residentsSpeak`)}</label>
            <div>
              <LanguageFields
                languages={field.value}
                onChange={field.onChange}
                t={t}
                availableLanguages={languagesForForm}
                showLevel={false}
              />
              {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
            </div>
          </FieldGroup>
        )}
      />

      {isEvent ? (
        <>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => (
              <DateFieldRow>
                <label>{t(`${prefix}.eventDate`)}</label>
                <DatePickerContainer>
                  <DatePickerWithLabel
                    date={field.value ?? undefined}
                    onSelect={(d) => field.onChange(d ?? null)}
                    locale={locale}
                    allowFuture
                  />
                </DatePickerContainer>
              </DateFieldRow>
            )}
          />
          <Controller
            name="eventTime"
            control={control}
            render={({ field }) => (
              <DateFieldRow>
                <label htmlFor="new-opp-eventTime">{t(`${prefix}.eventTime`)}</label>
                <TimeInputWrapper>
                  <TimeInput
                    id="new-opp-eventTime"
                    type="time"
                    value={field.value || ""}
                    onChange={field.onChange}
                    $hasError={!!errors.eventTime}
                  />
                </TimeInputWrapper>
              </DateFieldRow>
            )}
          />
        </>
      ) : (
        <Controller
          name="availability"
          control={control}
          render={({ field, fieldState }) => (
            <FieldGroup>
              <label>{t(`${prefix}.schedule`)}</label>
              <div>
                <AvailabilityGrid
                  availability={field.value ?? apiToFormAvailability(undefined)}
                  onChange={field.onChange}
                  t={t}
                  currentLanguage={lang as Lang}
                />
                {fieldState.error?.message && <ErrorMessage message={fieldState.error.message} />}
              </div>
            </FieldGroup>
          )}
        />
      )}

      <Controller
        name="numberOfVolunteers"
        control={control}
        render={({ field }) => (
          <EditableField
            mode="edit"
            type="stepper"
            label={t(`${prefix}.numberOfVolunteers`)}
            value={field.value}
            setValue={field.onChange}
            errorMessage={errors.numberOfVolunteers?.message}
          />
        )}
      />

      <Controller
        name="activities"
        control={control}
        render={({ field }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t(`${prefix}.activities`)}
            value={field.value.map((id) => activityMapping.idToTitle[Number(id)] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(activityMapping.titleToId[label])));
            }}
            options={apiActivities.map((a) => a.title)}
            errorMessage={errors.activities?.message}
          />
        )}
      />

      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <EditableField
            mode="edit"
            type="checkbox-list"
            label={t(`${prefix}.skills`)}
            value={field.value.map((id) => skillMapping.idToTitle[Number(id)] || String(id))}
            setValue={(value) => {
              const labels = Array.isArray(value) ? value : [value];
              field.onChange(labels.map((label) => String(skillMapping.titleToId[label])));
            }}
            options={apiSkills.map((s) => s.title)}
            errorMessage={errors.skills?.message}
          />
        )}
      />
    </FormDetails>
  );
}

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
    handleSubmit: handleHeaderSubmit,
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
    resolver: zodResolver(accompanyingDetailsSchema),
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

  const onSubmit = (headerData: HeaderFormData) => {
    // Don't create an opportunity that isn't linked to its agent.
    if (!agentId) return;
    const payload = buildCreatePayload(
      headerData,
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
          onClick={handleHeaderSubmit(onSubmit)}
          disabled={isPending || !agentId}
        />
      </SaveRow>
    </PageContainer>
  );
}

// ─── Styled components ───────────────────────────────────────────────────────

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const VolunteerTypeRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-blue-50);

  h4 {
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-bold);
    color: var(--color-blue-700);
    margin: 0;
    flex-shrink: 0;
  }
`;

const TypeButtons = styled.div`
  display: flex;
  gap: var(--spacing-8);
  flex-wrap: wrap;
`;

const TypeButton = styled.button<{ $active: boolean }>`
  padding: var(--spacing-8) var(--spacing-16);
  border-radius: var(--border-radius-sm);
  border: 2px solid var(--color-aubergine);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: var(--transition-all);
  background-color: ${({ $active }) => ($active ? "var(--color-aubergine)" : "var(--color-white)")};
  color: ${({ $active }) => ($active ? "var(--color-white)" : "var(--color-aubergine)")};

  &:hover {
    opacity: var(--opacity-hover);
  }
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-8);
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-100);
  width: 100%;

  > label {
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
  }
`;

const DateFieldRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: var(--spacing-16) 0;
  border-bottom: var(--border-width-thin) solid var(--color-grey-100);
  gap: var(--spacing-16);
  width: 100%;

  > label {
    font-size: var(--editableField-fieldWrapper-label-fontSize);
    font-weight: var(--editableField-fieldWrapper-label-fontWeight);
    flex-shrink: 0;
    width: var(--editableField-fieldWrapper-label-width);
  }
`;

const DatePickerContainer = styled.div`
  flex: 1;
`;

const TimeInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
`;

const TimeInput = styled.input<{ $hasError?: boolean }>`
  padding: var(--spacing-8) var(--spacing-12);
  border: ${({ $hasError }) => ($hasError ? "1px solid var(--color-error)" : "1px solid var(--color-grey-300)")};
  border-radius: var(--border-radius-xs);
  font-size: var(--font-size-lg);
  color: var(--color-midnight);
`;
