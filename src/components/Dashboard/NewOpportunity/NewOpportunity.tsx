"use client";
import { EditableField } from "@/components/EditableField/EditableField";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import { useEnumTranslation } from "@/components/Dashboard/Profile/sections/ContactDetails/shared";
import { FormDetails } from "@/components/Dashboard/Profile/sections/shared/styles";
import { BackButton, PageContainer } from "@/components/Dashboard/Profile/styles";
import { IconName } from "@/components/Dashboard/Profile/types";
import Button from "@/components/core/button/Button/Button";
import { apiPathOpportunity, DashboardRoutes, PHONE_NUMBER_REGEX } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet, PreferredCommunicationType } from "need4deed-sdk";
import i18next from "i18next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { z } from "zod";

const WAYS_TO_CONTACT_TYPES = Object.values(PreferredCommunicationType);

const createSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("form.error.required")),
    name: z.string().min(1, t("dashboard.opportunityProfile.contactDetails.validation.nameRequired")),
    phone: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.phoneRequired"))
      .regex(PHONE_NUMBER_REGEX, t("dashboard.opportunityProfile.contactDetails.validation.phoneInvalid")),
    email: z
      .string()
      .min(1, t("dashboard.opportunityProfile.contactDetails.validation.emailRequired"))
      .email(t("dashboard.opportunityProfile.contactDetails.validation.emailInvalid")),
    waysToContact: z.array(z.nativeEnum(PreferredCommunicationType)).optional(),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

type CreateOpportunityBody = {
  title: string;
  contact: { name: string; phone: string; email: string };
  agentId?: number;
};

export function NewOpportunity() {
  const { t } = useTranslation();
  const router = useRouter();
  const { agent } = useGetCurrentAgent();
  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    WAYS_TO_CONTACT_TYPES,
    "dashboard.opportunityProfile.contactDetails.waysToContact",
  );

  const methods = useForm<FormData>({
    resolver: zodResolver(createSchema(t)),
    mode: "onChange",
    defaultValues: { title: "", name: "", phone: "", email: "", waysToContact: [] },
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = methods;

  useEffect(() => {
    if (!agent?.representative) return;
    const rep = agent.representative;
    reset(
      { title: "", name: rep.firstName ?? "", phone: rep.phone ?? "", email: rep.email ?? "", waysToContact: [] },
      { keepDirtyValues: true },
    );
  }, [agent, reset]);

  const { mutate: createOpportunity, isPending } = useMutationQuery<
    CreateOpportunityBody,
    { message: string; data: ApiOpportunityGet }
  >({
    apiPath: `${apiPathOpportunity}/`,
    method: "post",
    onSuccessCallback: (response) => {
      const id = response?.data?.id;
      if (id) router.push(`/${i18next.language}${DashboardRoutes.Opportunities}/${id}`);
    },
  });

  const onSubmit = (values: FormData) => {
    createOpportunity({
      title: values.title,
      contact: { name: values.name, phone: values.phone, email: values.email },
      agentId: agent?.id,
    });
  };

  return (
    <PageContainer>
      <BackButton onClick={() => router.back()}>
        <ArrowLeftIcon size={24} />
        {t("dashboard.volunteerProfile.backToDashboard")}
      </BackButton>

      <Heading2>{t("dashboard.newOpportunity.title")}</Heading2>

      <FormProvider {...methods}>
        <SectionCard
          iconName={IconName.Wrench}
          title={t("dashboard.newOpportunity.fields.title")}
          subComponent={
            <FormDetails>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <EditableField
                    mode="edit"
                    type="text"
                    label={t("dashboard.newOpportunity.fields.title")}
                    value={field.value}
                    setValue={field.onChange}
                    errorMessage={errors.title?.message}
                  />
                )}
              />
            </FormDetails>
          }
        />

        <SectionCard
          iconName={IconName.ChatsCircle}
          title={t("dashboard.opportunityProfile.contactDetailsTitle")}
          subComponent={
            <FormDetails>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <EditableField
                    mode="edit"
                    type="text"
                    label={t("dashboard.opportunityProfile.contactDetails.name")}
                    value={field.value}
                    setValue={field.onChange}
                    errorMessage={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <EditableField
                    mode="edit"
                    type="text"
                    label={t("dashboard.opportunityProfile.contactDetails.phone")}
                    value={field.value}
                    setValue={field.onChange}
                    errorMessage={errors.phone?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <EditableField
                    mode="edit"
                    type="text"
                    label={t("dashboard.opportunityProfile.contactDetails.email")}
                    value={field.value}
                    setValue={field.onChange}
                    errorMessage={errors.email?.message}
                  />
                )}
              />
              <Controller
                name="waysToContact"
                control={control}
                render={({ field }) => (
                  <EditableField
                    mode="edit"
                    type="checkbox-list"
                    label={t("dashboard.opportunityProfile.contactDetails.waysToContact.label")}
                    value={keysToLabels(field.value ?? [])}
                    setValue={(value) => field.onChange(labelsToKeys(Array.isArray(value) ? value : [value]))}
                    options={options}
                  />
                )}
              />
            </FormDetails>
          }
        />

        <SaveRow>
          <Button
            text={t("dashboard.newOpportunity.submit")}
            backgroundcolor="var(--color-aubergine)"
            textColor="var(--color-white)"
            onClick={handleSubmit(onSubmit)}
            disabled={isPending || !isValid}
          />
        </SaveRow>
      </FormProvider>
    </PageContainer>
  );
}

const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;
