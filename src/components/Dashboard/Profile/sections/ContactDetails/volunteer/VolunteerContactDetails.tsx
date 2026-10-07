"use client";
import { useUpdateVolunteerContact } from "@/hooks/useUpdateVolunteerContact";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiVolunteerGet, VolunteerCommunicationType } from "need4deed-sdk";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormContainer } from "../../shared/styles";
import { EditableSectionProps, EditableSectionRef } from "../../shared/types";
import { useEditingChangeNotifier } from "../../shared/useEditingChangeNotifier";
import { useEnumTranslation } from "../shared";
import { createVolunteerContactDetailsSchema, VolunteerContactDetailsFormData } from "./volunteerContactDetailsSchema";
import { VolunteerContactDetailsDisplay } from "./VolunteerContactDetailsDisplay";
import { VolunteerContactDetailsEdit } from "./VolunteerContactDetailsEdit";

type Props = {
  volunteer: ApiVolunteerGet;
} & EditableSectionProps;

const COMMUNICATION_TYPES = Object.values(VolunteerCommunicationType);

export const VolunteerContactDetails = forwardRef<EditableSectionRef, Props>(function VolunteerContactDetails(
  { volunteer, onEditingChange },
  ref,
) {
  const { t } = useTranslation();
  const { mutate: updateContact, isPending } = useUpdateVolunteerContact(String(volunteer.id));
  const [isEditing, setIsEditing] = useState(false);

  useEditingChangeNotifier(isEditing, onEditingChange);

  const { options, keysToLabels, labelsToKeys } = useEnumTranslation(
    COMMUNICATION_TYPES,
    "dashboard.volunteerProfile.contactDetails.preferredCommunicationType",
  );

  const schema = createVolunteerContactDetailsSchema(t);

  const initialFormValues = useMemo(
    (): VolunteerContactDetailsFormData => ({
      phone: volunteer.person.phone ?? "",
      email: volunteer.person.email ?? "",
      street: volunteer.person.address?.street ?? "",
      postcode: volunteer.person.address?.postcode?.code ?? "",
      preferredCommunicationType: volunteer.preferredCommunicationType ?? [],
    }),
    [volunteer],
  );

  const methods = useForm<VolunteerContactDetailsFormData>({
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

  const onSubmit = (values: VolunteerContactDetailsFormData) => {
    updateContact(
      {
        // Only what this form edits, plus the fields the schema requires: a
        // spread of the cached person could put back a stale name.
        person: {
          id: volunteer.person.id,
          firstName: volunteer.person.firstName,
          email: values.email,
          phone: values.phone,
          // The id keeps older backends patching the right address; city isn't
          // edited here, so it isn't sent.
          address: {
            ...(volunteer.person.address?.id ? { id: volunteer.person.address.id } : {}),
            street: values.street.trim(),
            postcode: { code: values.postcode },
          },
        },
        preferredCommunicationType: values.preferredCommunicationType,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  useEffect(() => {
    if (isEditing) return;
    reset(initialFormValues);
  }, [initialFormValues, isEditing, reset]);

  return (
    <FormProvider {...methods}>
      <FormContainer data-testid="volunteer-contact-details-container" $isEditing={isEditing}>
        {isEditing ? (
          <VolunteerContactDetailsEdit
            options={options}
            keysToLabels={keysToLabels}
            labelsToKeys={labelsToKeys}
            onCancel={handleCancel}
            onSubmit={handleSubmit(onSubmit)}
            isPending={isPending}
          />
        ) : (
          <VolunteerContactDetailsDisplay keysToLabels={keysToLabels} />
        )}
      </FormContainer>
    </FormProvider>
  );
});
