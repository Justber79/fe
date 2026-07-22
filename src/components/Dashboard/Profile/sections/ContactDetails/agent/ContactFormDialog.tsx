"use client";

import Button from "@/components/core/button/Button/Button";
import { Modal } from "@/components/core/modal/Modal";
import { EditableField } from "@/components/EditableField/EditableField";
import { AgentRoles } from "@/config/constants";
import { useCreateAgentContact } from "@/hooks/useCreateAgentContact";
import { useUpdateAgentContactMembership } from "@/hooks/useUpdateAgentContactMembership";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiAgentMembership } from "need4deed-sdk";
import { Controller, ControllerRenderProps, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { ButtonRow, FormDetails } from "../../shared/styles";
import { useEnumTranslation } from "../shared";
import { ContactFormData, createContactFormSchema } from "./contactFormSchema";

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
  contact?: ApiAgentMembership;
  onClose: () => void;
};

const roleKeys = Object.values(AgentRoles);

const emptyValues: ContactFormData = {
  firstName: "",
  middleName: "",
  lastName: "",
  role: "" as AgentRoles,
  email: "",
  phone: "",
  landline: "",
  addressStreet: "",
  addressPostcode: "",
};

function toDefaultValues(contact: ApiAgentMembership | undefined): ContactFormData {
  if (!contact) {
    return emptyValues;
  }
  return {
    firstName: contact.person.firstName ?? "",
    middleName: contact.person.middleName ?? "",
    lastName: contact.person.lastName ?? "",
    role: contact.role,
    email: contact.person.email ?? "",
    phone: contact.person.phone ?? "",
    landline: contact.person.landline ?? "",
    addressStreet: contact.person.address?.street ?? "",
    addressPostcode: contact.person.address?.postcode?.code ?? "",
  };
}

// Handles both "+ Add contact" and per-row "Edit" — same field set, same
// layout, only the submit target and pre-filled values differ.
export const ContactFormDialog = ({ agentId, contact, onClose }: Props) => {
  const { t } = useTranslation();
  const isEditing = Boolean(contact);
  const { mutate: createContact, isPending: isCreating } = useCreateAgentContact(agentId);
  const { mutate: updateContact, isPending: isUpdating } = useUpdateAgentContactMembership(agentId, contact?.id ?? 0);
  const { options, toLabel, toKey } = useEnumTranslation(roleKeys, "dashboard.agentProfile.contactDetails.roles");

  const schema = createContactFormSchema(t);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: toDefaultValues(contact),
  });

  const isPending = isCreating || isUpdating;

  const onSubmit = (values: ContactFormData) => {
    if (isEditing) {
      updateContact(values, { onSuccess: onClose });
    } else {
      createContact(values, { onSuccess: onClose });
    }
  };

  return (
    <Modal isOpen onClose={onClose}>
      <Title>
        {t(
          isEditing
            ? "dashboard.agentProfile.contactDetails.editContact.title"
            : "dashboard.agentProfile.contactDetails.addContact.title",
        )}
      </Title>
      <FormDetails data-testid="agent-contact-form-dialog">
        <Controller
          name="firstName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "firstName"> }) => (
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
          name="middleName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "middleName"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.middleName")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.middleName?.message}
            />
          )}
        />
        <Controller
          name="lastName"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "lastName"> }) => (
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
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "role"> }) => (
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
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "email"> }) => (
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
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "phone"> }) => (
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
          name="landline"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "landline"> }) => (
            <EditableField
              mode="edit"
              type="text"
              label={t("dashboard.agentProfile.contactDetails.landline")}
              value={field.value ?? ""}
              setValue={field.onChange}
              errorMessage={errors.landline?.message}
            />
          )}
        />
        <Controller
          name="addressStreet"
          control={control}
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "addressStreet"> }) => (
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
          render={({ field }: { field: ControllerRenderProps<ContactFormData, "addressPostcode"> }) => (
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
          text={t(
            isEditing
              ? "dashboard.agentProfile.contactDetails.editContact.submit"
              : "dashboard.agentProfile.contactDetails.addContact.submit",
          )}
          onClick={handleSubmit(onSubmit)}
          width="auto"
          disabled={!isValid || isPending}
          padding="var(--volunteer-profile-section-card-header-button-padding)"
        />
      </ButtonRow>
    </Modal>
  );
};
