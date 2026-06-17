"use client";
import { EditableField } from "@/components/EditableField/EditableField";
import { SectionCard } from "@/components/Dashboard/Profile/common/SectionCard";
import { FormDetails } from "@/components/Dashboard/Profile/sections/shared/styles";
import { BackButton, PageContainer } from "@/components/Dashboard/Profile/styles";
import { IconName } from "@/components/Dashboard/Profile/types";
import Button from "@/components/core/button/Button/Button";
import { apiPathOpportunity, DashboardRoutes } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading2 } from "@/components/styled/text";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { ApiOpportunityGet } from "need4deed-sdk";
import i18next from "i18next";
import { useRouter } from "next/navigation";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { z } from "zod";

const createSchema = (t: (key: string) => string) =>
  z.object({
    title: z.string().min(1, t("form.error.required")),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

type CreateOpportunityBody = {
  title: string;
  agentId?: number;
};

export function NewOpportunity() {
  const { t } = useTranslation();
  const router = useRouter();
  const { agent } = useGetCurrentAgent();

  const methods = useForm<FormData>({
    resolver: zodResolver(createSchema(t)),
    mode: "onChange",
    defaultValues: { title: "" },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = methods;

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
    createOpportunity({ title: values.title, agentId: agent?.id });
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
