import Button from "@/components/core/button/Button/Button";
import { AgentRoles } from "@/config/constants";
import { useUpdateAgentContactMembership } from "@/hooks/useUpdateAgentContactMembership";
import { zodResolver } from "@hookform/resolvers/zod";
import { PencilSimple } from "@phosphor-icons/react";
import { ApiAgentMembership } from "need4deed-sdk";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonRow, FieldWrapper } from "../../shared/styles";
import { useEnumTranslation } from "../shared";
import { ContactFormData, createContactFormSchema } from "./contactFormSchema";
import { ContactFormFields } from "./ContactFormFields";
import { EditIconButton } from "./styles";
import { ConfirmationDialog } from "../../shared/ConfirmationDialog";
import { useDeleteAgentContactMembership } from "@/hooks/useDeleteAgentContactMembership";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  agentId: string;
  contact: ApiAgentMembership;
};

const roleKeys = Object.values(AgentRoles);

function toDefaultValues(contact: ApiAgentMembership): ContactFormData {
  return {
    firstName: contact.person.firstName ?? "",
    lastName: contact.person.lastName ?? "",
    role: contact.role,
    email: contact.person.email ?? "",
    phone: contact.person.phone ?? "",
    landline: contact.person.landline ?? "",
  };
}

export const ContactRow = ({ agentId, contact }: Props) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateContact, isPending } = useUpdateAgentContactMembership(agentId, contact.id);
  const { options, toLabel, toKey } = useEnumTranslation(roleKeys, "dashboard.agentProfile.contactDetails.roles");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const { mutate: deleteContact, isPending: isDeleting } = useDeleteAgentContactMembership(agentId, contact.id);
  const { isAuthorized } = useAuth();

  const schema = createContactFormSchema(t);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: toDefaultValues(contact),
  });

  const handleEditClick = () => {
    reset(toDefaultValues(contact));
    setIsEditing(true);
  };

  const handleCancel = () => {
    reset(toDefaultValues(contact));
    setIsEditing(false);
  };

  const onSubmit = (values: ContactFormData) => {
    updateContact(values, { onSuccess: () => setIsEditing(false) });
  };
  const { person } = contact;
  const fullName = [person.firstName, person.lastName].filter(Boolean).join(" ") || "–";
  if (isEditing) {
    return (
      <>
        <ContactFormFields control={control} errors={errors} roleOptions={options} toLabel={toLabel} toKey={toKey} />
        <ButtonRow>
          <Button
            text={t("dashboard.agentProfile.contactDetails.cancel")}
            onClick={handleCancel}
            width="auto"
            padding="var(--volunteer-profile-section-card-header-button-padding)"
            backgroundcolor="var(--color-white)"
            textColor="var(--color-aubergine)"
            border="var(--volunteer-profile-section-card-header-button-border)"
          />
          <Button
            text={t("dashboard.agentProfile.contactDetails.saveChanges")}
            onClick={handleSubmit(onSubmit)}
            width="auto"
            disabled={!isDirty || !isValid || isPending}
            padding="var(--volunteer-profile-section-card-header-button-padding)"
          />
          {isAuthorized && (
            <Button
              text={t("dashboard.agentProfile.contactDetails.deleteContact.button")}
              onClick={() => setOpenDeleteDialog(true)}
              width="auto"
              padding="var(--volunteer-profile-section-card-header-button-padding)"
              backgroundcolor="var(--color-red-500)"
              disabled={isDeleting}
            />
          )}
        </ButtonRow>

        {openDeleteDialog && (
          <ConfirmationDialog
            title={t("dashboard.agentProfile.contactDetails.deleteContact.confirmTitle")}
            message={t("dashboard.agentProfile.contactDetails.deleteContact.confirmMessage", {
              name: fullName,
            })}
            confirmText={t("dashboard.agentProfile.contactDetails.deleteContact.confirmText")}
            cancelText={t("dashboard.agentProfile.contactDetails.cancel")}
            onCancel={() => setOpenDeleteDialog(false)}
            onConfirm={() =>
              deleteContact(undefined, {
                onSuccess: () => {
                  setOpenDeleteDialog(false);
                  setIsEditing(false);
                },
              })
            }
          />
        )}
      </>
    );
  }

  const details = [toLabel(contact.role), person.email, person.phone, person.landline].filter(Boolean);

  return (
    <FieldWrapper data-testid="agent-contact-row">
      <>
        <label>{fullName}</label>
        <span>{details.join(" · ")}</span>
      </>
      <EditIconButton
        type="button"
        onClick={handleEditClick}
        aria-label={t("dashboard.agentProfile.contactDetails.edit")}
      >
        <PencilSimple size={16} weight="bold" />
      </EditIconButton>
    </FieldWrapper>
  );
};
