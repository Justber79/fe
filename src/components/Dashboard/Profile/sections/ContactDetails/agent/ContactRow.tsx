import Button from "@/components/core/button/Button/Button";
import { AgentRoles } from "@/config/constants";
import { ApiAgentMembership } from "need4deed-sdk";
import { useTranslation } from "react-i18next";
import { FieldWrapper } from "../../shared/styles";
import { useEnumTranslation } from "../shared";

type Props = {
  contact: ApiAgentMembership;
  onEdit: () => void;
};

// Uniform read-only row for every contact — primary and additional alike —
// each with the same "Edit" affordance, per fe#848.
export const ContactRow = ({ contact, onEdit }: Props) => {
  const { t } = useTranslation();
  const { toLabel } = useEnumTranslation(Object.values(AgentRoles), "dashboard.agentProfile.contactDetails.roles");
  const { person } = contact;

  const fullName = [person.firstName, person.middleName, person.lastName].filter(Boolean).join(" ") || "–";
  const address = [person.address?.street, person.address?.postcode?.code].filter(Boolean).join(", ");

  const details = [toLabel(contact.role), person.email, person.phone, person.landline, address].filter(Boolean);

  return (
    <FieldWrapper data-testid="agent-contact-row">
      <>
        <label>{fullName}</label>
        <span>{details.join(" · ")}</span>
      </>
      <Button
        text={t("dashboard.agentProfile.contactDetails.edit")}
        onClick={onEdit}
        width="auto"
        padding="var(--volunteer-profile-section-card-header-button-padding)"
        backgroundcolor="var(--color-white)"
        textColor="var(--color-aubergine)"
        border="var(--volunteer-profile-section-card-header-button-border)"
      />
    </FieldWrapper>
  );
};
