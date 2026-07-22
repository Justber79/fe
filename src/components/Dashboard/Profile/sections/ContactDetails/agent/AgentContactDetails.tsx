"use client";

import Button from "@/components/core/button/Button/Button";
import { ApiAgentMembership } from "need4deed-sdk";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApiAgentProfileGet } from "../../../types";
import { FormDetails } from "../../shared/styles";
import { EditableSectionProps } from "../../shared/types";
import { ContactFormDialog } from "./ContactFormDialog";
import { ContactRow } from "./ContactRow";

type Props = { agent: ApiAgentProfileGet } & EditableSectionProps;
export type ContactDetailsRef = { handleEditClick: () => void };

// Every contact (the primary representative and every additional one) is
// rendered and edited identically — one row per person, each with its own
// "Edit" button, per fe#848. There is no longer a section-wide edit toggle,
// so `ref`/`onEditingChange` are kept only for API compatibility with the
// ContactDetails switchboard (volunteer/opportunity sections still use them).
export const AgentContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails({ agent }, ref) {
  const { t } = useTranslation();
  const [editingContact, setEditingContact] = useState<ApiAgentMembership | null>(null);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  useImperativeHandle(ref, () => ({ handleEditClick: () => {} }));

  return (
    <>
      <FormDetails>
        {(agent.contacts ?? []).map((contact) => (
          <ContactRow key={contact.id} contact={contact} onEdit={() => setEditingContact(contact)} />
        ))}
      </FormDetails>

      <Button
        text={t("dashboard.agentProfile.contactDetails.addContact.button")}
        onClick={() => setIsAddContactOpen(true)}
        width="auto"
        padding="var(--volunteer-profile-section-card-header-button-padding)"
        backgroundcolor="var(--color-white)"
        textColor="var(--color-aubergine)"
        border="var(--volunteer-profile-section-card-header-button-border)"
      />

      {isAddContactOpen && <ContactFormDialog agentId={String(agent.id)} onClose={() => setIsAddContactOpen(false)} />}
      {editingContact && (
        <ContactFormDialog
          agentId={String(agent.id)}
          contact={editingContact}
          onClose={() => setEditingContact(null)}
        />
      )}
    </>
  );
});
