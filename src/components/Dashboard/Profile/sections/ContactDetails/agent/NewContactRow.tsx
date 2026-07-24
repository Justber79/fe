import Button from "@/components/core/button/Button/Button";
import { AgentRoles } from "@/config/constants";
import { useCreateAgentContact } from "@/hooks/useCreateAgentContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ButtonRow } from "../../shared/styles";
import { useEnumTranslation } from "../shared";
import { ContactFormData, createContactFormSchema } from "./contactFormSchema";
import { ContactFormFields } from "./ContactFormFields";

type Props = {
  agentId: string;
  onDone: () => void;
};

const roleKeys = Object.values(AgentRoles);

const emptyValues: ContactFormData = {
  firstName: "",
  lastName: "",
  role: "" as AgentRoles,
  email: "",
  phone: "",
  landline: "",
};

export const NewContactRow = ({ agentId, onDone }: Props) => {
  const { t } = useTranslation();
  const { mutate: createContact, isPending } = useCreateAgentContact(agentId);
  const { options, toLabel, toKey } = useEnumTranslation(roleKeys, "dashboard.agentProfile.contactDetails.roles");

  const schema = createContactFormSchema(t);
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: emptyValues,
  });

  const onSubmit = (values: ContactFormData) => {
    createContact(values, { onSuccess: onDone });
  };

  return (
    <>
      <ContactFormFields control={control} errors={errors} roleOptions={options} toLabel={toLabel} toKey={toKey} />
      <ButtonRow>
        <Button
          text={t("dashboard.agentProfile.contactDetails.cancel")}
          onClick={onDone}
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
    </>
  );
};
