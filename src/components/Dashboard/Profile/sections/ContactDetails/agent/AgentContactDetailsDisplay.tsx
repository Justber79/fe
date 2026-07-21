import Button from "@/components/core/button/Button/Button";
import { EditableField } from "@/components/EditableField/EditableField";
import { AgentRoles } from "@/config/constants";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApiAgentProfileGet } from "../../../types";
import { FieldWrapper, FormDetails } from "../../shared/styles";
import { useEnumTranslation } from "../shared";
import { AddContactDialog } from "./AddContactDialog";
import { AgentContactDetailsFormData } from "./agentContactDetailsSchema";

type Props = {
  agent: ApiAgentProfileGet;
  keysToLabels: (keys: AgentRoles[]) => string[];
};

export const AgentContactDetailsDisplay = ({ agent, keysToLabels }: Props) => {
  const { t } = useTranslation();
  const { watch } = useFormContext<AgentContactDetailsFormData>();
  const values = watch();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const { toLabel } = useEnumTranslation(Object.values(AgentRoles), "dashboard.agentProfile.contactDetails.roles");

  const fullName = values.firstName
    ? [values.firstName, values.middleName, values.lastName].filter(Boolean).join(" ")
    : "–";

  // The representative is already shown (and editable) above via the form
  // fields bound to `values`; this list surfaces every other AgentPerson
  // membership so an agent can see all contacts on file, not just the one
  // collapsed representative.
  const otherContacts = (agent.contacts ?? []).filter((contact) => contact.person.id !== agent.representative?.id);

  return (
    <>
      <FormDetails>
        <FieldWrapper>
          <>
            <label>{t("dashboard.agentProfile.contactDetails.fullName")}</label>
            <span>{fullName}</span>
          </>
        </FieldWrapper>
        <EditableField
          mode="display"
          type="checkbox-list"
          label={t("dashboard.agentProfile.contactDetails.roles.label")}
          value={values.role ? keysToLabels([values?.role]) : []}
          setValue={() => {}}
        />
        <EditableField
          mode="display"
          type="text"
          label={t("dashboard.agentProfile.contactDetails.email")}
          value={values.email}
          setValue={() => {}}
        />
        <EditableField
          mode="display"
          type="text"
          label={t("dashboard.agentProfile.contactDetails.mobile")}
          value={values.phone}
          setValue={() => {}}
        />
        <EditableField
          mode="display"
          type="text"
          label={t("dashboard.agentProfile.contactDetails.landline")}
          value={values.landline || ""}
          setValue={() => {}}
        />
      </FormDetails>

      {otherContacts.length > 0 && (
        <FormDetails data-testid="agent-other-contacts">
          <FieldWrapper>
            <label>{t("dashboard.agentProfile.contactDetails.additionalContacts.title")}</label>
          </FieldWrapper>
          {otherContacts.map((contact) => {
            const contactName = [contact.person.firstName, contact.person.middleName, contact.person.lastName]
              .filter(Boolean)
              .join(" ");
            return (
              <FieldWrapper key={contact.id}>
                <>
                  <label>{contactName}</label>
                  <span>
                    {toLabel(contact.role)}
                    {contact.person.email ? ` · ${contact.person.email}` : ""}
                    {contact.person.phone ? ` · ${contact.person.phone}` : ""}
                  </span>
                </>
              </FieldWrapper>
            );
          })}
        </FormDetails>
      )}

      <Button
        text={t("dashboard.agentProfile.contactDetails.addContact.button")}
        onClick={() => setIsAddContactOpen(true)}
        width="auto"
        padding="var(--volunteer-profile-section-card-header-button-padding)"
        backgroundcolor="var(--color-white)"
        textColor="var(--color-aubergine)"
        border="var(--volunteer-profile-section-card-header-button-border)"
      />

      {isAddContactOpen && <AddContactDialog agentId={String(agent.id)} onClose={() => setIsAddContactOpen(false)} />}
    </>
  );
};
