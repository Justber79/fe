"use client";

import { PlusIcon } from "@phosphor-icons/react";
import { ApiAgentProfileGet } from "../../../types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { FormDetails } from "../../shared/styles";
import { EditableSectionProps } from "../../shared/types";
import { ContactRow } from "./ContactRow";
import { NewContactRow } from "./NewContactRow";
import { AddContactButton, AddContactRow } from "./styles";

type Props = { agent: ApiAgentProfileGet } & EditableSectionProps;
export type ContactDetailsRef = { handleEditClick: () => void };

// Every contact (the primary representative and every additional one) is
// rendered and edited identically — one row per person, each expanding in
// place to edit, per fe#854. There is no longer a section-wide edit toggle,
// so `ref`/`onEditingChange` are kept only for API compatibility with the
// ContactDetails switchboard (volunteer/opportunity sections still use them).
export const AgentContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails({ agent }, ref) {
  const { t } = useTranslation();
  const [isAddingContact, setIsAddingContact] = useState(false);

  useImperativeHandle(ref, () => ({ handleEditClick: () => {} }));

  return (
    <>
      <FormDetails>
        {(agent.contacts ?? []).map((contact) => (
          <ContactRow key={contact.id} agentId={String(agent.id)} contact={contact} />
        ))}
        {isAddingContact && <NewContactRow agentId={String(agent.id)} onDone={() => setIsAddingContact(false)} />}
      </FormDetails>

      {!isAddingContact && (
        <AddContactRow>
          <AddContactButton
            type="button"
            onClick={() => setIsAddingContact(true)}
            aria-label={t("dashboard.agentProfile.contactDetails.addContact.button")}
          >
            <PlusIcon size={16} weight="bold" />
          </AddContactButton>
        </AddContactRow>
      )}
    </>
  );
});
