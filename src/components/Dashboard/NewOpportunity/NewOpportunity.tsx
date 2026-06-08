"use client";
import { Button } from "@/components/core/button";
import { FormInput } from "@/components/core/common";
import { apiPathOpportunity, DashboardRoutes } from "@/config/constants";
import { useMutationQuery } from "@/hooks";
import { useGetCurrentAgent } from "@/hooks/useGetCurrentAgent";
import { ApiOpportunityGet } from "need4deed-sdk";
import i18next from "i18next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AgentInfo,
  AgentLabel,
  AgentRow,
  AgentValue,
  Card,
  ErrorBanner,
  FieldLabel,
  FieldWrapper,
  PageSubtitle,
  PageTitle,
  SectionTitle,
  Wrapper,
} from "./styled";

type CreateOpportunityBody = {
  title: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  agentId?: number;
};

export function NewOpportunity() {
  const { t } = useTranslation();
  const router = useRouter();
  const { agent, isLoading: agentLoading } = useGetCurrentAgent();

  const [title, setTitle] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [prefilled, setPrefilled] = useState(false);
  useEffect(() => {
    if (!agent?.representative || prefilled) return;
    setContactName(agent.representative.firstName ?? "");
    setContactPhone(agent.representative.phone ?? "");
    setContactEmail(agent.representative.email ?? "");
    setPrefilled(true);
  }, [agent, prefilled]);

  const {
    mutate: createOpportunity,
    isPending,
    error,
  } = useMutationQuery<CreateOpportunityBody, { message: string; data: ApiOpportunityGet }>({
    apiPath: `${apiPathOpportunity}/`,
    method: "post",
    onSuccessCallback: (response) => {
      const id = response?.data?.id;
      if (id) {
        router.push(`/${i18next.language}${DashboardRoutes.Opportunities}/${id}`);
      }
    },
  });

  const validate = () => {
    const next: Record<string, string> = {};
    const required = t("form.error.required");
    if (!title.trim()) next.title = required;
    if (!contactName.trim()) next.contactName = required;
    if (!contactEmail.trim()) next.contactEmail = required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) next.contactEmail = t("form.error.email");
    if (!contactPhone.trim()) next.contactPhone = required;
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    createOpportunity({
      title: title.trim(),
      contact: {
        name: contactName.trim(),
        phone: contactPhone.trim(),
        email: contactEmail.trim(),
      },
      agentId: agent?.id,
    });
  };

  return (
    <Wrapper>
      <Card>
        <PageTitle>{t("dashboard.newOpportunity.title")}</PageTitle>
        <PageSubtitle>{t("dashboard.newOpportunity.subtitle")}</PageSubtitle>

        {error && <ErrorBanner>{t("message.errorGeneric")}</ErrorBanner>}

        <FieldWrapper>
          <FieldLabel>{t("dashboard.newOpportunity.fields.title")}</FieldLabel>
          <FormInput
            value={title}
            onInputChange={setTitle}
            placeHolder={t("dashboard.newOpportunity.fields.titlePlaceholder")}
            errors={errors.title ? [errors.title] : []}
          />
        </FieldWrapper>

        <SectionTitle>{t("dashboard.newOpportunity.contactSection")}</SectionTitle>

        <FieldWrapper>
          <FieldLabel>{t("dashboard.opportunityProfile.contactDetails.name")}</FieldLabel>
          <FormInput
            value={contactName}
            onInputChange={setContactName}
            placeHolder="—"
            errors={errors.contactName ? [errors.contactName] : []}
          />
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel>{t("dashboard.opportunityProfile.contactDetails.email")}</FieldLabel>
          <FormInput
            type="email"
            value={contactEmail}
            onInputChange={setContactEmail}
            placeHolder="—"
            errors={errors.contactEmail ? [errors.contactEmail] : []}
          />
        </FieldWrapper>

        <FieldWrapper>
          <FieldLabel>{t("dashboard.opportunityProfile.contactDetails.phone")}</FieldLabel>
          <FormInput
            value={contactPhone}
            onInputChange={setContactPhone}
            placeHolder="—"
            errors={errors.contactPhone ? [errors.contactPhone] : []}
          />
        </FieldWrapper>

        {!agentLoading && agent && (
          <>
            <SectionTitle>{t("dashboard.newOpportunity.agentSection")}</SectionTitle>
            <AgentInfo>
              <AgentRow>
                <AgentLabel>{t("dashboard.agentProfile.organisationDetails.title")}</AgentLabel>
                <AgentValue>{agent.title}</AgentValue>
              </AgentRow>
              {agent.agentDetails?.address && (
                <AgentRow>
                  <AgentLabel>{t("agentRegistration.fields.addressStreet")}</AgentLabel>
                  <AgentValue>{agent.agentDetails.address}</AgentValue>
                </AgentRow>
              )}
              {agent.district && (
                <AgentRow>
                  <AgentLabel>{t("agentRegistration.fields.district")}</AgentLabel>
                  <AgentValue>{agent.district.title?.toString()}</AgentValue>
                </AgentRow>
              )}
            </AgentInfo>
          </>
        )}

        <Button
          text={t("dashboard.newOpportunity.submit")}
          backgroundcolor="var(--color-aubergine)"
          textColor="var(--color-white)"
          onClick={handleSubmit}
          disabled={isPending}
        />
      </Card>
    </Wrapper>
  );
}
