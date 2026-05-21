"use client";
import { useUpdateOpportunityContact } from "@/hooks/useUpdateOpportunityContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet, PreferredCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { useEnumTranslation } from "../shared";
import { OpportunityContactDetailsDisplay } from "./OpportunityContactDetailsDisplay";
import { OpportunityContactDetailsEdit } from "./OpportunityContactDetailsEdit";
import {
  createOpportunityContactDetailsSchema,
  OpportunityContactDetailsFormData,
} from "./opportunityContactDetailsSchema";

type Props = {
  opportunity: ApiOpportunityGet;
} & EditableSectionProps;

const COMMUNICATION_TYPES = Object.values(PreferredCommunicationType);

export const OpportunityContactDetails = forwardRef<EditableSectionRef, Props>(function OpportunityContactDetails(
  { opportunity, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateOpportunityContact(opportunity.id);
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    COMMUNICATION_TYPES,
    "dashboard.opportunityProfile.contactDetails.waysToContact",
  );

  const schema = createOpportunityContactDetailsSchema(t);

  const initialFormValues = useMemo(() => {
    const raw = opportunity.contact.waysToContact;
    const validTypes = new Set<string>(COMMUNICATION_TYPES);

    const waysToContact: PreferredCommunicationType[] = Array.isArray(raw)
      ? raw.filter((v): v is PreferredCommunicationType => validTypes.has(v))
      : typeof raw === "string" && validTypes.has(raw)
        ? [raw as PreferredCommunicationType]
        : [];

    const hasContactData = !!(opportunity.contact.name || opportunity.contact.phone || opportunity.contact.email);

    if (!hasContactData) {
      const sorted = [...opportunity.comments].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      for (const comment of sorted) {
        const parts = comment.content.split("<|>");
        if (parts.length >= 5) {
          return { name: parts[1] ?? "", phone: parts[4] ?? "", email: parts[0] ?? "", waysToContact: [] };
        }
      }
    }

    // Fields are listed explicitly to stay in sync with OpportunityContactDetailsFormData.
    // If the schema adds or removes fields, update this object accordingly.
    return {
      name: opportunity.contact.name ?? "",
      phone: opportunity.contact.phone ?? "",
      email: opportunity.contact.email ?? "",
      waysToContact,
    };
  }, [opportunity.contact, opportunity.comments]);

  const methods = useForm<OpportunityContactDetailsFormData>({
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

  const onSubmit = (values: OpportunityContactDetailsFormData) => {
    updateContact(
      {
        contact: {
          id: opportunity.contact.id,
          name: values.name,
          phone: values.phone,
          email: values.email,
          waysToContact: values.waysToContact,
        },
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (!isEditing) {
      reset(initialFormValues);
    }
  }, [initialFormValues, isEditing, reset]);

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="opportunity-contact-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <OpportunityContactDetailsEdit
            options={options}
            keysToLabels={keysToLabels}
            labelsToKeys={labelsToKeys}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <OpportunityContactDetailsDisplay keysToLabels={keysToLabels} />
        )}
      </FormContainer>
    </FormProvider>
  );
});