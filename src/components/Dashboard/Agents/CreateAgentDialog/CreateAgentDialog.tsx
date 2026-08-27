"use client";

import Button from "@/components/core/button/Button/Button";
import { Modal } from "@/components/core/modal/Modal";
import { EditableField } from "@/components/EditableField/EditableField";
import { useCreateAgent } from "@/hooks/useCreateAgent";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonRow, FormDetails } from "../../Profile/sections/shared/styles";
import { CreateAgentFormData, createAgentFormSchema } from "./createAgentFormSchema";
import { DialogTitle } from "./styles";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const emptyValues: CreateAgentFormData = { title: "", addressStreet: "", addressPostcode: "" };

// Coordinator/admin-only "+" flow from the Agents table header (fe#911): a
// bare Agent with no linked Person/User, for an NGO the coordinator already
// has details for before it has self-registered. Deliberately minimal — just
// enough to create the placeholder record; richer fields (type, services,
// languages, about) are filled in later via the agent's own profile page,
// same as any other agent.
export const CreateAgentDialog = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();
  const { mutate: createAgent, isPending } = useCreateAgent();

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
    onClose();
  };

  const onSubmit = (values: CreateAgentFormData) => {
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
