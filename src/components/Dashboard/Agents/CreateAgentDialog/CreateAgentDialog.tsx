"use client";

import Button from "@/components/core/button/Button/Button";
import { Modal } from "@/components/core/modal/Modal";
import { EditableField } from "@/components/EditableField/EditableField";
import { apiPathAgent, cacheTTL } from "@/config/constants";
import { useGetQuery } from "@/hooks";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { ApiAgentGet, ApiAgentRegisterConflict } from "need4deed-sdk";
import Link from "next/link";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonRow, FormDetails } from "../../Profile/sections/shared/styles";
import { CreateAgentFormData, createAgentFormSchema } from "./createAgentFormSchema";
import { ConflictBox, DialogTitle } from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const emptyValues: CreateAgentFormData = { title: "", addressStreet: "", addressPostcode: "" };

export const CreateAgentDialog = ({ isOpen, onClose }: Props) => {
  const { t, i18n } = useTranslation();
  const [conflict, setConflict] = useState<ApiAgentRegisterConflict | null>(null);
  const { mutate: createAgent, isPending } = useCreateAgent(setConflict);

  const { data: conflictAgent } = useGetQuery<ApiAgentGet>({
    queryKey: ["agent", String(conflict?.agentId)],
    apiPath: `${apiPathAgent}/${conflict?.agentId}`,
    enabled: !!conflict,
    staleTime: cacheTTL,
  });

  const schema = createAgentFormSchema(t);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateAgentFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: emptyValues,
  });

  const handleClose = () => {
    reset(emptyValues);
    setConflict(null);
    onClose();
  };

  const onSubmit = (values: CreateAgentFormData) => {
    setConflict(null);
    createAgent(
      {
        title: values.title,
        addressStreet: values.addressStreet || undefined,
        addressPostcode: values.addressPostcode || undefined,
      },
      { onSuccess: handleClose },
    );
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <DialogTitle>{t("dashboard.agents.createAgent.title")}</DialogTitle>
      <FormDetails data-testid="create-agent-form-fields">
        <Controller
          name="title"
          control={control}
          render={({ field }: { field: ControllerRenderProps<CreateAgentFormData, "title"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agents.createAgent.name")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.title?.message}
            />
          )}
        />
        <Controller
          name="addressStreet"
          control={control}
          render={({ field }: { field: ControllerRenderProps<CreateAgentFormData, "addressStreet"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agents.createAgent.addressStreet")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.addressStreet?.message}
            />
          )}
        />
        <Controller
          name="addressPostcode"
          control={control}
          render={({ field }: { field: ControllerRenderProps<CreateAgentFormData, "addressPostcode"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agents.createAgent.addressPostcode")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.addressPostcode?.message}
            />
          )}
        />
      </FormDetails>
      {conflict && (
        <ConflictBox role="alert">
          <span>{t(`dashboard.agents.createAgent.conflict.${conflict.conflict}`)}</span>
          {conflictAgent?.title && <strong>{conflictAgent.title}</strong>}
          <Link href={`/${i18n.language}/dashboard/agents/${conflict.agentId}`} onClick={handleClose}>
            {t("dashboard.agents.createAgent.conflict.open")}
          </Link>
        </ConflictBox>
      )}
      <ButtonRow>
        <Button
          text={t("dashboard.agents.createAgent.cancel")}
          onClick={handleClose}
          width="auto"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.agents.createAgent.submit")}
          onClick={handleSubmit(onSubmit)}
          width="auto"
          disabled={!isValid || isPending}
        />
      </ButtonRow>
    </Modal>
  );
};
