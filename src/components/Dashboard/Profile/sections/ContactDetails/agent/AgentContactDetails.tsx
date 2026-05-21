"use client";

import { AgentRoles } from "@/config/constants";
import { useUpdateAgentContact } from "@/hooks/useUpdateAgentContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ApiAgentProfileGet } from "../../../types";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { useEnumTranslation } from "../shared";
import { formatAddress, parseAddress } from "./agentAddressUtils";
import { AgentContactDetailsDisplay } from "./AgentContactDetailsDisplay";
import { AgentContactDetailsEdit } from "./AgentContactDetailsEdit";
import { AgentContactDetailsFormData, createAgentContactDetailsSchema } from "./agentContactDetailsSchema";

type Props = {
  agent: ApiAgentProfileGet;
} & EditableSectionProps;

export type ContactDetailsRef = {
  handleEditClick: () => void;
};

const roleKeys = Object.values(AgentRoles);

export const AgentContactDetails = forwardRef<ContactDetailsRef, Props>(function ContactDetails(
  { agent, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateAgent, isPending } = useUpdateAgentContact(
    String(agent?.representative?.id),
    String(agent?.id),
  );
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const { options, keysToLabels, toLabel, toKey } = useEnumTranslation(
    roleKeys,
    "dashboard.agentProfile.contactDetails.roles",
  );

  const schema = createAgentContactDetailsSchema(t);

  const initialFormValues = useMemo(
    (): AgentContactDetailsFormData => ({
      firstName: agent?.representative?.firstName ?? "",
      middleName: agent?.representative?.middleName ?? "",
      lastName: agent?.representative?.lastName ?? "",
      role: agent?.representative?.role as AgentContactDetailsFormData["role"],
      email: agent?.representative?.email ?? "",
      phone: agent?.representative?.phone ?? "",
      landline: agent?.representative?.landline ?? "",
      address: formatAddress(agent?.representative?.address),
    }),
    [agent],
  );

  const methods = useForm<AgentContactDetailsFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialFormValues,
  });

  const { handleSubmit, reset } = methods;

  const handleEditClick = () => setIsEditing(true);

  useImperativeHandle(ref, () => ({ handleEditClick }));

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const onSubmit = (values: AgentContactDetailsFormData) => {
    const addressData = parseAddress(values.address ?? "");
    updateAgent(
      {
        ...values,
        address: {
          id: agent.representative?.address?.id,
          street: addressData.street,
          city: addressData.city,
          postcode: {
            id: agent.representative?.address?.postcode?.id,
            code: addressData.postcode,
          },
        },
      },
      {
        onSuccess: () => {
          reset(values);
          setIsEditing(false);
        },
      },
    );
  };

  useEffect(() => {
    if (isEditing) return;
    reset(initialFormValues);
  }, [initialFormValues, isEditing, reset]);

  return (
    <FormProvider {...methods}>
      <FormContainer $isEditing={isEditing}>
        {isEditing ? (
          <AgentContactDetailsEdit
            options={options}
            toLabel={toLabel}
            toKey={toKey}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <AgentContactDetailsDisplay keysToLabels={keysToLabels} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
