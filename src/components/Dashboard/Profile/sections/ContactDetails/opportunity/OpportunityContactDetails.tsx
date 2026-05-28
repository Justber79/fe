"use client";
import { useCreateComment } from "@/hooks/useCreateComment";
import { useUpdateComment } from "@/hooks/useUpdateComment";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiOpportunityGet } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { OpportunityContactDetailsDisplay } from "./OpportunityContactDetailsDisplay";
import { OpportunityContactDetailsEdit } from "./OpportunityContactDetailsEdit";
import {
  createOpportunityContactDetailsSchema,
  OpportunityContactDetailsFormData,
} from "./opportunityContactDetailsSchema";

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

  // All comments that use the <|> delimiter (structural: 5+ parts) sorted oldest-first.
  // The oldest is the system comment from the public form; any newer one is a coordinator override.
  const pipedComments = useMemo(
    () =>
      [...opportunity.comments]
        .filter((c) => c.content.split("<|>").length >= 5)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
    [opportunity.comments],
  );

  // The most recent <|> comment is the active contact data.
  const latestPipedComment = pipedComments.at(-1);

  // When 2+ <|> comments exist the newest is the coordinator's override — PATCH it on save.
  // When only 1 exists (system comment) POST a new comment instead.
  const coordinatorCommentId = pipedComments.length > 1 ? (pipedComments.at(-1)?.id ?? null) : null;

  // Preserve address/plz from the original system comment so they survive coordinator edits.
  const originalParts = (pipedComments[0]?.content ?? "").split("<|>");
  const originalAddress = originalParts[2] ?? "";
  const originalPlz = originalParts[3] ?? "";

  const { mutate: createComment, isPending: isCreating } = useCreateComment(opportunity.id, "opportunity");
  const { mutate: updateComment, isPending: isUpdating } = useUpdateComment(
    opportunity.id,
    coordinatorCommentId ?? 0,
    "opportunity",
  );

  const initialFormValues = useMemo(() => {
    if (latestPipedComment) {
      const parts = latestPipedComment.content.split("<|>");
      return { name: parts[1] ?? "", phone: parts[4] ?? "", email: parts[0] ?? "" };
    }
    return { name: "", phone: "", email: "" };
  }, [latestPipedComment]);

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
    const text = `${values.email}<|>${values.name}<|>${originalAddress}<|>${originalPlz}<|>${values.phone}`;
    const onSuccess = () => setIsEditing(false);

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
            isPending={isCreating || isUpdating}
          />
        ) : (
          <OpportunityContactDetailsDisplay />
        )}
      </FormContainer>
    </FormProvider>
  );
});
