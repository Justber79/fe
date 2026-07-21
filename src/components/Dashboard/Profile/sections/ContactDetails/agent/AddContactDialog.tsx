"use client";

import Button from "@/components/core/button/Button/Button";
import { Modal } from "@/components/core/modal/Modal";
import { EditableField } from "@/components/EditableField/EditableField";
import { AgentRoles } from "@/config/constants";
import { useCreateAgentContact } from "@/hooks/useCreateAgentContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ButtonRow, FormDetails } from "../../shared/styles";
import { useEnumTranslation } from "../shared";
import { AddContactFormData, createAddContactSchema } from "./addContactSchema";

const Title = styled.h3`
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-24);
  line-height: var(--line-height-32);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--color-midnight);
  margin: 0 0 var(--spacing-16);
`;

type Props = {
  agentId: string;
  onClose: () => void;
};

const roleKeys = Object.values(AgentRoles);

export const AddContactDialog = ({ agentId, onClose }: Props) => {
  const { t } = useTranslation();
  const { mutate: createContact, isPending } = useCreateAgentContact(agentId);
  const { options, toLabel, toKey } = useEnumTranslation(roleKeys, "dashboard.agentProfile.contactDetails.roles");

  const schema = createAddContactSchema(t);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddContactFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "" as AgentRoles,
      email: "",
      phone: "",
      addressStreet: "",
      addressPostcode: "",
    },
  });

  const onSubmit = (values: AddContactFormData) => {
    createContact(values, { onSuccess: onClose });
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Title>{t("dashboard.agentProfile.contactDetails.addContact.title")}</Title>
      <FormDetails data-testid="agent-add-contact-dialog">
        <Controller
          name="firstName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "firstName"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.firstName")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.firstName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "lastName"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.lastName")}
              value={field.value}
              setValue={field.onChange}
              errorMessage={errors.lastName?.message}
            />
          )}
        />
        <Controller
          name="role"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "role"> }) => (
            <EditableField
              mode="edit"
              type="radio-list"
              label={t("dashboard.agentProfile.contactDetails.roles.label")}
              value={field.value ? toLabel(field.value as AgentRoles) : ""}
              setValue={(value) => field.onChange(toKey(value as string))}
              options={options}
              errorMessage={errors.role?.message}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "email"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.email")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phone"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "phone"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.mobile")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.phone?.message}
            />
          )}
        />
        <Controller
          name="addressStreet"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "addressStreet"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.addContact.addressStreet")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.addressStreet?.message}
            />
          )}
        />
        <Controller
          name="addressPostcode"
          control={control}
          render={({ field }: { field: ControllerRenderProps<AddContactFormData, "addressPostcode"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.addContact.addressPostcode")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.addressPostcode?.message}
            />
          )}
        />
      </FormDetails>

      <ButtonRow>
        <Button
          text={t("dashboard.agentProfile.contactDetails.cancel")}
          onClick={onClose}
          width="auto"
          padding="var(--volunteer-profile-section-card-header-button-padding)"
          backgroundcolor="var(--color-white)"
          textColor="var(--color-aubergine)"
          border="var(--volunteer-profile-section-card-header-button-border)"
        />
        <Button
          text={t("dashboard.agentProfile.contactDetails.addContact.submit")}
          onClick={handleSubmit(onSubmit)}
          width="auto"
          disabled={!isValid || isPending}
          padding="var(--volunteer-profile-section-card-header-button-padding)"
        />
      </ButtonRow>
    </Modal>
  );
};
