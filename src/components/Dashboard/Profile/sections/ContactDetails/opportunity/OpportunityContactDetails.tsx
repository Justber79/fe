"use client";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useUpdateComment } from "@/hooks/useUpdateComment";
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
import { useAgentContactOptions } from "@/hooks/useAgentContactOptions";

const WAYS_TO_CONTACT_TYPES = Object.values(PreferredCommunicationType);

type Props = {
  opportunity: ApiOpportunityGet;
} & EditableSectionProps;

export const OpportunityContactDetails = forwardRef<EditableSectionRef, Props>(function OpportunityContactDetails(
  { opportunity, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const schema = createOpportunityContactDetailsSchema(t);

  const { keysToLabels } = useEnumTranslation(
    WAYS_TO_CONTACT_TYPES,
    "dashboard.opportunityProfile.contactDetails.waysToContact",
  );

  // Piped comments (<|> delimiter) are used as fallback for opportunities
  // that predate the contact API (opportunity.contact).
  const pipedComments = useMemo(
    () =>
      [...opportunity.comments]
        .filter((c) => c.content.split("<|>").length >= 5)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [opportunity.comments],
  );

  const latestPipedComment = pipedComments.at(-1);
  const coordinatorCommentId = pipedComments.length > 1 ? (pipedComments.at(-1)?.id ?? null) : null;
  const originalParts = (pipedComments[0]?.content ?? "").split("<|>");
  const originalAddress = originalParts[2] ?? "";
  const originalPlz = originalParts[3] ?? "";

  // opportunity.contact is provided by the BE for all opportunities since the
  // contact API was introduced. Use it as the primary source; fall back to the
  // piped comment for older opportunities that have no contact Person linked.
  const contactFromApi = opportunity.contact;
  const hasApiContact = !!(contactFromApi?.name || contactFromApi?.phone || contactFromApi?.email);

  const initialFormValues = useMemo((): OpportunityContactDetailsFormData => {
    if (hasApiContact) {
      return {
        name: contactFromApi?.name ?? "",
        phone: contactFromApi?.phone ?? "",
        email: contactFromApi?.email ?? "",
        waysToContact: contactFromApi?.waysToContact ?? [],
      };
    }
    if (latestPipedComment) {
      const parts = latestPipedComment.content.split("<|>");
      return { name: parts[1] ?? "", phone: parts[4] ?? "", email: parts[0] ?? "", waysToContact: [] };
    }
    return { name: "", phone: "", email: "", waysToContact: [] };
  }, [contactFromApi, latestPipedComment, hasApiContact]);

  const { mutate: updateContact, isPending: isUpdating } = useUpdateOpportunityContact(opportunity.id);
  const { mutate: createComment, isPending: isCreating } = useCreateComment(opportunity.id, "opportunity");
  const { mutate: updateComment, isPending: isUpdatingComment } = useUpdateComment(
    opportunity.id,
    coordinatorCommentId ?? 0,
    "opportunity",
  );

  const { nameIdMap, options } = useAgentContactOptions(opportunity, isEditing);
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
    const onSuccess = () => setIsEditing(false);

    // Use the contact API when a Person is linked (contactFromApi.id exists).
    // Fall back to piped comment for legacy opportunities without a linked Person.
    if (contactFromApi?.id) {
      updateContact({ contact: { id: nameIdMap.titleToId[values.name] } }, { onSuccess });
      return;
    }

    const text = `${values.email}<|>${values.name}<|>${originalAddress}<|>${originalPlz}<|>${values.phone}`;
    if (coordinatorCommentId !== null) {
      updateComment({ text }, { onSuccess });
    } else {
      createComment({ text, entityType: "opportunity", entityId: opportunity.id }, { onSuccess });
    }
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
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isUpdating || isCreating || isUpdatingComment}
            options={options}
          />
        ) : (
          <OpportunityContactDetailsDisplay keysToLabels={keysToLabels} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
